import { serverApi } from '@/shared/lib/api'
import type { SafeListQuery } from '@/shared/lib/validation/listQuery'
import type {
  InterviewListResponse,
  InterviewSortBy,
  InterviewStatus,
} from '@/featured/interviews/types'

// 액션에서 parseListQuery로 검증된 쿼리만 들어온다. limit은 그 단계에서 서버가 정한다.
export async function getInterviews(query: SafeListQuery<InterviewStatus, InterviewSortBy>) {
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
