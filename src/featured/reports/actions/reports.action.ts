'use server'

import { getReports } from '@/featured/reports/services/reports.service'
import type { GetReportsParams, ReportListResponse } from '@/featured/reports/types'

export interface GetReportsActionState {
  success: boolean
  data?: ReportListResponse
  error?: string
}

export async function getReportsAction(params?: GetReportsParams): Promise<GetReportsActionState> {
  try {
    const data = await getReports(params)
    return { success: true, data }
  } catch (error: unknown) {
    const apiError = error as { message?: string }
    return { success: false, error: apiError.message ?? '리포트 조회에 실패했습니다.' }
  }
}
