'use server'

import { getReports, getReportDetail } from '@/featured/reports/services/reports.service'
import { REPORT_LIST_QUERY_CONFIG } from '@/featured/reports/constants'
import { parseListQuery } from '@/shared/lib/validation/listQuery'
import type { ActionResult } from '@/shared/types/action'
import type {
  ApiReportDetail,
  GetReportsParams,
  ReportListResponse,
} from '@/featured/reports/types'

export type GetReportsActionState = ActionResult<ReportListResponse>

export interface GetReportDetailActionState {
  success: boolean
  data?: ApiReportDetail
  error?: string
}

export async function getReportsAction(params?: unknown): Promise<GetReportsActionState> {
  const parsed = parseListQuery(params, REPORT_LIST_QUERY_CONFIG)
  if (!parsed.success) {
    return { success: false, error: parsed.error }
  }

  try {
    const data = await getReports(parsed.data satisfies GetReportsParams)
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
