'use client'

import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'

const FUNNEL_DATA = [
  { step: '면접 시작', rate: 100, count: 1240, color: 'oklch(0.55 0.15 180)' },
  { step: '1번 질문', rate: 85, count: 1054, color: 'oklch(0.60 0.15 180)' },
  { step: '3번 질문', rate: 50, count: 620, color: 'oklch(0.72 0.18 150)' },
  { step: '최종 완료', rate: 30, count: 372, color: 'oklch(0.62 0.15 25)' },
]

function CustomTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  const previousRate = FUNNEL_DATA[FUNNEL_DATA.indexOf(data) - 1]?.rate
  const dropRate = previousRate ? previousRate - data.rate : 0

  return (
    <div className="bg-background border-border rounded-lg border p-3 text-sm shadow-md">
      <p className="font-semibold">{data.step}</p>
      <p className="text-muted-foreground mt-1">{data.count.toLocaleString()}명</p>
      <p style={{ color: data.color }} className="font-medium">
        생존율 {data.rate}%
      </p>
      {dropRate > 0 && (
        <p className="text-destructive mt-1 text-xs">이전 단계 대비 -{dropRate}%p 이탈</p>
      )}
    </div>
  )
}

export function InterviewFunnelChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex h-full w-full"
      suppressHydrationWarning
    >
      <Card className="border-border/60 h-full w-full">
        <CardHeader className="px-5 pt-4 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">면접 단계별 생존율</CardTitle>
              <p className="text-muted-foreground text-xs">
                각 질문 단계에서 이탈 없이 진행한 비율
              </p>
            </div>
            <span className="bg-destructive/10 text-destructive rounded-full px-2 py-0.5 text-xs font-medium">
              3번 질문 구간 주의 📉
            </span>
          </div>
        </CardHeader>
        <CardContent className="px-5 pt-0 pb-4">
          <ResponsiveContainer width="100%" height={185}>
            <BarChart
              data={FUNNEL_DATA}
              layout="vertical"
              margin={{ top: 0, right: 48, left: 8, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="oklch(0.91 0.01 180)"
              />
              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 11, fill: 'oklch(0.55 0.02 180)' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="step"
                tick={{ fontSize: 12, fill: 'oklch(0.4 0.02 180)' }}
                axisLine={false}
                tickLine={false}
                width={72}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'oklch(0.96 0.01 180)' }} />
              <Bar dataKey="rate" radius={[0, 4, 4, 0]} maxBarSize={40}>
                {FUNNEL_DATA.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
                <LabelList
                  dataKey="rate"
                  position="right"
                  formatter={(value: number) => `${value}%`}
                  style={{ fontSize: 12, fontWeight: 600, fill: 'oklch(0.4 0.02 180)' }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="bg-secondary mt-3 flex items-start gap-2 rounded-lg px-3 py-2.5">
            <span className="text-sm leading-none">💡</span>
            <p className="text-secondary-foreground text-xs">
              <strong>인사이트:</strong> 3번 질문 진입 시 이탈률이 35%p 급증합니다. 해당 구간의
              난이도나 UI 로딩 속도를 점검해야 합니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
