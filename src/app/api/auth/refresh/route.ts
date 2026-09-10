import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { refreshToken } from '@/featured/auth/service'
import { toRouteResponse } from '@/shared/lib/route/toRouteResponse'

export async function POST() {
  const cookieStore = await cookies()
  const token = cookieStore.get('refreshToken')?.value

  if (!token) {
    return NextResponse.json(
      { success: false, code: 'UNAUTHORIZED', message: '리프레시 토큰이 없습니다.' },
      { status: 401 },
    )
  }

  return toRouteResponse(() => refreshToken(token), '토큰 갱신에 실패했습니다.')
}
