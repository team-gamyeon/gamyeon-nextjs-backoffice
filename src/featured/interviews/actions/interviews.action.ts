'use server'

import { getInterviews } from '@/featured/interviews/services/interviews.service'
import type { InterviewListResponse } from '@/featured/interviews/types'

export interface GetInterviewsActionState {
  success: boolean
  data?: InterviewListResponse
  error?: string
}

export async function getInterviewsAction(): Promise<GetInterviewsActionState> {
  try {
    const data = await getInterviews()
    return { success: true, data }
  } catch (error: unknown) {
    const apiError = error as { message?: string }
    return { success: false, error: apiError.message ?? '면접 조회에 실패했습니다.' }
  }
}
