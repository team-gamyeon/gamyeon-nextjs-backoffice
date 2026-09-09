import { FileText, AlertCircle } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { InfiniteScrollTrigger } from '@/shared/components/InfiniteScrollTrigger'
import { ListEmptyState } from '@/shared/components/ListEmptyState'
import { StatusBadge, ScoreBadge } from '@/featured/reports/components/ReportBadges'
import type { RefObject } from 'react'
import type { AnalysisReport } from '@/featured/reports/types'

interface ReportsTableProps {
  reports: AnalysisReport[]
  onSelect: (report: AnalysisReport) => void
  scrollRootRef: RefObject<HTMLDivElement | null>
  hasMore: boolean
  isLoadingMore: boolean
  loadMoreError: boolean
  initialLoadFailed: boolean
  isPaused?: boolean
  onLoadMore: () => void | Promise<void>
}

export function ReportsTable({
  reports,
  onSelect,
  scrollRootRef,
  hasMore,
  isLoadingMore,
  loadMoreError,
  initialLoadFailed,
  isPaused,
  onLoadMore,
}: ReportsTableProps) {
  return (
    <div className="border-border/60 overflow-hidden rounded-lg border">
      <div ref={scrollRootRef} className="max-h-140 w-full overflow-auto [scrollbar-gutter:stable]">
        <table className="w-full min-w-240 table-fixed text-sm">
          <colgroup>
            <col className="w-[13%]" />
            <col className="w-[13%]" />
            <col className="w-[19%]" />
            <col className="w-[11%]" />
            <col className="w-[9%]" />
            <col className="w-[17%]" />
            <col className="w-[12%]" />
            <col className="w-16" />
          </colgroup>
          <thead className="bg-muted sticky top-0 z-10">
            <tr>
              <th className="text-muted-foreground px-6 py-4 text-center font-medium">인터뷰 ID</th>
              <th className="text-muted-foreground px-6 py-4 text-left font-medium">유저</th>
              <th className="text-muted-foreground px-6 py-4 text-left font-medium">
                직무 카테고리
              </th>
              <th className="text-muted-foreground px-6 py-4 text-center font-medium">상태</th>
              <th className="text-muted-foreground px-6 py-4 text-center font-medium">점수</th>
              <th className="text-muted-foreground px-6 py-4 text-center font-medium">생성일시</th>
              <th className="text-muted-foreground px-6 py-4 text-center font-medium">리포트 ID</th>
              <th className="px-6 py-4 text-center">
                <span className="sr-only">작업</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-border/40 bg-background divide-y">
            {reports.map((report) => (
              <tr key={report.id} className="group hover:bg-muted/30 transition-colors">
                <td className="truncate px-6 py-3 text-center">
                  <span className="text-muted-foreground font-mono text-xs">
                    #{report.sessionId}
                  </span>
                </td>

                <td className="truncate px-6 py-3 text-left font-medium">{report.userNickname}</td>

                <td className="text-muted-foreground truncate px-6 py-3 text-left">
                  {report.jobCategory}
                </td>

                <td className="px-6 py-3 text-center">
                  <div className="flex justify-center">
                    <StatusBadge status={report.status} />
                  </div>
                </td>

                <td className="px-6 py-3 text-center">
                  <ScoreBadge score={report.score} />
                </td>

                <td className="text-muted-foreground truncate px-6 py-3 text-center">
                  {report.createdAt}
                </td>

                <td className="truncate px-6 py-3 text-center">
                  <span className="text-muted-foreground font-mono text-xs">{report.id}</span>
                </td>

                <td className="px-6 py-3 text-center">
                  <div className="flex justify-center">
                    {report.status === 'COMPLETED' ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => onSelect(report)}
                        title="상세 보기"
                        aria-label={`${report.userNickname} 리포트 상세 보기`}
                        className="text-primary hover:bg-primary/10 focus-visible:ring-ring h-8 w-8 focus-visible:ring-2 focus-visible:ring-offset-2"
                      >
                        <FileText className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    ) : report.status === 'FAILED' ? (
                      <div
                        className="text-destructive flex items-center justify-center"
                        title="분석 실패"
                        role="img"
                        aria-label="분석 실패"
                      >
                        <AlertCircle className="h-4 w-4" aria-hidden="true" />
                      </div>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {reports.length === 0 && (
          <ListEmptyState
            hasError={initialLoadFailed}
            errorMessage="리포트 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
            emptyMessage="검색 결과가 없습니다."
          />
        )}

        <InfiniteScrollTrigger
          rootRef={scrollRootRef}
          hasMore={hasMore}
          isLoading={isLoadingMore}
          hasError={loadMoreError}
          isPaused={isPaused}
          loadedCount={reports.length}
          onLoadMore={onLoadMore}
        />
      </div>
    </div>
  )
}
