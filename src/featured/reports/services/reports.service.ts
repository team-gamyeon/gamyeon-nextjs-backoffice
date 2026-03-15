import { serverApi } from '@/shared/lib/api'
import type { GetReportsParams, ReportListResponse } from '@/featured/reports/types'

export async function getReports(params?: GetReportsParams) {
  return serverApi.get<ReportListResponse>('/api/v1/reports', { params })
}
