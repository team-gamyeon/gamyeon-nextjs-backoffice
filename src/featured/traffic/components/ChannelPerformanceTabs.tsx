'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Card } from '@/shared/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import type { ChannelData, PagePerformanceData } from '@/featured/traffic/types'

const DoughnutChartContent = dynamic(
  () =>
    import('@/featured/traffic/components/DoughnutChart').then((module) => ({
      default: module.DoughnutChartContent,
    })),
  { ssr: false },
)

const PerformanceChartContent = dynamic(
  () =>
    import('@/featured/traffic/components/PerformanceChart').then((module) => ({
      default: module.PerformanceChartContent,
    })),
  { ssr: false },
)

interface ChannelPerformanceTabsProps {
  channelData: ChannelData[]
  performanceData: PagePerformanceData[]
}

export function ChannelPerformanceTabs({
  channelData,
  performanceData,
}: ChannelPerformanceTabsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="h-full"
      suppressHydrationWarning
    >
      <Card className="border-border/60 h-full gap-0 py-0">
        <Tabs defaultValue="channel" className="flex h-full flex-col gap-0">
          <div className="flex items-center justify-between px-5 pt-4 pb-3">
            <TabsList>
              <TabsTrigger value="channel">유입 채널</TabsTrigger>
              <TabsTrigger value="performance">페이지별 성과</TabsTrigger>
            </TabsList>
            <span className="text-muted-foreground text-xs">최근 30일 · GA4</span>
          </div>

          {/* flex-1 + min-h-0으로 남은 높이를 채우되 overflow 방지 */}
          <div className="min-h-0 flex-1 px-5 pb-4">
            <TabsContent value="channel" className="h-full">
              <DoughnutChartContent data={channelData} />
            </TabsContent>
            <TabsContent value="performance" className="h-full">
              <PerformanceChartContent data={performanceData} />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </motion.div>
  )
}
