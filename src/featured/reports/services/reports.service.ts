import { serverApi } from '@/shared/lib/api'
import type { ApiReportDetail, GetReportsParams, ReportListResponse } from '@/featured/reports/types'

export async function getReports(params?: GetReportsParams) {
  const filteredParams = params
    ? (Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined),
      ) as Record<string, string | number | boolean>)
    : undefined
  return serverApi.get<ReportListResponse>('/api/v1/reports', { params: filteredParams })
}

export async function getReportDetail(reportId: string) {
  return serverApi.get<ApiReportDetail>(`/api/v1/reports/${reportId}`)
}
