'use server'

import { createQuestion } from '@/featured/questions/services/questions.service'
import type { CreateQuestionResponse } from '@/featured/questions/types'

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
    return { success: true, data: data ?? undefined }
  } catch (error: unknown) {
    const apiError = error as { message?: string }
    return { success: false, error: apiError.message ?? '질문 생성에 실패했습니다.' }
  }
}
