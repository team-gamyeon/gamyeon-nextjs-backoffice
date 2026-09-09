'use client'

import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import {
  createInitialListResourceState,
  createListResourceReducer,
} from '@/shared/lib/list/listResourceReducer'
import type { PaginationMeta } from '@/shared/types/pagination'

export type ListPageResult<T> = { ok: true; items: T[]; meta: PaginationMeta } | { ok: false }

interface UseListResourceParams<T> {
  /** 서버 컴포넌트가 내려준 첫 페이지 */
  initialItems: T[]
  initialMeta: PaginationMeta
  hasInitialLoadError: boolean
  /** 필터·정렬을 식별하는 키. 바뀌면 스크롤을 맨 위로 되돌린다. */
  queryKey: string
  getKey: (item: T) => PropertyKey
  /** 다음 페이지 조회. query가 바뀔 때만 새로 만들어지도록 메모이즈해서 넘길 것. */
  loadPage: (page: number) => Promise<ListPageResult<T>>
  /** 훅 바깥 사정으로 추가 로드를 멈춰야 할 때 (예: 네비게이션 진행 중, 검색어 미확정) */
  isPaused: boolean
}

/**
 * 목록 화면의 무한 스크롤 상태를 관리한다.
 *
 * 상태 전이는 listResourceReducer가 담당하고, 이 훅은 서버 데이터 동기화와
 * 요청 수명주기만 다룬다. 피처별 훅은 loadPage와 isPaused만 채워 넣으면 된다.
 */
export function useListResource<T>({
  initialItems,
  initialMeta,
  hasInitialLoadError,
  queryKey,
  getKey,
  loadPage,
  isPaused,
}: UseListResourceParams<T>) {
  const getKeyRef = useRef(getKey)
  const scrollRootRef = useRef<HTMLDivElement>(null)
  // dispatch보다 먼저 준비되어야 하므로 렌더가 아니라 이펙트에서 갱신한다.
  useEffect(() => {
    getKeyRef.current = getKey
  }, [getKey])

  const reducer = useMemo(() => createListResourceReducer<T>((item) => getKeyRef.current(item)), [])
  const [state, dispatch] = useReducer(
    reducer,
    { initialItems, initialMeta, hasInitialLoadError },
    (seed) =>
      createInitialListResourceState(seed.initialItems, seed.initialMeta, seed.hasInitialLoadError),
  )

  // 서버에서 새 데이터가 내려오면(필터 변경, router.refresh) 목록을 갈아끼운다.
  // 이때 불러온 페이지가 모두 첫 페이지로 되돌아가므로 스크롤도 함께 올린다.
  // 그러지 않으면 목록이 짧아진 만큼 화면이 튄다.
  const isFirstDataRef = useRef(true)
  useEffect(() => {
    if (isFirstDataRef.current) {
      isFirstDataRef.current = false
      return
    }
    dispatch({
      type: 'reset',
      items: initialItems,
      meta: initialMeta,
      hasError: hasInitialLoadError,
    })
    scrollRootRef.current?.scrollTo({ top: 0 })
  }, [initialItems, initialMeta, hasInitialLoadError])

  // 필터가 바뀐 경우에만 스크롤을 되돌린다. 단순 새로고침에는 위치를 유지한다.
  const isFirstQueryRef = useRef(true)
  useEffect(() => {
    if (isFirstQueryRef.current) {
      isFirstQueryRef.current = false
      return
    }
    scrollRootRef.current?.scrollTo({ top: 0 })
  }, [queryKey])

  // 동시 호출 차단. state.isLoading은 다음 렌더에야 반영되므로 래치가 따로 필요하다.
  const inFlightRef = useRef(false)
  const { hasMore, generation, loadError } = state
  const currentPage = state.meta.page

  const loadMore = useCallback(async () => {
    const isInitialRetry = loadError === 'initial'
    if (inFlightRef.current || isPaused || (!hasMore && !isInitialRetry)) return

    const mode = isInitialRetry ? 'replace' : 'append'
    const page = isInitialRetry ? currentPage : currentPage + 1

    inFlightRef.current = true
    dispatch({ type: 'loadStarted' })

    try {
      const result = await loadPage(page)
      if (!result.ok) {
        dispatch({
          type: 'loadFailed',
          generation,
          loadError: isInitialRetry ? 'initial' : 'loadMore',
        })
        return
      }
      dispatch({ type: 'pageLoaded', generation, items: result.items, meta: result.meta, mode })
    } catch {
      dispatch({
        type: 'loadFailed',
        generation,
        loadError: isInitialRetry ? 'initial' : 'loadMore',
      })
    } finally {
      inFlightRef.current = false
    }
  }, [currentPage, generation, hasMore, isPaused, loadError, loadPage])

  /**
   * 필터를 바꾸기 직전에 호출한다. 진행 중이던 다음 페이지 요청의 응답을
   * 새 목록에 섞이지 않게 버린다.
   *
   * 여기서 inFlightRef를 풀면 안 된다. 응답은 버려도 요청 자체는 아직 날아가는 중이라,
   * 래치를 풀면 같은 페이지를 한 번 더 부를 수 있다. 래치는 loadMore의 finally가 푼다.
   */
  const invalidate = useCallback(() => {
    dispatch({ type: 'invalidate' })
  }, [])

  /**
   * 서버 재조회 없이 목록 안의 한 항목만 반영한다.
   *
   * router.refresh()를 쓰면 불러온 페이지가 전부 첫 페이지로 되돌아간다.
   * 무엇이 바뀌었는지 이미 아는 수정·삭제에는 재조회가 필요 없다.
   *
   * 대신 정렬 기준 필드가 바뀌면 실제 정렬 위치와 어긋난 채로 남는다.
   * 다음 필터 변경이나 재조회 때 정리된다.
   */
  const updateItem = useCallback((item: T) => {
    dispatch({ type: 'itemUpdated', item })
  }, [])

  const removeItem = useCallback((key: PropertyKey) => {
    dispatch({ type: 'itemRemoved', key })
  }, [])

  return {
    items: state.items,
    meta: state.meta,
    hasMore: state.hasMore,
    isLoadingMore: state.isLoading,
    loadMoreError: state.loadError !== null,
    /**
     * 첫 페이지를 못 받아왔다. 목록이 빈 이유가 "결과 없음"이 아니라 "조회 실패"라는 뜻.
     * 재시도가 성공하면 자동으로 false가 된다.
     */
    initialLoadFailed: state.loadError === 'initial',
    loadMore,
    invalidate,
    updateItem,
    removeItem,
    scrollRootRef,
  }
}
