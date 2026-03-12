import { NextResponse } from 'next/server'
import { getMe } from '@/featured/auth/service'

export async function GET() {
  try {
    const data = await getMe()
    return NextResponse.json({ success: true, data })
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string; code?: string }
    return NextResponse.json(
      { success: false, code: err.code ?? 'ERROR', message: err.message ?? '관리자 정보를 불러올 수 없습니다.' },
      { status: err.status ?? 500 },
    )
  }
}
