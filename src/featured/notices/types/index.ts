// API 응답 타입
export type NoticeCategory = 'UPDATE' | 'EVENT' | 'MAINTENANCE' | 'ETC'

export interface ApiNotice {
  id: number
  title: string
  content: string
  category: NoticeCategory
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

// UI 타입 (NoticesClient 전용)
export interface Notice {
  id: string
  title: string
  content: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}
