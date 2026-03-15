// API 응답 타입
export type InterviewStatus = 'READY' | 'IN_PROGRESS' | 'PAUSED' | 'FINISHED'
export type UserProvider = 'GOOGLE' | 'KAKAO'
export type UserStatus = 'ACTIVE' | 'WARNED' | 'BANNED' | 'WITHDREW'

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
  durationSeconds: number
  totalPausedSeconds: number
  createdAt: string
  updatedAt: string
  user: ApiInterviewUser
}

export interface InterviewListResponse {
  totalCount: number
  filteredCount: number
  page: number
  limit: number
  items: ApiInterview[]
}

// UI 타입
export type SessionStatus = 'completed' | 'in_progress' | 'abandoned'

export interface InterviewSession {
  id: string
  userId: string
  userNickname: string
  interviewTitle: string
  status: SessionStatus
  questionCount: number
  answeredCount: number
  score?: number
  durationSec: number
  startedAt: string
  endedAt?: string
}

export interface SessionFiltersState {
  search: string
  status: SessionStatus | 'all'
  jobCategory: string
  sortBy: 'startedAt' | 'score' | 'durationSec'
  sortOrder: 'asc' | 'desc'
}
