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
import { toActionResult } from '@/shared/lib/action/toActionResult'
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

export type CreateQuestionActionState = ActionResult<CreateQuestionResponse>

export type UpdateQuestionActionState = ActionResult<UpdateQuestionResponse>

export type DeleteQuestionActionState = ActionResult<DeleteQuestionResponse>

export async function getQuestionsAction(params: unknown): Promise<GetQuestionsActionState> {
  const parsed = parseListQuery(params, QUESTION_LIST_QUERY_CONFIG)
  if (!parsed.success) {
    return { success: false, error: parsed.error }
  }

  return toActionResult(async () => {
    const data = await getQuestions(parsed.data satisfies QuestionListQuery)
    if (!data) throw new Error('질문 목록 응답 데이터가 없습니다.')

    return {
      totalCount: data.totalCount,
      filteredCount: data.filteredCount,
      page: data.page,
      limit: data.limit,
      items: data.items.map(mapApiQuestionToCommon),
    }
  }, '질문 조회에 실패했습니다.')
}

export async function createQuestionAction(
  _prevState: CreateQuestionActionState | null,
  formData: FormData,
): Promise<CreateQuestionActionState> {
  const content = formData.get('content') as string
  const status = formData.get('status') as 'ACTIVE' | 'INACTIVE'

  return toActionResult(async () => {
    const data = await createQuestion({ content, status })
    revalidatePath('/questions')
    return data
  }, '질문 생성에 실패했습니다.')
}

export async function updateQuestionAction(
  id: string,
  body: { content?: string; status?: QuestionStatus },
): Promise<UpdateQuestionActionState> {
  return toActionResult(async () => {
    const data = await updateQuestion(id, body)
    revalidatePath('/questions')
    return data
  }, '질문 수정에 실패했습니다.')
}

export async function deleteQuestionAction(id: string): Promise<DeleteQuestionActionState> {
  return toActionResult(async () => {
    const data = await deleteQuestion(id)
    revalidatePath('/questions')
    return data
  }, '질문 삭제에 실패했습니다.')
}
