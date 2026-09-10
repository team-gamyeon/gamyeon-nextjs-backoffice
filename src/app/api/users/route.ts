import { getUsers } from '@/featured/members/services/members.service'
import { toRouteResponse } from '@/shared/lib/route/toRouteResponse'

export async function GET() {
  return toRouteResponse(() => getUsers(), '유저 목록 조회 실패')
}
