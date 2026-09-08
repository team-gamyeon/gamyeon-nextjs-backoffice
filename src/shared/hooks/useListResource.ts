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
   */
  const invalidate = useCallback(() => {
    inFlightRef.current = false
    dispatch({ type: 'invalidate' })
  }, [])

  return {
    items: state.items,
    meta: state.meta,
    hasMore: state.hasMore,
    isLoadingMore: state.isLoading,
    loadMoreError: state.loadError !== null,
    loadMore,
    invalidate,
    scrollRootRef,
  }
}
