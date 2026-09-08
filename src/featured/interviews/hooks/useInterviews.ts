'use client'

import { useCallback } from 'react'
import { useListQueryNavigation } from '@/shared/hooks/useListQueryNavigation'
import { useListResource, type ListPageResult } from '@/shared/hooks/useListResource'
import { useListSearch } from '@/shared/hooks/useListSearch'
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
  hasInitialLoadError = false,
}: UseInterviewsParams) {
  const { isPending, updateQuery } = useListQueryNavigation()
  const queryKey = [
    query.search,
    query.status,
    query.sortBy,
    query.sortOrder,
    query.from,
    query.to,
  ].join('|')

  const loadPage = useCallback(
    async (page: number): Promise<ListPageResult<InterviewSession>> => {
      const result = await getInterviewsAction({ ...query, page })
      if (!result.success) return { ok: false }

      const data = result.data
      return {
        ok: true,
        items: data.items.map(mapApiInterviewToSession),
        meta: {
          totalCount: data.totalCount,
          filteredCount: data.filteredCount,
          page: data.page,
          limit: data.limit,
        },
      }
    },
    [query],
  )

  const {
    items,
    meta,
    hasMore,
    isLoadingMore,
    loadMoreError,
    loadMore,
    invalidate,
    scrollRootRef,
  } = useListResource<InterviewSession>({
    initialItems: initialSessions,
    initialMeta,
    hasInitialLoadError,
    queryKey,
    getKey: (session) => session.id,
    loadPage,
    isPaused: isPending,
  })

  const { search, setSearch, isSearchPending } = useListSearch(query.search ?? '', (nextSearch) => {
    invalidate()
    updateQuery({ search: nextSearch }, { scroll: false })
  })

  const changeQuery = (updates: Parameters<typeof updateQuery>[0]) => {
    invalidate()
    updateQuery(updates)
  }

  const setSelectedStatus = (status: InterviewStatus | 'all') =>
    changeQuery({ status: status === 'all' ? undefined : status })

  const setSortBy = (sortBy: InterviewSortBy) => changeQuery({ sortBy })

  const setSortOrder = (sortOrder: SortOrder) => changeQuery({ sortOrder })

  const resetFilters = () => {
    setSearch('')
    changeQuery({
      search: undefined,
      status: undefined,
      sortBy: undefined,
      sortOrder: undefined,
      from: undefined,
      to: undefined,
    })
  }

  return {
    sessions: items,
    meta,
    hasMore,
    isLoadingMore,
    loadMoreError,
    loadMore,
    scrollRootRef,
    search,
    setSearch,
    selectedStatus: query.status ?? 'all',
    setSelectedStatus,
    sortBy: query.sortBy,
    setSortBy,
    sortOrder: query.sortOrder,
    setSortOrder,
    isPending,
    isPaused: isPending || isSearchPending,
    resetFilters,
  }
}

export type { InterviewSortBy }
