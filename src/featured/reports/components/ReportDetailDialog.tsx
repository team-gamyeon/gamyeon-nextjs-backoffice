'use client'

import { useState } from 'react'
import { FileText, Loader2, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react'
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

type Tab = 'questions' | 'feedback'

export function ReportDetailDialog({ report, open, isLoading, onClose }: ReportDetailDialogProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [activeTab, setActiveTab] = useState<Tab>('questions')
  const total = report?.questionResults.length ?? 0
  const currentQuestion = report?.questionResults[currentPage]

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setCurrentPage(0)
      setActiveTab('questions')
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

            {/* 탭 */}
            <div className="border-b">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('questions')}
                  className={`cursor-pointer pb-2 text-sm font-medium transition-colors ${
                    activeTab === 'questions'
                      ? 'border-b-primary text-foreground -mb-px border-b-2'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  질문 ({total})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('feedback')}
                  className={`cursor-pointer pb-2 text-sm font-medium transition-colors ${
                    activeTab === 'feedback'
                      ? 'border-b-primary text-foreground -mb-px border-b-2'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  강점 / 개선점
                </button>
              </div>
            </div>

            {/* 질문 탭 */}
            {activeTab === 'questions' && total > 0 && currentQuestion && (
              <div className="space-y-3">
                <div className="flex items-center justify-end">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => p - 1)}
                      disabled={currentPage === 0}
                      className="hover:bg-muted disabled:opacity-30 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed"
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
                      className="hover:bg-muted disabled:opacity-30 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

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

            {/* 강점/개선점 탭 */}
            {activeTab === 'feedback' && (
              <div className="space-y-4">
                {/* 강점 */}
                {report.strengths.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-semibold">강점</p>
                    <ul className="space-y-2">
                      {report.strengths.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                          <span className="text-muted-foreground leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 개선점 */}
                {report.improvements.length > 0 && (
                  <div className="space-y-2">
                    <p className="font-semibold">개선 필요</p>
                    <ul className="space-y-2">
                      {report.improvements.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <AlertCircle className="text-amber-500 mt-0.5 h-4 w-4 shrink-0" />
                          <span className="text-muted-foreground leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {report.strengths.length === 0 && report.improvements.length === 0 && (
                  <p className="text-muted-foreground text-center">데이터가 없습니다.</p>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
