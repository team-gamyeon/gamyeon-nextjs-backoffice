'use server'

import { revalidatePath } from 'next/cache'
import {
  createQuestion,
  deleteQuestion,
  getQuestions,
  updateQuestion,
} from '@/featured/questions/services/questions.service'
import { QUESTION_LIST_QUERY_CONFIG } from '@/featured/questions/constants'
import { mapApiQuestionToCommon } from '@/shared/lib/utils/mappers'
import { parseListQuery } from '@/shared/lib/validation/listQuery'
import type { ActionResult } from '@/shared/types/action'
import type {
  CreateQuestionResponse,
  DeleteQuestionResponse,
  QuestionListData,
  QuestionListQuery,
  QuestionStatus,
  UpdateQuestionResponse,
} from '@/featured/questions/types'

export type GetQuestionsActionState = ActionResult<QuestionListData>

export async function getQuestionsAction(params: unknown): Promise<GetQuestionsActionState> {
  const parsed = parseListQuery(params, QUESTION_LIST_QUERY_CONFIG)
  if (!parsed.success) {
    return { success: false, error: parsed.error }
  }

  try {
    const data = await getQuestions(parsed.data satisfies QuestionListQuery)
    if (!data) {
      return { success: false, error: '질문 조회에 실패했습니다.' }
    }

    return {
      success: true,
      data: {
        totalCount: data.totalCount,
        filteredCount: data.filteredCount,
        page: data.page,
        limit: data.limit,
        items: data.items.map(mapApiQuestionToCommon),
      },
    }
  } catch (error: unknown) {
    const apiError = error as { message?: string }
    return { success: false, error: apiError.message ?? '질문 조회에 실패했습니다.' }
  }
}

export interface CreateQuestionActionState {
  success: boolean
  data?: CreateQuestionResponse
  error?: string
}

export async function createQuestionAction(
  _prevState: CreateQuestionActionState | null,
  formData: FormData,
): Promise<CreateQuestionActionState> {
  const content = formData.get('content') as string
  const status = formData.get('status') as 'ACTIVE' | 'INACTIVE'

  try {
    const data = await createQuestion({ content, status })
    revalidatePath('/questions')
    return { success: true, data: data ?? undefined }
  } catch (error: unknown) {
    const apiError = error as { message?: string }
    return { success: false, error: apiError.message ?? '질문 생성에 실패했습니다.' }
  }
}

export interface UpdateQuestionActionState {
  success: boolean
  data?: UpdateQuestionResponse
  error?: string
}

export async function updateQuestionAction(
  id: string,
  body: { content?: string; status?: QuestionStatus },
): Promise<UpdateQuestionActionState> {
  try {
    const data = await updateQuestion(id, body)
    revalidatePath('/questions')
    return { success: true, data: data ?? undefined }
  } catch (error: unknown) {
    const apiError = error as { message?: string }
    return { success: false, error: apiError.message ?? '질문 수정에 실패했습니다.' }
  }
}

export interface DeleteQuestionActionState {
  success: boolean
  data?: DeleteQuestionResponse
  error?: string
}

export async function deleteQuestionAction(id: string): Promise<DeleteQuestionActionState> {
  try {
    const data = await deleteQuestion(id)
    revalidatePath('/questions')
    return { success: true, data: data ?? undefined }
  } catch (error: unknown) {
    const apiError = error as { message?: string }
    return { success: false, error: apiError.message ?? '질문 삭제에 실패했습니다.' }
  }
}
