import { PageHeader } from '@/shared/components/PageHeader'
import { TrafficClient } from '@/featured/traffic/components/TrafficClient'
import {
  getFirstUserChannel,
  getPagePerformance,
  getFrictionIndex,
} from '@/featured/traffic/services/traffic.service'

export default async function TrafficPage() {
  const [firstChannelResult, pagePerformanceResult, frictionIndexResult] = await Promise.all([
    getFirstUserChannel(),
    getPagePerformance(),
    getFrictionIndex(),
  ])

  console.log('이탈률 데이터:', frictionIndexResult)

  return (
    <div>
      <PageHeader title="트래픽 관리" description="ga4로 유저 유입/이탈을 관리합니다."></PageHeader>

      <TrafficClient
        firstChannelResult={firstChannelResult}
        pagePerformanceResult={pagePerformanceResult}
        frictionIndexResult={frictionIndexResult}
      />
    </div>
  )
}
