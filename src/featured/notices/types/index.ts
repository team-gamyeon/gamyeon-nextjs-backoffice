// API 응답 타입
export type NoticeCategory = 'NOTICE' | 'UPDATE' | 'GUIDE' | 'EVENT' | 'MAINTENANCE'
export type NoticeStatus = 'ACTIVE' | 'INACTIVE'

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

export interface NoticeListResponse {
  totalCount: number
  filteredCount: number
  page: number
  limit: number
  items: ApiNotice[]
}

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
