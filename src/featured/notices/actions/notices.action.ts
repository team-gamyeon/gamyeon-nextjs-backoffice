'use server'

import { revalidatePath } from 'next/cache'
import { getNotices, createNotice, updateNotice } from '@/featured/notices/services/notices.service'
import { mapApiNoticeToNotice } from '@/shared/lib/utils/mappers'
import type { Notice, CreateNoticeRequest, CreateNoticeResponse, UpdateNoticeRequest, UpdateNoticeResponse } from '@/featured/notices/types'

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
    revalidatePath('/notices')
    return { success: true, data }
  } catch (error: unknown) {
    const apiError = error as { message?: string }
    return { success: false, error: apiError.message ?? '공지사항 생성에 실패했습니다.' }
  }
}

export interface UpdateNoticeActionState {
  success: boolean
  data?: UpdateNoticeResponse
  error?: string
}

export async function updateNoticeAction(id: number, body: UpdateNoticeRequest): Promise<UpdateNoticeActionState> {
  try {
    const data = await updateNotice(id, body)
    revalidatePath('/notices')
    return { success: true, data }
  } catch (error: unknown) {
    const apiError = error as { message?: string }
    return { success: false, error: apiError.message ?? '공지사항 수정에 실패했습니다.' }
  }
}
