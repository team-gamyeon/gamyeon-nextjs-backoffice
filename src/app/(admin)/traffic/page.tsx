import { PageHeader } from '@/shared/components/PageHeader'
import { TrafficClient } from '@/featured/traffic/components/TrafficClient'
import {
  getFirstUserChannel,
  getPagePerformance,
} from '@/featured/traffic/services/traffic.service'

export default async function TrafficPage() {
  const [firstChannelResult, pagePerformanceResult] = await Promise.all([
    getFirstUserChannel(),
    getPagePerformance(),
  ])
  console.log(firstChannelResult)
  return (
    <div>
      <PageHeader title="트래픽 관리" description="ga4로 유저 유입/이탈을 관리합니다." />
      <div className="-mx-6">
        <TrafficClient
          firstChannelResult={firstChannelResult ?? []}
          pagePerformanceResult={
            (pagePerformanceResult ?? []).map((row) => ({
              ...row,
              routePage: row.routePage ?? '',
            }))
          }
        />
      </div>
    </div>
  )
}
