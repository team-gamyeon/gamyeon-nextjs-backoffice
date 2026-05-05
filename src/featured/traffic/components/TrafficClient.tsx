// traffic/components/TrafficClient.tsx
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
      <div className="flex items-start gap-10">
        <div className="h-70 w-70">
          <DoughnutChart data={firstChannelResult} />
        </div>
        <div className="flex-1">
          <PerformanceTable data={pagePerformanceResult} />
        </div>
      </div>

      {/* 마찰 지수 보드 영역 */}
      <div className="w-full">
        <FrictionBoard data={frictionIndexResult} />
      </div>
    </div>
  )
}
