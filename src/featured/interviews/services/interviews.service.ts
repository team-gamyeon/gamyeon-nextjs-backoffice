import { serverApi } from '@/shared/lib/api'
import type { InterviewListQuery, InterviewListResponse } from '@/featured/interviews/types'

export async function getInterviews(query: InterviewListQuery) {
  const params: Record<string, string | number> = {
    page: query.page,
    limit: query.limit,
    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  }

  if (query.status) params.status = query.status
  if (query.search) params.search = query.search
  if (query.from) params.from = query.from
  if (query.to) params.to = query.to

  return serverApi.get<InterviewListResponse>('/api/v1/interviews', { params })
}
