import { motion } from 'framer-motion'
import { FileText, AlertCircle } from 'lucide-react'
import { StatusBadge, ScoreBadge } from '@/featured/reports/components/ReportBadges'
import type { AnalysisReport } from '@/featured/reports/types'

interface ReportsTableProps {
  reports: AnalysisReport[]
  onSelect: (report: AnalysisReport) => void
}

export function ReportsTable({ reports, onSelect }: ReportsTableProps) {
  return (
    <div className="border-border/60 overflow-hidden rounded-lg border">
      <table className="w-full table-fixed text-sm">
        <thead className="bg-muted/40">
          <tr>
            <th className="text-muted-foreground w-[10%] px-4 py-3 text-left font-medium">
              인터뷰 ID
            </th>
            <th className="text-muted-foreground w-[10%] px-4 py-3 text-left font-medium">유저</th>
            <th className="text-muted-foreground w-[18%] px-4 py-3 text-left font-medium">
              직무 카테고리
            </th>
            <th className="text-muted-foreground w-[12%] px-4 py-3 text-center font-medium">
              상태
            </th>
            <th className="text-muted-foreground w-[10%] px-4 py-3 text-center font-medium">
              점수
            </th>
            <th className="text-muted-foreground w-[16%] px-4 py-3 text-center font-medium">
              생성일시
            </th>
            <th className="text-muted-foreground w-[10%] px-4 py-3 text-center font-medium">
              리포트 ID
            </th>
            <th className="w-[6%] px-4 py-3 text-center" />
          </tr>
        </thead>
        <tbody className="divide-border/40 bg-background divide-y">
          {reports.map((report, index) => (
            <motion.tr
              key={report.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.04 }}
              className="group hover:bg-muted/30 transition-colors"
            >
              <td className="truncate px-4 py-3 text-left">
                <span className="text-muted-foreground font-mono text-xs">
                  #{report.sessionId}
                </span>
              </td>

              <td className="truncate px-4 py-3 text-left font-medium">{report.userNickname}</td>

              <td className="text-muted-foreground truncate px-4 py-3 text-left">
                {report.jobCategory}
              </td>

              <td className="px-4 py-3 text-center">
                <div className="flex justify-center">
                  <StatusBadge status={report.status} />
                </div>
              </td>

              <td className="px-4 py-3 text-center">
                <ScoreBadge score={report.score} />
              </td>

              <td className="text-muted-foreground truncate px-4 py-3 text-center">
                {report.createdAt}
              </td>

              <td className="truncate px-4 py-3 text-center">
                <span className="text-muted-foreground font-mono text-xs">{report.id}</span>
              </td>

              <td className="px-4 py-3 text-center">
                <div className="flex justify-center">
                  {report.status === 'COMPLETED' ? (
                    <button
                      type="button"
                      onClick={() => onSelect(report)}
                      title="상세 보기"
                      className="text-primary hover:bg-primary/10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-opacity"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                  ) : report.status === 'FAILED' ? (
                    <div
                      className="text-destructive flex items-center justify-center"
                      title="분석 실패"
                    >
                      <AlertCircle className="h-4 w-4" />
                    </div>
                  ) : null}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      {reports.length === 0 && (
        <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  )
}
