import type { ListQueryParams, PaginatedData, SortOrder } from '@/shared/types/pagination'

// 백엔드 유저 상태 코드. 유저 도메인의 주인인 members가 소유하고, 필요한 피처가 여기서 가져다 쓴다.
export type ApiUserStatus = 'ACTIVE' | 'WARNED' | 'BANNED' | 'WITHDREW'

export type MemberStatus = 'active' | 'warning' | 'suspended' | 'withdrew' | 'unknown'

export interface Member {
  id: string
  nickname: string
  email: string
  status: MemberStatus
  joinedAt: string
  lastActiveAt: string
}

export interface MemberFiltersState {
  search: string
  status: MemberStatus | 'all'
  sortBy: MemberSortBy
  sortOrder: SortOrder
}

// Member 정렬 방식
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
