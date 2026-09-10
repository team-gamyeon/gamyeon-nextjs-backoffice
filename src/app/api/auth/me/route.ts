import { getMe } from '@/featured/auth/service'
import { toRouteResponse } from '@/shared/lib/route/toRouteResponse'

export async function GET() {
  return toRouteResponse(() => getMe(), '관리자 정보를 불러올 수 없습니다.')
}
