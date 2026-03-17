import { serverApi } from '@/shared/lib/api'
import type { DashboardSummary } from '@/featured/dashboard/types'

export async function getDashboardSummary(): Promise<DashboardSummary | null> {
  try {
    return await serverApi.get<DashboardSummary>('/api/v1/dashboard/summary')
  } catch {
    return null
  }
}
