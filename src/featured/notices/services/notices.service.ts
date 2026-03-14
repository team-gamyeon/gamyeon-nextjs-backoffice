import { serverApi } from '@/shared/lib/api'
import { timeAgo } from '@/shared/lib/utils/timeAgo'
import type { ApiNotice, Notice, NoticeListResponse, CreateNoticeRequest, CreateNoticeResponse, UpdateNoticeRequest, UpdateNoticeResponse } from '@/featured/notices/types'

export async function getNotices() {
  return serverApi.get<NoticeListResponse>('/api/v1/notices')
}

export async function createNotice(body: CreateNoticeRequest) {
  return serverApi.post<CreateNoticeResponse>('/api/v1/notices', body)
}

export async function updateNotice(id: number, body: UpdateNoticeRequest) {
  return serverApi.patch<UpdateNoticeResponse>(`/api/v1/notices/${id}`, body)
}

export function mapApiNoticeToNotice(notice: ApiNotice): Notice {
  return {
    id: String(notice.id),
    title: notice.title,
    content: notice.content,
    isActive: true,
    createdAt: timeAgo(notice.createdAt),
    updatedAt: timeAgo(notice.updatedAt),
  }
}
