import { PageHeader } from '@/shared/components/PageHeader'
import { TrafficClient } from '@/featured/traffic/components/TrafficClient'

export default async function TrafficPage() {
    return (
    <div>
      <PageHeader title="트래픽 관리" description="ga4로 유저 유입/이탈을 관리합니다."></PageHeader>
      <TrafficClient/>
    </div>
    );
}