import { serverApi } from '@/shared/lib/api'
import type {
  CreateQuestionRequest,
  CreateQuestionResponse,
  DeleteQuestionResponse,
  QuestionListResponse,
  UpdateQuestionRequest,
  UpdateQuestionResponse,
} from '@/featured/questions/types'

export async function getQuestions(): Promise<QuestionListResponse | null> {
  try {
    return await serverApi.get<QuestionListResponse>('/api/v1/questions')
  } catch {
    return null
  }
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
