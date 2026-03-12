import { NextResponse } from 'next/server'
import { getNotices } from '@/featured/notices/service'

export async function GET() {
  try {
    const data = await getNotices()
    return NextResponse.json({ success: true, data })
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string; code?: string }
    return NextResponse.json(
      { success: false, code: err.code ?? 'ERROR', message: err.message ?? '공지사항 목록 조회 실패' },
      { status: err.status ?? 500 },
    )
  }
}
