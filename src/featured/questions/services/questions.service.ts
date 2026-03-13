import { serverApi } from '@/shared/lib/api'
import { timeAgo } from '@/shared/lib/utils/timeAgo'
import type { ApiQuestion, CommonQuestion, QuestionListResponse } from '@/featured/questions/types'

export async function getQuestions() {
  return serverApi.get<QuestionListResponse>('/api/v1/questions')
}

export function mapApiQuestionToCommon(q: ApiQuestion): CommonQuestion {
  return {
    id: q.id,
    content: q.content,
    category: '자기소개',
    isActive: q.status === 'ACTIVE',
    usageCount: 0,
    createdAt: timeAgo(q.createdAt),
    updatedAt: timeAgo(q.updatedAt),
  }
}
