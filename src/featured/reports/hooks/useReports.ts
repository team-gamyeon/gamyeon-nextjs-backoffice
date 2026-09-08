'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useListQueryNavigation } from '@/shared/hooks/useListQueryNavigation'
import { hasNextPage, mergeUniqueBy, toPaginationMeta } from '@/shared/lib/pagination'
import { LIST_PAGE_SIZE } from '@/shared/lib/validation/listQuery'
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
) {
  const committedSearch = query.search ?? ''
  const queryKey = JSON.stringify([query.search, query.status, query.sortBy, query.sortOrder])
  const [search, setSearch] = useState(committedSearch)
  const [reports, setReports] = useState(initialReports)
  const [meta, setMeta] = useState(initialMeta)
  const [loadedQueryKey, setLoadedQueryKey] = useState(queryKey)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [loadMoreError, setLoadMoreError] = useState(false)
  const previousCommittedSearch = useRef(committedSearch)
  const requestVersion = useRef(0)
  const loadMoreInFlight = useRef(false)
  const activeQueryKey = useRef(queryKey)
  const debouncedSearch = useDebounce(search, 250)
  const { isPending, updateQuery, clearQuery } = useListQueryNavigation()
  activeQueryKey.current = queryKey

  useEffect(() => {
    requestVersion.current += 1
    loadMoreInFlight.current = false
    setReports(initialReports)
    setMeta(initialMeta)
    setLoadedQueryKey(queryKey)
    setIsLoadingMore(false)
    setLoadMoreError(false)
  }, [initialMeta, initialReports, queryKey])

  useEffect(() => {
    const previousSearch = previousCommittedSearch.current
    previousCommittedSearch.current = committedSearch
    setSearch((currentSearch) =>
      currentSearch === previousSearch ? committedSearch : currentSearch,
    )
  }, [committedSearch])

  useEffect(() => {
    if (debouncedSearch !== search) return
    if (debouncedSearch.trim() === committedSearch) return

    updateQuery({ search: debouncedSearch.trim() || null }, { resetPage: true })
  }, [committedSearch, debouncedSearch, search, updateQuery])

  const setStatus = (status: ReportStatus | 'all') => {
    updateQuery({ status: status === 'all' ? null : status }, { resetPage: true })
  }

  const setSortBy = (sortBy: ReportSortBy) => {
    updateQuery({ sortBy }, { resetPage: true })
  }

  const setSortOrder = (sortOrder: SortOrder) => {
    updateQuery({ sortOrder }, { resetPage: true })
  }

  const resetFilters = () => {
    setSearch('')
    clearQuery(['search', 'status', 'sortBy', 'sortOrder', 'limit'], { resetPage: true })
  }

  const status: ReportStatus | 'all' = query.status ?? 'all'
  const isActiveQuery = loadedQueryKey === queryKey
  const visibleReports = isActiveQuery ? reports : initialReports
  const visibleMeta = isActiveQuery ? meta : initialMeta
  const hasMore = isActiveQuery && hasNextPage(visibleMeta)

  const loadMore = useCallback(async () => {
    if (loadMoreInFlight.current || !hasMore || !isActiveQuery) return

    const version = requestVersion.current
    const requestQueryKey = queryKey
    const nextPage = visibleMeta.page + 1
    loadMoreInFlight.current = true
    setIsLoadingMore(true)
    setLoadMoreError(false)

    try {
      const result = await getReportsAction({ ...query, page: nextPage, limit: LIST_PAGE_SIZE })
      if (version !== requestVersion.current || requestQueryKey !== activeQueryKey.current) return

      if (!result.success || !result.data) {
        setLoadMoreError(true)
        return
      }

      const nextReports = result.data.items.map(mapApiReportToAnalysisReport)
      setReports((currentReports) =>
        mergeUniqueBy(currentReports, nextReports, (report) => report.id),
      )
      setMeta(toPaginationMeta(result.data))
    } catch {
      if (version === requestVersion.current && requestQueryKey === activeQueryKey.current) {
        setLoadMoreError(true)
      }
    } finally {
      if (version === requestVersion.current && requestQueryKey === activeQueryKey.current) {
        loadMoreInFlight.current = false
        setIsLoadingMore(false)
      }
    }
  }, [hasMore, isActiveQuery, query, queryKey, visibleMeta.page])

  return {
    reports: visibleReports,
    meta: visibleMeta,
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
    isLoadingMore,
    loadMoreError,
    hasMore,
    loadMore,
    queryKey,
  }
}
