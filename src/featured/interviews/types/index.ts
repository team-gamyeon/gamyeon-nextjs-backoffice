import type { ListQueryParams, PaginatedData, SortOrder } from '@/shared/types/pagination'
import type { ApiUserStatus } from '@/featured/members/types'

// API 응답 타입
export type InterviewStatus = 'READY' | 'IN_PROGRESS' | 'PAUSED' | 'FINISHED'
export type InterviewSortBy = 'createdAt' | 'startedAt' | 'durationSeconds'
export type UserProvider = 'GOOGLE' | 'KAKAO'

// UserStatus는 ApiUserStatus의 별칭 (호환성 유지)
export type UserStatus = ApiUserStatus

export interface ApiInterviewUser {
  id: number
  email: string
  nickname: string
  provider: UserProvider
  providerId: string
  status: UserStatus
  withdrawnAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ApiInterview {
  id: number
  userId: number
  title: string
  status: InterviewStatus
  startedAt: string | null
  finishedAt: string | null
  pausedAt: string | null
  durationSeconds: string | number
  totalPausedSeconds: string | number
  createdAt: string
  updatedAt: string
  user: ApiInterviewUser | null
}

export type InterviewListResponse = PaginatedData<ApiInterview>

export interface InterviewListQuery extends ListQueryParams {
  status?: InterviewStatus
  search?: string
  sortBy: InterviewSortBy
  sortOrder: SortOrder
  page: number
  from?: string
  to?: string
}

// UI 타입
export interface InterviewSession {
  id: string
  userId: string
  userNickname: string
  intvTitle: string
  status: InterviewStatus
  questionCount: number
  answeredCount: number
  score?: number
  durationSec: number
  startedAt: string | null
  pausedAt: string | null
  createdAt: string
  endedAt?: string
}

export interface SessionFiltersState {
  search: string
  status: InterviewStatus | 'all'
  sortBy: InterviewSortBy
  sortOrder: SortOrder
}
