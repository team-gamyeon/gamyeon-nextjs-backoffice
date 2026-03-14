'use server'

import { getNotices, mapApiNoticeToNotice } from '@/featured/notices/services/notices.service'
import type { Notice } from '@/featured/notices/types'

export interface GetNoticesActionState {
  success: boolean
  data?: Notice[]
  error?: string
}

export async function getNoticesAction(): Promise<GetNoticesActionState> {
  try {
    const data = await getNotices()
    const notices = (data?.items ?? []).map(mapApiNoticeToNotice)
    return { success: true, data: notices }
  } catch (error: unknown) {
    const apiError = error as { message?: string }
    return { success: false, error: apiError.message ?? '공지사항 조회에 실패했습니다.' }
  }
}
