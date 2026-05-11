'use client'

import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Sector } from 'recharts'
import { PieChart as PieChartIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { EmptyState } from '@/shared/components/EmptyState'
import { useDonutChart } from '@/featured/dashboard/hooks/useDonutChart'
import type { ChannelData } from '@/featured/traffic/types'

const CHANNEL_COLORS = [
  'oklch(0.55 0.15 180)',
  'oklch(0.72 0.18 150)',
  'oklch(0.62 0.15 25)',
  'oklch(0.60 0.18 280)',
  'oklch(0.65 0.14 60)',
]

interface InflowChannelChartProps {
  data: ChannelData[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 5}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
    />
  )
}

export function InflowChannelChartContent({ data }: InflowChannelChartProps) {
  if (data.length === 0) {
    return (
      <EmptyState
        icon={PieChartIcon}
        title="데이터가 없습니다"
        description="GA4 연동 후 유입 채널 데이터가 표시됩니다"
      />
    )
  }

  const total = data.reduce((sum, item) => sum + item.totalUsers, 0)

  const chartData = data.map((item, index) => ({
    name: item.channel,
    value: item.totalUsers,
    color: CHANNEL_COLORS[index % CHANNEL_COLORS.length],
  }))

  const { setActiveIndex, active } = useDonutChart(chartData)

  const pieData =
    chartData.length > 0 ? chartData : [{ name: '', value: 1, color: 'oklch(0.9 0 0)' }]

  return (
    <div className="relative flex h-full items-center justify-center" suppressHydrationWarning>
      {/* 도넛 차트 */}
      <div className="shrink-0">
        <PieChart width={250} height={250} onMouseLeave={() => setActiveIndex(null)}>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={74}
            outerRadius={104}
            paddingAngle={chartData.length > 1 ? 3 : 0}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            activeShape={renderActiveShape}
            onMouseEnter={(_, index) => chartData.length > 0 && setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {pieData.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.color}
                strokeWidth={0}
                opacity={active && active.name !== entry.name ? 0.4 : 1}
                style={{ transition: 'opacity 0.2s' }}
              />
            ))}
          </Pie>
          <text
            x={125}
            y={115}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              fill: active ? active.color : 'currentColor',
              transition: 'fill 0.15s',
            }}
          >
            {active ? active.value.toLocaleString() : total.toLocaleString()}
          </text>
          <text
            x={125}
            y={136}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: '0.68rem', fill: 'currentColor', opacity: 0.5 }}
          >
            {active ? active.name : '총 방문자'}
          </text>
        </PieChart>
      </div>

      {/* 범례 — 우측 절대 위치 */}
      <div className="absolute right-0 flex w-36 flex-col gap-3">
        {chartData.map((item) => {
          const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0
          return (
            <div key={item.name} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-muted-foreground min-w-0 flex-1 text-xs">{item.name}</span>
              <span className="shrink-0 text-xs font-bold">{percentage}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function InflowChannelChart({ data }: InflowChannelChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex h-full"
      suppressHydrationWarning
    >
      <Card className="border-border/60 h-full w-full">
        <CardHeader className="px-5 pt-4 pb-2">
          <CardTitle className="text-base font-semibold">유입 채널</CardTitle>
          <p className="text-muted-foreground text-xs">최근 30일 · GA4</p>
        </CardHeader>
        <CardContent className="px-5 pt-0 pb-4">
          <InflowChannelChartContent data={data} />
        </CardContent>
      </Card>
    </motion.div>
  )
}
