'use server'

import { getReports, getReportDetail } from '@/featured/reports/services/reports.service'
import { REPORT_LIST_QUERY_CONFIG } from '@/featured/reports/constants'
import { toActionResult } from '@/shared/lib/action/toActionResult'
import { parseListQuery } from '@/shared/lib/validation/listQuery'
import { parseReportId } from '@/featured/reports/validation/reportActionInput'
import type { ActionResult } from '@/shared/types/action'
import type {
  ApiReportDetail,
  GetReportsParams,
  ReportListResponse,
} from '@/featured/reports/types'

export type GetReportsActionState = ActionResult<ReportListResponse>

export type GetReportDetailActionState = ActionResult<ApiReportDetail>

export async function getReportsAction(params?: unknown): Promise<GetReportsActionState> {
  const parsed = parseListQuery(params, REPORT_LIST_QUERY_CONFIG)
  if (!parsed.success) {
    return { success: false, error: parsed.error }
  }

  return toActionResult(async () => {
    const data = await getReports(parsed.data satisfies GetReportsParams)
    if (!data) throw new Error('리포트 목록 응답 데이터가 없습니다.')

    return data
  }, '리포트 조회에 실패했습니다.')
}

export async function getReportDetailAction(
  reportId: unknown,
): Promise<GetReportDetailActionState> {
  const parsedId = parseReportId(reportId)
  if (!parsedId.success) {
    return { success: false, error: parsedId.error }
  }

  return toActionResult(() => getReportDetail(parsedId.data), '리포트 상세 조회에 실패했습니다.')
}
