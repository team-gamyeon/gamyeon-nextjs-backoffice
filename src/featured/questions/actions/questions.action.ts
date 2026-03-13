'use server'

import { revalidatePath } from 'next/cache'
import { createQuestion, updateQuestion } from '@/featured/questions/services/questions.service'
import type { CreateQuestionResponse, QuestionStatus, UpdateQuestionResponse } from '@/featured/questions/types'

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
