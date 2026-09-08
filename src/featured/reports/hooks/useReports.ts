'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useListQueryNavigation } from '@/shared/hooks/useListQueryNavigation'
import { hasNextPage, mergeUniqueBy } from '@/shared/lib/pagination'
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
  hasInitialLoadError?: boolean,
) {
  const committedSearch = query.search ?? ''
  const queryKey = JSON.stringify([query.search, query.status, query.sortBy, query.sortOrder])
  const [search, setSearch] = useState(committedSearch)
  const [reports, setReports] = useState(initialReports)
  const [meta, setMeta] = useState(initialMeta)
  const [loadedQueryKey, setLoadedQueryKey] = useState(queryKey)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [loadMoreError, setLoadMoreError] = useState(false)
  // 서버가 요청한 page를 무시하고 같은 페이지를 돌려준 상태. 무한 요청을 막기 위해 정지시킨다.
  const [isStalled, setIsStalled] = useState(false)
  const previousCommittedSearch = useRef(committedSearch)
  const requestVersion = useRef(0)
  const loadMoreInFlight = useRef(false)
  const committedSearchRef = useRef(committedSearch)
  const debouncedSearch = useDebounce(search, 250)
  const { isPending, updateQuery, clearQuery } = useListQueryNavigation()

  useEffect(() => {
    committedSearchRef.current = committedSearch
  }, [committedSearch])

  useEffect(() => {
    requestVersion.current += 1
    loadMoreInFlight.current = false
    setReports(initialReports)
    setMeta(initialMeta)
    setLoadedQueryKey(queryKey)
    setIsLoadingMore(false)
    setLoadMoreError(false)
    setIsStalled(false)
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
    if (debouncedSearch.trim() === committedSearchRef.current) return

    updateQuery({ search: debouncedSearch.trim() || null })
  }, [debouncedSearch, search, updateQuery])

  const setStatus = (status: ReportStatus | 'all') => {
    updateQuery({ status: status === 'all' ? null : status })
  }

  const setSortBy = (sortBy: ReportSortBy) => {
    updateQuery({ sortBy })
  }

  const setSortOrder = (sortOrder: SortOrder) => {
    updateQuery({ sortOrder })
  }

  const resetFilters = () => {
    setSearch('')
    clearQuery(['search', 'status', 'sortBy', 'sortOrder', 'limit'])
  }

  const status: ReportStatus | 'all' = query.status ?? 'all'
  const isActiveQuery = loadedQueryKey === queryKey
  const visibleReports = isActiveQuery ? reports : initialReports
  const visibleMeta = isActiveQuery ? meta : initialMeta
  const visibleReportCount = isActiveQuery ? reports.length : initialReports.length
  const hasMore =
    isActiveQuery &&
    !hasInitialLoadError &&
    !isStalled &&
    hasNextPage(visibleMeta, visibleReportCount)

  const loadMore = useCallback(async () => {
    if (loadMoreInFlight.current || !hasMore || !isActiveQuery) return

    const version = requestVersion.current
    const requestQueryKey = queryKey
    const nextPage = visibleMeta.page + 1
    loadMoreInFlight.current = true
    setIsLoadingMore(true)
    setLoadMoreError(false)

    try {
      const result = await getReportsAction({ ...query, page: nextPage })
      if (version !== requestVersion.current || requestQueryKey !== queryKey) return

      if (!result.success || !result.data) {
        setLoadMoreError(true)
        return
      }

      const nextReports = result.data.items.map(mapApiReportToAnalysisReport)
      setReports((currentReports) =>
        mergeUniqueBy(currentReports, nextReports, (report) => report.id),
      )
      const nextMeta = {
        totalCount: result.data.totalCount,
        filteredCount: result.data.filteredCount,
        page: result.data.page,
        limit: result.data.limit,
      }
      setMeta(nextMeta)
      // 서버가 페이지를 진전시키지 않았으면 같은 응답이 반복되므로 정지한다.
      if (!(nextMeta.page > visibleMeta.page)) setIsStalled(true)
    } catch {
      if (version === requestVersion.current && requestQueryKey === queryKey) {
        setLoadMoreError(true)
      }
    } finally {
      if (version === requestVersion.current && requestQueryKey === queryKey) {
        loadMoreInFlight.current = false
        setIsLoadingMore(false)
      }
    }
  }, [hasMore, isActiveQuery, query, queryKey, visibleMeta.page])

  // InfiniteScrollTrigger는 hasMore/isLoading을 이미 스스로 본다.
  // 여기서는 그쪽이 모르는 조건(네비게이션 진행 중, 아직 최신 쿼리 결과가 아님)만 알려준다.
  // hasMore를 넣으면 "모든 항목을 불러왔습니다" 안내가 가려지므로 넣지 않는다.
  const isPaused = isPending || !isActiveQuery

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
    isPaused,
    isLoadingMore,
    loadMoreError,
    hasMore,
    loadMore,
    queryKey,
  }
}
