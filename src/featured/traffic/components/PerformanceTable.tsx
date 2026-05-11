'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import type { PagePerformanceData } from '@/featured/traffic/types'

interface PerformanceTableProps {
  data: PagePerformanceData[]
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainSeconds = Math.floor(seconds % 60)
  return `${minutes}분 ${remainSeconds}초`
}

export function PerformanceTable({ data }: PerformanceTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="flex h-full w-full"
      suppressHydrationWarning
    >
      <Card className="border-border/60 h-full w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">페이지별 성과</CardTitle>
          <p className="text-muted-foreground text-xs">최근 30일 · GA4</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-border/60 border-b">
                  <th className="text-muted-foreground px-4 py-2 text-left text-xs font-medium">
                    페이지 경로
                  </th>
                  <th className="text-muted-foreground px-4 py-2 text-right text-xs font-medium">
                    조회수
                  </th>
                  <th className="text-muted-foreground px-4 py-2 text-right text-xs font-medium">
                    활성 사용자
                  </th>
                  <th className="text-muted-foreground px-4 py-2 text-right text-xs font-medium">
                    평균 참여 시간
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr
                    key={row.routePage}
                    className="border-border/40 hover:bg-muted/40 border-b transition-colors last:border-0"
                  >
                    <td className="px-4 py-2 font-mono text-xs">{row.routePage}</td>
                    <td className="px-4 py-2 text-right text-sm font-medium">
                      {row.pageViews.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-right text-sm">
                      {row.activeUsers.toLocaleString()}
                    </td>
                    <td className="text-muted-foreground px-4 py-2 text-right text-sm">
                      {formatTime(row.activeUsers > 0 ? row.userDurations / row.activeUsers : 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
