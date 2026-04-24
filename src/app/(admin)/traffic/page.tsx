import { PageHeader } from '@/shared/components/PageHeader'
import { TrafficClient } from '@/featured/traffic/components/TrafficClient'
import { getGa4Traffic } from '@/featured/traffic/services/traffic.service'

export default async function TrafficPage() {
    const result = await getGa4Traffic()
    console.log('ga4 데이터:', result)
    return (
    <div>
      <PageHeader title="트래픽 관리" description="ga4로 유저 유입/이탈을 관리합니다."></PageHeader>
      <TrafficClient/>
    </div>
    );
}