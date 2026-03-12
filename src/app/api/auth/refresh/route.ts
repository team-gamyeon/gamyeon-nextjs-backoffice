import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { refreshToken } from '@/featured/auth/service'

export async function POST() {
  const cookieStore = await cookies()
  const token = cookieStore.get('refreshToken')?.value

  if (!token) {
    return NextResponse.json(
      { success: false, code: 'UNAUTHORIZED', message: '리프레시 토큰이 없습니다.' },
      { status: 401 },
    )
  }

  try {
    const data = await refreshToken(token)
    return NextResponse.json({ success: true, data })
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string; code?: string }
    return NextResponse.json(
      { success: false, code: err.code ?? 'ERROR', message: err.message ?? '토큰 갱신에 실패했습니다.' },
      { status: err.status ?? 500 },
    )
  }
}
