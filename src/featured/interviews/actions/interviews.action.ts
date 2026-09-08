'use server'

import { getInterviews } from '@/featured/interviews/services/interviews.service'
import { INTERVIEW_LIST_QUERY_CONFIG } from '@/featured/interviews/constants'
import { parseListQuery } from '@/shared/lib/validation/listQuery'
import type { InterviewListQuery, InterviewListResponse } from '@/featured/interviews/types'
import type { ActionResult } from '@/shared/types/action'

export type GetInterviewsActionState = ActionResult<InterviewListResponse>

export async function getInterviewsAction(query: unknown): Promise<GetInterviewsActionState> {
  const parsed = parseListQuery(query, INTERVIEW_LIST_QUERY_CONFIG)
  if (!parsed.success) {
    return { success: false, error: parsed.error }
  }

  try {
    const data = await getInterviews(parsed.data satisfies InterviewListQuery)
    if (!data) {
      return { success: false, error: '면접 목록 응답 데이터가 없습니다.' }
    }
    return { success: true, data }
  } catch (error: unknown) {
    const apiError = error as { message?: string }
    return { success: false, error: apiError.message ?? '면접 조회에 실패했습니다.' }
  }
}
