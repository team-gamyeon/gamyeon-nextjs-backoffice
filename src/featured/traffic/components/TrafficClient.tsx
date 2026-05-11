'use client'

import dynamic from 'next/dynamic'
import { ChannelPerformanceTabs } from '@/featured/traffic/components/ChannelPerformanceTabs'
import type { ChannelData, PagePerformanceData } from '@/featured/traffic/types'
import { FrictionBoard } from '@/featured/traffic/components/FrictionBoard'
import { FrictionRanking } from '../types/index'

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
  frictionIndexResult: FrictionRanking[]
}

export function TrafficClient({
  firstChannelResult,
  pagePerformanceResult,
  frictionIndexResult,
}: TrafficClientProps) {
  return (
    <div className="mt-4 space-y-3 px-4">
      {/* Row 1 */}
      <div className="grid h-full grid-cols-2 gap-3">
        {/* Section 1: 유입채널 + 페이지별 성과 (탭) */}
        <ChannelPerformanceTabs
          channelData={firstChannelResult}
          performanceData={pagePerformanceResult}
        />

        {/* Section 2: 면접 퍼널 */}
        <InterviewFunnelChart />
      </div>

      {/* Row 2 - 마찰 랭킹 및 이탈률 관련 영역*/}
      <div className="grid h-full grid-cols-2 grid-rows-1 gap-3">
        {/* 1. 마찰 지수 보드 (왼쪽 절반) */}
        <div className="min-w-0 flex-1">
          <FrictionBoard data={frictionIndexResult} />
        </div>

        {/* 2. 이탈 발생 타이머 대기열 (오른쪽 절반) */}
        <div
          className="flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed p-6"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}
        >
          <svg
            className="mb-3 h-8 w-8"
            style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-sm font-bold" style={{ color: 'var(--muted-foreground)' }}>
            이탈 발생 타이머 컴포넌트
          </span>
          <span className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}>
            (개발 예정 영역)
          </span>
        </div>
      </div>
    </div>
  )
}
