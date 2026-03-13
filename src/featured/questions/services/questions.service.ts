import { serverApi } from '@/shared/lib/api'
import { timeAgo } from '@/shared/lib/utils/timeAgo'
import type {
  ApiQuestion,
  CommonQuestion,
  CreateQuestionRequest,
  CreateQuestionResponse,
  DeleteQuestionResponse,
  QuestionListResponse,
  UpdateQuestionRequest,
  UpdateQuestionResponse,
} from '@/featured/questions/types'

export async function getQuestions() {
  return serverApi.get<QuestionListResponse>('/api/v1/questions')
}

export async function createQuestion(body: CreateQuestionRequest) {
  return serverApi.post<CreateQuestionResponse>('/api/v1/questions', body)
}

export async function updateQuestion(id: string, body: UpdateQuestionRequest) {
  return serverApi.patch<UpdateQuestionResponse>(`/api/v1/questions/${id}`, body)
}

export async function deleteQuestion(id: string) {
  return serverApi.delete<DeleteQuestionResponse>(`/api/v1/questions/${id}`)
}

export function mapApiQuestionToCommon(question: ApiQuestion): CommonQuestion {
  return {
    id: question.id,
    content: question.content,
    category: '자기소개',
    isActive: question.status === 'ACTIVE',
    usageCount: 0,
    createdAt: timeAgo(question.createdAt),
    updatedAt: timeAgo(question.updatedAt),
  }
}
