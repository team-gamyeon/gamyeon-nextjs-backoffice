import { NextResponse } from 'next/server'
import { getDashboardSummary } from '@/featured/dashboard/service'

export async function GET() {
  try {
    const data = await getDashboardSummary()
    return NextResponse.json({ success: true, data })
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string; code?: string }
    return NextResponse.json(
      { success: false, code: err.code ?? 'ERROR', message: err.message ?? '대시보드 조회 실패' },
      { status: err.status ?? 500 },
    )
  }
}
