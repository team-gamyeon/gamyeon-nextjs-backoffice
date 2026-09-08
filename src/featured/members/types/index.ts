import type { ListQueryParams, PaginatedData, SortOrder } from '@/shared/types/pagination'

export type MemberStatus = 'active' | 'warning' | 'suspended' | 'withdrew'

export interface Member {
  id: string
  nickname: string
  email: string
  passwordHash: string
  status: MemberStatus
  joinedAt: string
  lastActiveAt: string
  sessionCount: number
  sanctionHistory: Sanction[]
}

export interface Sanction {
  id: string
  type: 'warning' | 'suspended'
  reason: string
  adminNote: string
  createdAt: string
  expiresAt?: string
}

export interface MemberFiltersState {
  search: string
  status: MemberStatus | 'all'
  sortBy: MemberSortBy
  sortOrder: SortOrder
}

// API 응답 타입
export type ApiUserStatus = 'ACTIVE' | 'WARNED' | 'BANNED' | 'WITHDREW'
export type MemberSortBy = 'createdAt' | 'updatedAt'

export interface MemberListQuery extends ListQueryParams {
  status?: ApiUserStatus
  sortBy?: MemberSortBy
  sortOrder?: SortOrder
}

export interface ApiUser {
  id: number
  nickname: string
  email: string
  provider: string
  status: ApiUserStatus
  createdAt: string
  updatedAt: string
}

export type UserListResponse = PaginatedData<ApiUser>
