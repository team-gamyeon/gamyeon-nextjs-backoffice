import { serverApi } from '@/shared/lib/api'
import type {
  NoticeListResponse,
  GetNoticesParams,
  CreateNoticeRequest,
  CreateNoticeResponse,
  UpdateNoticeRequest,
  UpdateNoticeResponse,
  DeleteNoticeResponse,
} from '@/featured/notices/types'

export async function getNotices(params: GetNoticesParams = {}) {
  const queryParams = Object.fromEntries(
    Object.entries(params).filter(
      (entry): entry is [string, string | number] => entry[1] !== undefined,
    ),
  )

  return serverApi.get<NoticeListResponse>('/api/v1/notices', {
    cache: 'no-store',
    params: queryParams,
  })
}

export async function createNotice(body: CreateNoticeRequest) {
  return serverApi.post<CreateNoticeResponse>('/api/v1/notices', body)
}

export async function updateNotice(id: number, body: UpdateNoticeRequest) {
  return serverApi.patch<UpdateNoticeResponse>(`/api/v1/notices/${id}`, body)
}

export async function deleteNotice(id: number) {
  return serverApi.delete<DeleteNoticeResponse>(`/api/v1/notices/${id}`)
}
