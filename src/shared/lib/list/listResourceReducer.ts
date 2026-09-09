import { hasNextPage, hasNextPageAfterLoad, mergeUniqueBy } from '@/shared/lib/pagination'
import type { PaginationMeta } from '@/shared/types/pagination'

export interface ListResourceState<T> {
  items: T[]
  meta: PaginationMeta
  hasMore: boolean
  isLoading: boolean
  loadError: 'initial' | 'loadMore' | null
  /**
   * 서버에서 새 데이터가 내려올 때마다 증가한다.
   * 진행 중이던 다음 페이지 요청의 응답이 뒤늦게 도착했을 때
   * 이 값이 다르면 버린다.
   */
  generation: number
}

export type ListResourceEvent<T> =
  | { type: 'reset'; items: T[]; meta: PaginationMeta; hasError: boolean }
  | { type: 'invalidate' }
  | { type: 'loadStarted' }
  | {
      type: 'pageLoaded'
      generation: number
      items: T[]
      meta: PaginationMeta
      mode: 'replace' | 'append'
    }
  | { type: 'loadFailed'; generation: number; loadError: 'initial' | 'loadMore' }
  // 서버 재조회 없이 목록 안의 한 항목만 갈아끼우거나 빼낸다.
  // 재조회하면 불러온 페이지가 전부 1페이지로 되돌아가기 때문이다.
  | { type: 'itemUpdated'; item: T }
  | { type: 'itemRemoved'; key: PropertyKey }

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
          generation: state.generation + 1,
        }

      // 필터가 바뀌어 곧 새 데이터가 올 예정. 진행 중인 요청의 응답을 버리게 한다.
      // 목록은 서버 데이터가 도착할 때까지 그대로 두어 화면이 비지 않게 한다.
      case 'invalidate':
        return { ...state, isLoading: false, loadError: null, generation: state.generation + 1 }

      case 'loadStarted':
        return { ...state, isLoading: true, loadError: null }

      case 'pageLoaded': {
        // 낡은 요청의 응답. 이미 다른 데이터로 넘어갔으므로 버린다.
        if (event.generation !== state.generation) return state

        const isReplacing = event.mode === 'replace'
        const items = isReplacing ? event.items : mergeUniqueBy(state.items, event.items, getKey)
        return {
          ...state,
          items,
          meta: event.meta,
          hasMore: isReplacing
            ? hasNextPage(event.meta, event.items.length)
            : hasNextPageAfterLoad(state.meta.page, event.meta, event.items.length),
          isLoading: false,
          loadError: null,
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

      case 'itemRemoved': {
        const items = state.items.filter((item) => getKey(item) !== event.key)
        if (items.length === state.items.length) return state

        return {
          ...state,
          items,
          meta: {
            ...state.meta,
            totalCount: Math.max(0, state.meta.totalCount - 1),
            filteredCount: Math.max(0, state.meta.filteredCount - 1),
          },
        }
      }

      default:
        return state
    }
  }
}
