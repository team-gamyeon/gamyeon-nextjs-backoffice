import { Loader2 } from 'lucide-react'
import { Badge } from '@/shared/ui/badge'
import type { ReportStatus } from '@/featured/reports/types'

export function StatusBadge({ status }: { status: ReportStatus }) {
  if (status === 'COMPLETED')
    return (
      <Badge className="border-0 bg-green-100 text-xs text-green-700 dark:bg-green-500/20 dark:text-green-400">
        분석 완료
      </Badge>
    )
  if (status === 'IN_PROGRESS')
    return (
      <Badge className="bg-primary/10 text-primary gap-1 border-0 text-xs">
        <Loader2 className="h-3 w-3 animate-spin" />
        분석 중
      </Badge>
    )
  return <Badge className="bg-destructive/10 text-destructive border-0 text-xs">실패</Badge>
}

export function ScoreBadge({ score }: { score?: number }) {
  if (score == null) return <span className="text-muted-foreground">—</span>

  let color = ''
  if (score >= 75) {
    color = 'text-blue-600 dark:text-blue-400'
  } else if (score >= 50) {
    color = 'text-green-600 dark:text-green-400'
  } else if (score >= 25) {
    color = 'text-yellow-500 dark:text-yellow-300'
  } else {
    color = 'text-red-600 dark:text-red-400'
  }

  return <span className={`font-semibold ${color}`}>{score}점</span>
}
