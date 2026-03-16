'use server'

import { getReports, getReportDetail } from '@/featured/reports/services/reports.service'
import type { ApiReportDetail, GetReportsParams, ReportListResponse } from '@/featured/reports/types'

export interface GetReportsActionState {
  success: boolean
  data?: ReportListResponse
  error?: string
}

export interface GetReportDetailActionState {
  success: boolean
  data?: ApiReportDetail
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

export async function getReportDetailAction(reportId: string): Promise<GetReportDetailActionState> {
  try {
    const data = await getReportDetail(reportId)
    return { success: true, data }
  } catch (error: unknown) {
    const apiError = error as { message?: string }
    return { success: false, error: apiError.message ?? '리포트 상세 조회에 실패했습니다.' }
  }
}
