'use client'

import { useCallback, useMemo } from 'react'
import { useListQueryNavigation } from '@/shared/hooks/useListQueryNavigation'
import { useListResource, type ListPageResult } from '@/shared/hooks/useListResource'
import { useListSearch } from '@/shared/hooks/useListSearch'
import { countBy } from '@/shared/lib/countBy'
import { mapApiReportToAnalysisReport } from '@/shared/lib/utils/mappers'
import { getReportsAction } from '@/featured/reports/actions/reports.action'
import type { PaginationMeta, SortOrder } from '@/shared/types/pagination'
import type {
  AnalysisReport,
  GetReportsParams,
  ReportSortBy,
  ReportStatus,
} from '@/featured/reports/types'

export function useReports(
  initialReports: AnalysisReport[],
  initialMeta: PaginationMeta,
  query: GetReportsParams,
  hasInitialLoadError = false,
) {
  const { isPending, updateQuery, clearQuery } = useListQueryNavigation()
  const queryKey = [query.search, query.status, query.sortBy, query.sortOrder].join('|')

  const loadPage = useCallback(
    async (page: number): Promise<ListPageResult<AnalysisReport>> => {
      const result = await getReportsAction({ ...query, page })
      if (!result.success) return { ok: false }

      const data = result.data
      return {
        ok: true,
        items: data.items.map(mapApiReportToAnalysisReport),
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
    initialLoadFailed,
    loadMore,
    invalidate,
    scrollRootRef,
  } = useListResource<AnalysisReport>({
    initialItems: initialReports,
    initialMeta,
    hasInitialLoadError,
    queryKey,
    getKey: (report) => report.id,
    loadPage,
    isPaused: isPending,
  })

  const { search, setSearch, isSearchPending } = useListSearch(query.search ?? '', (nextSearch) => {
    invalidate()
    updateQuery({ search: nextSearch })
  })

  const statusCounts = useMemo(() => countBy(items, (report) => report.status), [items])

  const changeQuery = (updates: Parameters<typeof updateQuery>[0]) => {
    invalidate()
    updateQuery(updates)
  }

  const status: ReportStatus | 'all' = query.status ?? 'all'

  const setStatus = (nextStatus: ReportStatus | 'all') =>
    changeQuery({ status: nextStatus === 'all' ? null : nextStatus })

  const setSortBy = (sortBy: ReportSortBy) => changeQuery({ sortBy })

  const setSortOrder = (sortOrder: SortOrder) => changeQuery({ sortOrder })

  const resetFilters = () => {
    setSearch('')
    invalidate()
    clearQuery(['search', 'status', 'sortBy', 'sortOrder'])
  }

  return {
    reports: items,
    statusCounts,
    meta,
    search,
    setSearch,
    status,
    setStatus,
    sortBy: query.sortBy ?? 'createdAt',
    setSortBy,
    sortOrder: query.sortOrder ?? 'desc',
    setSortOrder,
    resetFilters,
    isPending,
    isPaused: isPending || isSearchPending,
    isLoadingMore,
    loadMoreError,
    initialLoadFailed,
    hasMore,
    loadMore,
    scrollRootRef,
  }
}
