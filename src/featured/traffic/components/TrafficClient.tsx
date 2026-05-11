'use client'

import dynamic from 'next/dynamic'
import { ChannelPerformanceTabs } from '@/featured/traffic/components/ChannelPerformanceTabs'
import type { ChannelData, PagePerformanceData } from '@/featured/traffic/types'

function ChartSkeleton({ height }: { height: number }) {
  return (
    <div className="border-border/60 bg-card w-full rounded-xl border">
      <div className="p-5 pb-2">
        <div className="bg-muted h-4 w-28 animate-pulse rounded" />
      </div>
      <div className="p-5 pt-2">
        <div className="bg-muted animate-pulse rounded" style={{ height }} />
      </div>
    </div>
  )
}

const InterviewFunnelChart = dynamic(
  () =>
    import('@/featured/traffic/components/InterviewFunnelChart').then((module) => ({
      default: module.InterviewFunnelChart,
    })),
  { ssr: false, loading: () => <ChartSkeleton height={220} /> },
)

interface TrafficClientProps {
  firstChannelResult: ChannelData[]
  pagePerformanceResult: PagePerformanceData[]
}

export function TrafficClient({ firstChannelResult, pagePerformanceResult }: TrafficClientProps) {
  return (
    <div className="mt-4 space-y-3 px-4">
      {/* Row 1 */}
      <div className="grid grid-cols-2 gap-3">
        {/* Section 1: 유입채널 + 페이지별 성과 (탭) */}
        <ChannelPerformanceTabs
          channelData={firstChannelResult}
          performanceData={pagePerformanceResult}
        />

        {/* Section 2: 면접 퍼널 */}
        <InterviewFunnelChart />
      </div>

      {/* Row 2 - 마찰 랭킹 및 이탈률 관련 영역*/}
      <div className="grid grid-cols-2 gap-3"></div>
    </div>
  )
}
