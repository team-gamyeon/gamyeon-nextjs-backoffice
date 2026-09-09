import { getDashboardSummary } from '@/featured/dashboard/service'
import { toRouteResponse } from '@/shared/lib/route/toRouteResponse'

export async function GET() {
  return toRouteResponse(() => getDashboardSummary(), '대시보드 조회 실패')
}
