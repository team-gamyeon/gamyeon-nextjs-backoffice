'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { PagePerformanceData } from '@/featured/traffic/types'

interface PerformanceChartProps {
  data: PagePerformanceData[]
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainSeconds = Math.floor(seconds % 60)
  return `${minutes}분 ${remainSeconds}초`
}

function shortenPath(path: string): string {
  if (path.length <= 22) return path
  return '…' + path.slice(-19)
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: {
    payload: { fullPath: string; pageViews: number; activeUsers: number; avgDuration: number }
  }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  const item = payload[0].payload
  return (
    <div className="bg-background border-border rounded-lg border p-3 text-xs shadow-md">
      <p className="text-foreground mb-1.5 font-semibold">{item.fullPath}</p>
      <p className="text-muted-foreground">
        조회수:{' '}
        <span className="text-foreground font-medium">{item.pageViews.toLocaleString()}</span>
      </p>
      <p className="text-muted-foreground">
        활성 사용자:{' '}
        <span className="text-foreground font-medium">{item.activeUsers.toLocaleString()}</span>
      </p>
      <p className="text-muted-foreground">
        평균 참여:{' '}
        <span className="text-foreground font-medium">{formatTime(item.avgDuration)}</span>
      </p>
    </div>
  )
}

export function PerformanceChartContent({ data }: PerformanceChartProps) {
  const chartData = data.map((item) => ({
    name: shortenPath(item.routePage),
    fullPath: item.routePage,
    pageViews: item.pageViews,
    activeUsers: item.activeUsers,
    avgDuration: item.activeUsers > 0 ? Math.round(item.userDurations / item.activeUsers) : 0,
  }))

  return (
    <div className="h-full" suppressHydrationWarning>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke="oklch(0.91 0.01 180 / 0.5)"
          />
          <XAxis
            type="number"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) =>
              value >= 1000 ? `${(value / 1000).toFixed(1)}k` : String(value)
            }
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={96}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'oklch(0.96 0.01 180 / 0.3)' }} />
          <Legend
            iconSize={8}
            wrapperStyle={{ fontSize: 10, paddingTop: 4 }}
            formatter={(value: string) => (value === 'pageViews' ? '조회수' : '활성 사용자')}
          />
          <Bar
            dataKey="pageViews"
            fill="oklch(0.55 0.15 180)"
            radius={[0, 3, 3, 0]}
            maxBarSize={10}
          />
          <Bar
            dataKey="activeUsers"
            fill="oklch(0.72 0.18 150)"
            radius={[0, 3, 3, 0]}
            maxBarSize={10}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
