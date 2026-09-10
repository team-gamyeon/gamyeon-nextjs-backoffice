import type { ListQueryParams, PaginatedData } from '@/shared/types/pagination'

// API 응답 타입
export type NoticeCategory = 'NOTICE' | 'UPDATE' | 'GUIDE' | 'EVENT' | 'MAINTENANCE'
export type NoticeStatus = 'ACTIVE' | 'INACTIVE'
export type NoticeSortBy = 'createdAt' | 'updatedAt'

export interface GetNoticesParams extends ListQueryParams {
  status?: NoticeStatus
  sortBy?: NoticeSortBy
  from?: string
  to?: string
}

export interface CreateNoticeRequest {
  title: string
  content: string
  category: NoticeCategory
}

export interface CreateNoticeResponse {
  id: number
  title: string
  content: string
  category: NoticeCategory
}

export interface UpdateNoticeRequest {
  title?: string
  content?: string
  status?: NoticeStatus
  category?: NoticeCategory
}

export interface UpdateNoticeResponse {
  id: number
  title: string
  content: string
  category: NoticeCategory
}

export interface ApiNotice {
  id: number
  title: string
  content: string
  category: NoticeCategory
  status: 'ACTIVE' | 'INACTIVE'
  images: string[]
  createdAt: string
  updatedAt: string
}

export type NoticeListResponse = PaginatedData<ApiNotice>

export interface DeleteNoticeResponse {
  id: number
}

// UI 타입 (NoticesClient 전용)
export interface Notice {
  id: string
  title: string
  content: string
  category: NoticeCategory
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type NoticeListData = PaginatedData<Notice>
