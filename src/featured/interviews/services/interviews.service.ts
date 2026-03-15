import { serverApi } from '@/shared/lib/api'
import type { InterviewListResponse } from '@/featured/interviews/types'

export async function getInterviews() {
  return serverApi.get<InterviewListResponse>('/api/v1/interviews')
}
