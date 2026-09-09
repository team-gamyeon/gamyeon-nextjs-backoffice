'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Button } from '@/shared/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { SearchInput } from '@/shared/components/SearchInput'
import { REPORT_SORT_OPTIONS, REPORT_STATUS_OPTIONS } from '@/featured/reports/constants'
import { useReports } from '@/featured/reports/hooks/useReports'
import { ReportsTable } from '@/featured/reports/components/ReportsTable'
import { ReportDetailDialog } from '@/featured/reports/components/ReportDetailDialog'
import { getReportDetailAction } from '@/featured/reports/actions/reports.action'
import type { PaginationMeta, SortOrder } from '@/shared/types/pagination'
import type {
  AnalysisReport,
  ApiReportDetail,
  GetReportsParams,
  ReportSortBy,
} from '@/featured/reports/types'

interface ReportsClientProps {
  initialReports: AnalysisReport[]
  meta: PaginationMeta
  query: GetReportsParams
  hasLoadError?: boolean
}

export function ReportsClient({ initialReports, meta, query, hasLoadError }: ReportsClientProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [reportDetail, setReportDetail] = useState<ApiReportDetail | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)

  const {
    reports,
    meta: currentMeta,
    search,
    setSearch,
    status,
    setStatus,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    resetFilters,
    isPending,
    isPaused,
    isLoadingMore,
    loadMoreError,
    initialLoadFailed,
    hasMore,
    loadMore,
    scrollRootRef,
  } = useReports(initialReports, meta, query, hasLoadError)

  async function handleSelectReport(report: AnalysisReport) {
    setDialogOpen(true)
    setReportDetail(null)
    setIsLoadingDetail(true)
    const result = await getReportDetailAction(report.id)
    if (result.success && result.data) {
      setReportDetail(result.data)
    }
    setIsLoadingDetail(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
      suppressHydrationWarning
      aria-busy={isPending || isLoadingMore}
    >
      {/* Stats */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-foreground">
          전체{' '}
          <span className="text-foreground mr-1 font-semibold">
            {currentMeta.totalCount.toLocaleString()}
          </span>
          개
        </span>
        <span className="text-muted-foreground">
          조회 결과{' '}
          <span className="text-primary mr-1 font-semibold">
            {currentMeta.filteredCount.toLocaleString()}
          </span>
          개
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={status} onValueChange={(value) => setStatus(value as typeof status)}>
          <TabsList className="h-9">
            <TabsTrigger value="all" className="text-xs">
              전체
            </TabsTrigger>
            {REPORT_STATUS_OPTIONS.map((option) => (
              <TabsTrigger key={option.value} value={option.value} className="text-xs">
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="유저명 또는 인터뷰 ID 검색..."
          className="min-w-48 flex-1"
        />

        <Select value={sortBy} onValueChange={(value) => setSortBy(value as ReportSortBy)}>
          <SelectTrigger className="h-9 w-32" aria-label="정렬 기준">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            {REPORT_SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
          <SelectTrigger className="h-9 w-28" aria-label="정렬 순서">
            <SelectValue placeholder="정렬 순서" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">내림차순</SelectItem>
            <SelectItem value="asc">오름차순</SelectItem>
          </SelectContent>
        </Select>

        <Button type="button" variant="outline" size="sm" className="h-9" onClick={resetFilters}>
          초기화
        </Button>
      </div>

      <div className={isPending ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
        <ReportsTable
          reports={reports}
          onSelect={handleSelectReport}
          scrollRootRef={scrollRootRef}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          loadMoreError={loadMoreError}
          initialLoadFailed={initialLoadFailed}
          isPaused={isPaused}
          onLoadMore={loadMore}
        />
      </div>

      <ReportDetailDialog
        report={reportDetail}
        open={dialogOpen}
        isLoading={isLoadingDetail}
        onClose={() => setDialogOpen(false)}
      />
    </motion.div>
  )
}
