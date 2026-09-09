'use server'

import { revalidatePath } from 'next/cache'
import {
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} from '@/featured/notices/services/notices.service'
import { NOTICE_LIST_QUERY_CONFIG } from '@/featured/notices/constants'
import { mapApiNoticeToNotice } from '@/shared/lib/utils/mappers'
import { toActionResult } from '@/shared/lib/action/toActionResult'
import { parseListQuery } from '@/shared/lib/validation/listQuery'
import type { ActionResult } from '@/shared/types/action'
import type {
  NoticeListData,
  GetNoticesParams,
  CreateNoticeRequest,
  CreateNoticeResponse,
  UpdateNoticeRequest,
  UpdateNoticeResponse,
  DeleteNoticeResponse,
} from '@/featured/notices/types'

export type GetNoticesActionState = ActionResult<NoticeListData>

export type CreateNoticeActionState = ActionResult<CreateNoticeResponse>

export type UpdateNoticeActionState = ActionResult<UpdateNoticeResponse>

export type DeleteNoticeActionState = ActionResult<DeleteNoticeResponse>

export async function getNoticesAction(params: unknown = {}): Promise<GetNoticesActionState> {
  const parsed = parseListQuery(params, NOTICE_LIST_QUERY_CONFIG)
  if (!parsed.success) {
    return { success: false, error: parsed.error }
  }

  return toActionResult(async () => {
    const safeParams = parsed.data satisfies GetNoticesParams
    const data = await getNotices(safeParams)
    if (!data) throw new Error('공지사항 목록 응답 데이터가 없습니다.')

    return {
      totalCount: data.totalCount,
      filteredCount: data.filteredCount,
      page: data.page ?? safeParams.page,
      limit: data.limit ?? safeParams.limit,
      items: data.items.map(mapApiNoticeToNotice),
    }
  }, '공지사항 조회에 실패했습니다.')
}

export async function createNoticeAction(
  body: CreateNoticeRequest,
): Promise<CreateNoticeActionState> {
  return toActionResult(async () => {
    const data = await createNotice(body)
    revalidatePath('/notices')
    return data
  }, '공지사항 생성에 실패했습니다.')
}

export async function updateNoticeAction(
  id: number,
  body: UpdateNoticeRequest,
): Promise<UpdateNoticeActionState> {
  return toActionResult(async () => {
    const data = await updateNotice(id, body)
    revalidatePath('/notices')
    return data
  }, '공지사항 수정에 실패했습니다.')
}

export async function deleteNoticeAction(id: number): Promise<DeleteNoticeActionState> {
  return toActionResult(async () => {
    const data = await deleteNotice(id)
    revalidatePath('/notices')
    return data
  }, '공지사항 삭제에 실패했습니다.')
}
