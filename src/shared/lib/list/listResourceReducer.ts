import { hasNextPage, hasNextPageAfterLoad, mergeUniqueBy } from '@/shared/lib/pagination'
import type { PaginationMeta } from '@/shared/types/pagination'

export interface ListResourceState<T> {
  items: T[]
  meta: PaginationMeta
  hasMore: boolean
  isLoading: boolean
  loadError: 'initial' | 'loadMore' | null
  /**
   * offset pagination 목록에서 로컬 항목 제거로 밀려난 경계 항목을 채워야 한다.
   * true인 동안 다음 요청은 다음 페이지가 아니라 현재 마지막 페이지를 다시 조회한다.
   */
  needsReconcile: boolean
  /** 새 mutation 직후의 보충 조회만 자동으로 시작한다. 실패한 요청은 사용자가 재시도한다. */
  shouldAutoReconcile: boolean
  /**
   * 서버에서 새 데이터가 내려오거나 로컬 항목 제거로 offset이 바뀔 때 증가한다.
   * 진행 중이던 페이지 요청의 응답이 뒤늦게 도착했을 때 이 값이 다르면 버린다.
   */
  generation: number
}

export type ListResourceEvent<T> =
  | { type: 'reset'; items: T[]; meta: PaginationMeta; hasError: boolean }
  | { type: 'invalidate' }
  | { type: 'loadStarted'; mode: 'replace' | 'append' | 'reconcile' }
  | { type: 'requestSettled' }
  | {
      type: 'pageLoaded'
      generation: number
      items: T[]
      meta: PaginationMeta
      mode: 'replace' | 'append' | 'reconcile'
    }
  | { type: 'loadFailed'; generation: number; loadError: 'initial' | 'loadMore' }
  // 수정은 목록 안의 항목만 갈아끼운다. 삭제와 필터 이탈은 카운트 의미가 다르므로
  // 별도로 다루며, 아직 불러오지 않은 항목이 있으면 현재 마지막 페이지를 보충한다.
  | { type: 'itemUpdated'; item: T }
  | { type: 'itemDeleted'; key: PropertyKey }
  | { type: 'itemExcluded'; key: PropertyKey }

export function createInitialListResourceState<T>(
  items: T[],
  meta: PaginationMeta,
  hasError: boolean,
): ListResourceState<T> {
  return {
    items,
    meta,
    hasMore: !hasError && hasNextPage(meta, items.length),
    isLoading: false,
    loadError: hasError ? 'initial' : null,
    needsReconcile: false,
    shouldAutoReconcile: false,
    generation: 0,
  }
}

/**
 * 목록 + 페이지네이션 상태 기계.
 *
 * 훅마다 따로 구현하던 요청 취소·중복 제거·다음 페이지 판정을 한곳에 모았다.
 * 순수 함수라 React 없이 검증할 수 있다.
 */
export function createListResourceReducer<T>(getKey: (item: T) => PropertyKey) {
  return function listResourceReducer(
    state: ListResourceState<T>,
    event: ListResourceEvent<T>,
  ): ListResourceState<T> {
    switch (event.type) {
      case 'reset':
        return {
          items: event.items,
          meta: event.meta,
          hasMore: !event.hasError && hasNextPage(event.meta, event.items.length),
          isLoading: false,
          loadError: event.hasError ? 'initial' : null,
          needsReconcile: false,
          shouldAutoReconcile: false,
          generation: state.generation + 1,
        }

      // 필터가 바뀌어 곧 새 데이터가 올 예정. 진행 중인 요청의 응답을 버리게 한다.
      // 목록은 서버 데이터가 도착할 때까지 그대로 두어 화면이 비지 않게 한다.
      case 'invalidate':
        return {
          ...state,
          isLoading: false,
          loadError: null,
          needsReconcile: false,
          shouldAutoReconcile: false,
          generation: state.generation + 1,
        }

      case 'loadStarted':
        return {
          ...state,
          isLoading: true,
          loadError: null,
          shouldAutoReconcile:
            event.mode === 'reconcile' ? false : state.shouldAutoReconcile,
        }

      // 무효화된 요청도 물리적으로는 끝나야 다음 요청을 시작할 수 있다.
      case 'requestSettled':
        return state.isLoading ? { ...state, isLoading: false } : state

      case 'pageLoaded': {
        // 낡은 요청의 응답. 이미 다른 데이터로 넘어갔으므로 버린다.
        if (event.generation !== state.generation) return state

        const isReplacing = event.mode === 'replace'
        const isReconciling = event.mode === 'reconcile'
        const items = isReplacing ? event.items : mergeUniqueBy(state.items, event.items, getKey)
        return {
          ...state,
          items,
          meta: event.meta,
          hasMore: isReplacing || isReconciling
            ? hasNextPage(event.meta, event.items.length)
            : hasNextPageAfterLoad(state.meta.page, event.meta, event.items.length),
          isLoading: false,
          loadError: null,
          needsReconcile: isReconciling ? false : state.needsReconcile,
          shouldAutoReconcile: isReconciling ? false : state.shouldAutoReconcile,
        }
      }

      case 'loadFailed':
        if (event.generation !== state.generation) return state
        return { ...state, isLoading: false, loadError: event.loadError }

      case 'itemUpdated': {
        const targetKey = getKey(event.item)
        if (!state.items.some((item) => getKey(item) === targetKey)) return state

        return {
          ...state,
          items: state.items.map((item) => (getKey(item) === targetKey ? event.item : item)),
        }
      }

      case 'itemDeleted':
      case 'itemExcluded': {
        const items = state.items.filter((item) => getKey(item) !== event.key)
        if (items.length === state.items.length) return state

        const filteredCount = Math.max(0, state.meta.filteredCount - 1)
        const meta = {
          ...state.meta,
          totalCount:
            event.type === 'itemDeleted'
              ? Math.max(0, state.meta.totalCount - 1)
              : state.meta.totalCount,
          filteredCount,
        }
        const needsReconcile = items.length < filteredCount

        return {
          ...state,
          items,
          meta,
          hasMore: hasNextPage(meta, items.length),
          needsReconcile,
          shouldAutoReconcile: needsReconcile,
          // mutation 이전에 시작된 offset 페이지 응답은 어느 스냅샷인지 알 수 없으므로 버린다.
          generation: state.generation + 1,
        }
      }

      default:
        return state
    }
  }
}
