'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useListQueryNavigation } from '@/shared/hooks/useListQueryNavigation'
import { hasNextPage, hasNextPageAfterLoad, mergeUniqueBy } from '@/shared/lib/pagination'
import { getInterviewsAction } from '@/featured/interviews/actions/interviews.action'
import { mapApiInterviewToSession } from '@/featured/interviews/utils/mapApiInterviewToSession'
import type { PaginationMeta, SortOrder } from '@/shared/types/pagination'
import type {
  InterviewListQuery,
  InterviewSession,
  InterviewSortBy,
  InterviewStatus,
} from '@/featured/interviews/types'

interface UseInterviewsParams {
  initialSessions: InterviewSession[]
  initialMeta: PaginationMeta
  query: InterviewListQuery
  hasInitialLoadError?: boolean
}

export function useInterviews({
  initialSessions,
  initialMeta,
  query,
  hasInitialLoadError,
}: UseInterviewsParams) {
  const querySearch = query.search ?? ''
  const [sessions, setSessions] = useState(initialSessions)
  const [meta, setMeta] = useState(initialMeta)
  const [hasMore, setHasMore] = useState(
    () => !hasInitialLoadError && hasNextPage(initialMeta, initialSessions.length),
  )
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [loadMoreError, setLoadMoreError] = useState(false)
  const [search, setSearchState] = useState(querySearch)
  const querySearchRef = useRef(querySearch)
  const searchRef = useRef(search)
  const searchWasEditedRef = useRef(false)
  const requestIdRef = useRef(0)
  const isLoadingMoreRef = useRef(false)
  const debouncedSearch = useDebounce(search, 300)
  const { isPending, updateQuery } = useListQueryNavigation()

  useEffect(() => {
    querySearchRef.current = querySearch
    searchRef.current = search
  }, [querySearch, search])

  const invalidateLoadMore = useCallback(() => {
    requestIdRef.current += 1
    isLoadingMoreRef.current = false
    setIsLoadingMore(false)
    setLoadMoreError(false)
  }, [])

  useEffect(() => {
    requestIdRef.current += 1
    isLoadingMoreRef.current = false
    setSessions(initialSessions)
    setMeta(initialMeta)
    setHasMore(hasNextPage(initialMeta, initialSessions.length))
    setIsLoadingMore(false)
    setLoadMoreError(false)
  }, [initialMeta, initialSessions])

  useEffect(() => {
    if (!searchWasEditedRef.current) setSearchState(querySearch)
  }, [querySearch])

  useEffect(() => {
    if (!searchWasEditedRef.current) return

    const normalizedSearch = debouncedSearch.trim()
    if (normalizedSearch === querySearchRef.current) {
      if (searchRef.current.trim() === normalizedSearch) searchWasEditedRef.current = false
      return
    }

    searchWasEditedRef.current = false
    invalidateLoadMore()
    updateQuery({ search: normalizedSearch || undefined }, { scroll: false })
  }, [debouncedSearch, invalidateLoadMore, updateQuery])

  const loadMore = useCallback(async () => {
    if (isLoadingMoreRef.current || isPending || !hasMore) return

    const requestId = ++requestIdRef.current
    const nextPage = meta.page + 1
    isLoadingMoreRef.current = true
    setIsLoadingMore(true)
    setLoadMoreError(false)

    try {
      const result = await getInterviewsAction({
        ...query,
        page: nextPage,
      })

      if (requestId !== requestIdRef.current) return

      if (!result.success || !result.data) {
        setLoadMoreError(true)
        return
      }

      const data = result.data
      const incoming = data.items.map(mapApiInterviewToSession)
      setSessions((current) => mergeUniqueBy(current, incoming, (session) => session.id))
      const nextMeta = {
        totalCount: data.totalCount,
        filteredCount: data.filteredCount,
        page: data.page,
        limit: data.limit,
      }
      setMeta(nextMeta)
      setHasMore(hasNextPageAfterLoad(meta.page, nextMeta, incoming.length))
    } catch (error) {
      if (requestId !== requestIdRef.current) return
      console.error('[useInterviews] Failed to load the next page', error)
      setLoadMoreError(true)
    } finally {
      if (requestId === requestIdRef.current) {
        isLoadingMoreRef.current = false
        setIsLoadingMore(false)
      }
    }
  }, [hasMore, isPending, meta.page, query])

  const setSearch = (value: string) => {
    searchWasEditedRef.current = true
    setSearchState(value)
  }

  const setSelectedStatus = (status: InterviewStatus | 'all') => {
    invalidateLoadMore()
    updateQuery({ status: status === 'all' ? undefined : status })
  }

  const setSortBy = (sortBy: InterviewSortBy) => {
    invalidateLoadMore()
    updateQuery({ sortBy })
  }

  const setSortOrder = (sortOrder: SortOrder) => {
    invalidateLoadMore()
    updateQuery({ sortOrder })
  }

  const resetFilters = () => {
    invalidateLoadMore()
    searchWasEditedRef.current = false
    setSearchState('')
    updateQuery({
      search: undefined,
      status: undefined,
      sortBy: undefined,
      sortOrder: undefined,
      from: undefined,
      to: undefined,
    })
  }

  // InfiniteScrollTrigger는 hasMore/isLoading을 이미 스스로 본다.
  // 여기서는 그쪽이 모르는 조건(네비게이션 진행 중)만 알려준다.
  // hasMore를 넣으면 "모든 항목을 불러왔습니다" 안내가 가려지므로 넣지 않는다.
  const isPaused = isPending

  return {
    sessions,
    meta,
    hasMore,
    isLoadingMore,
    loadMoreError,
    loadMore,
    search,
    setSearch,
    selectedStatus: query.status ?? 'all',
    setSelectedStatus,
    sortBy: query.sortBy,
    setSortBy,
    sortOrder: query.sortOrder,
    setSortOrder,
    isPending,
    isPaused,
    resetFilters,
  }
}

export type { InterviewSortBy }
