import { serverApi } from '@/shared/lib/api'
import type { DashboardSummary } from '@/featured/dashboard/types'

export async function getDashboardSummary() {
  return serverApi.get<DashboardSummary>('/api/v1/dashboard/summary')
}
