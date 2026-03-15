import { FileText } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { ScoreBadge } from '@/featured/reports/components/ReportBadges'
import type { AnalysisReport } from '@/featured/reports/types'

interface ReportDetailDialogProps {
  report: AnalysisReport
  open: boolean
  onClose: () => void
}

export function ReportDetailDialog({ report, open, onClose }: ReportDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="text-primary h-4 w-4" />
            리포트 상세 — {report.userNickname}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="bg-muted/40 flex flex-col gap-2.5 rounded-lg px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-sm font-medium">면접 제목</span>
              <span className="text-base font-semibold">{report.interviewTitle}</span>
            </div>

            <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
              <span>세션 ID</span>
              <span className="text-foreground font-mono font-medium">#{report.sessionId}</span>

              <span className="text-border/60 mx-1">|</span>

              <span>점수</span>
              <ScoreBadge score={report.score} />

              <span className="text-border/60 mx-1">|</span>

              <span>분석 완료</span>
              <span className="text-foreground font-medium">{report.completedAt ?? '—'}</span>
            </div>
          </div>

          {report.summary && (
            <div>
              <p className="mb-1 font-semibold">종합 평가</p>
              <p className="text-muted-foreground leading-relaxed">{report.summary}</p>
            </div>
          )}

          {report.strengths && (
            <div>
              <p className="mb-2 font-semibold text-green-600 dark:text-green-400">강점</p>
              <ul className="space-y-1">
                {report.strengths.map((strength, index) => (
                  <li key={index} className="text-muted-foreground flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {report.improvements && (
            <div>
              <p className="mb-2 font-semibold text-amber-600 dark:text-amber-400">개선 필요</p>
              <ul className="space-y-1">
                {report.improvements.map((improvement, index) => (
                  <li key={index} className="text-muted-foreground flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
