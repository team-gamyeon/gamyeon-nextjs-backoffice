'use client'

import { useState } from 'react'
import { FileText, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { ScoreBadge } from '@/featured/reports/components/ReportBadges'
import { timeAgo } from '@/shared/lib/utils/timeAgo'
import type { ApiReportDetail } from '@/featured/reports/types'

interface ReportDetailDialogProps {
  report: ApiReportDetail | null
  open: boolean
  isLoading: boolean
  onClose: () => void
}

export function ReportDetailDialog({ report, open, isLoading, onClose }: ReportDetailDialogProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const total = report?.questionResults.length ?? 0
  const currentQuestion = report?.questionResults[currentPage]

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setCurrentPage(0)
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="text-primary h-4 w-4" />
            리포트 상세 — {report?.user.nickname ?? ''}
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
          </div>
        )}

        {!isLoading && report && (
          <div className="space-y-4 text-sm">
            {/* 메타 정보 */}
            <div className="bg-muted/40 flex flex-col gap-2.5 rounded-lg px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground font-medium">면접 제목</span>
                <span className="text-base font-semibold">{report.jobCategory}</span>
              </div>
              <div className="text-muted-foreground flex flex-wrap items-center gap-2">
                <span>인터뷰 ID</span>
                <span className="text-foreground font-mono font-medium">#{report.intvId}</span>

                <span className="text-border/60 mx-1">|</span>

                <span>점수</span>
                <ScoreBadge score={report.score ?? undefined} />

                <span className="text-border/60 mx-1">|</span>

                <span>분석 완료</span>
                <span className="text-foreground font-medium">
                  {report.completedAt ? timeAgo(report.completedAt) : '—'}
                </span>
              </div>
            </div>

            {/* 종합 평가 */}
            {report.feedback && (
              <div>
                <p className="mb-1 font-semibold">종합 평가</p>
                <p className="text-muted-foreground leading-relaxed">{report.feedback}</p>
              </div>
            )}

            {/* 질문별 결과 */}
            {total > 0 && currentQuestion && (
              <div className="space-y-3">
                {/* 헤더 + 페이지네이션 컨트롤 */}
                <div className="flex items-center justify-between">
                  <p className="font-semibold">질문별 결과</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => p - 1)}
                      disabled={currentPage === 0}
                      className="hover:bg-muted disabled:opacity-30 flex h-6 w-6 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-muted-foreground min-w-12 text-center text-xs">
                      {currentPage + 1} / {total}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => p + 1)}
                      disabled={currentPage === total - 1}
                      className="hover:bg-muted disabled:opacity-30 flex h-6 w-6 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* 질문 카드 */}
                <div className="bg-muted/30 space-y-2 rounded-lg px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">
                      Q{currentPage + 1}. {currentQuestion.question}
                    </p>
                    {currentQuestion.score != null && (
                      <span className="shrink-0">
                        <ScoreBadge score={currentQuestion.score} />
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {currentQuestion.answer}
                  </p>
                  {currentQuestion.feedback && (
                    <p className="border-l-primary/50 text-muted-foreground border-l-2 pl-3 text-xs italic leading-relaxed">
                      {currentQuestion.feedback}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
