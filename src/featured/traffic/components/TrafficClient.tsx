'use client'

import DoughnutChart from '@/featured/traffic/components/DoughnutChart'
import { PerformanceTable } from '@/featured/traffic/components/PerformanceTable'
import { FrictionBoard } from '@/featured/traffic/components/FrictionBoard'
import { FrictionRanking } from '../types/index'

interface TrafficClientProps {
  firstChannelResult: any
  pagePerformanceResult: any
  frictionIndexResult: FrictionRanking[]
}

export function TrafficClient({
  firstChannelResult,
  pagePerformanceResult,
  frictionIndexResult,
}: TrafficClientProps) {
  return (
    <div className="flex flex-col gap-10">
      {/* 상단 2개 영역 (도넛 차트 & 퍼포먼스 테이블) */}
      <div className="flex items-start gap-10">
        <div className="h-70 w-70 shrink-0">
          <DoughnutChart data={firstChannelResult} />
        </div>
        <div className="min-w-0 flex-1">
          <PerformanceTable data={pagePerformanceResult} />
        </div>
      </div>

      {/* 하단 2개 영역 (마찰 지수 보드 & 이탈 발생 타이머 플레이스홀더) */}
      <div className="flex items-stretch gap-10">
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
