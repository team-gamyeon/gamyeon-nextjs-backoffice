'use server'

import { getNotices, createNotice, mapApiNoticeToNotice } from '@/featured/notices/services/notices.service'
import type { Notice, CreateNoticeRequest, CreateNoticeResponse } from '@/featured/notices/types'

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

export interface CreateNoticeActionState {
  success: boolean
  data?: CreateNoticeResponse
  error?: string
}

export async function createNoticeAction(body: CreateNoticeRequest): Promise<CreateNoticeActionState> {
  try {
    const data = await createNotice(body)
    return { success: true, data }
  } catch (error: unknown) {
    const apiError = error as { message?: string }
    return { success: false, error: apiError.message ?? '공지사항 생성에 실패했습니다.' }
  }
}
