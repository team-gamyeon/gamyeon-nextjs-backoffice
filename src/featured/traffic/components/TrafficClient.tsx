'use client'

import DoughnutChart from '@/featured/traffic/components/DoughnutChart'
import { PerformanceTable } from '@/featured/traffic/components/PerformanceTable'

interface TrafficClientProps {
  firstChannelResult: any
  pagePerformanceResult: any
}
export function TrafficClient({ firstChannelResult, pagePerformanceResult }: TrafficClientProps) {
  return (
    <div className="flex items-start gap-10">
      <div className="h-70 w-70">
        <DoughnutChart data={firstChannelResult} />
      </div>

      <div className="flex-1">
        <PerformanceTable data={pagePerformanceResult} />
      </div>
    </div>
  )
}
