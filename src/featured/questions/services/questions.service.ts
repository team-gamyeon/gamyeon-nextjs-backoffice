import { serverApi } from '@/shared/lib/api'
import type {
  CreateQuestionRequest,
  CreateQuestionResponse,
  DeleteQuestionResponse,
  QuestionListQuery,
  QuestionListResponse,
  UpdateQuestionRequest,
  UpdateQuestionResponse,
} from '@/featured/questions/types'

export async function getQuestions(
  params: QuestionListQuery = {},
): Promise<QuestionListResponse | null> {
  const queryParams = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined),
  ) as Record<string, string | number | boolean>

  const response = await serverApi.get<QuestionListResponse>('/api/v1/questions', {
    params: queryParams,
  })

  if (process.env.NODE_ENV === 'development') {
    console.debug('[questions.service] request completed', {
      method: 'GET',
      endpoint: '/api/v1/questions',
      totalCount: response?.totalCount,
      filteredCount: response?.filteredCount,
      page: response?.page,
      limit: response?.limit,
      itemCount: response?.items?.length,
    })
  }

  return response
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
