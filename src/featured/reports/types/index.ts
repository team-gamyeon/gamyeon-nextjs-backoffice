// API 타입
export type ReportStatus = 'COMPLETED' | 'IN_PROGRESS' | 'FAILED'
export type ReportSortBy = 'completedAt' | 'createdAt' | 'score'
export type SortOrder = 'asc' | 'desc'

export interface ApiReport {
  reportId: string
  status: ReportStatus
  score: number | null
  jobCategory: string
  nickname: string
  interviewId: number
  interviewTitle: string
  createdAt: string
  completedAt: string | null
}

export interface ReportListResponse {
  totalCount: number
  filteredCount: number
  page: number
  limit: number
  items: ApiReport[]
}

export interface GetReportsParams {
  status?: ReportStatus
  search?: string
  sortBy?: ReportSortBy
  sortOrder?: SortOrder
  page?: number
  limit?: number
}

// UI 타입
export interface AnalysisReport {
  id: string
  sessionId: string
  userNickname: string
  interviewTitle: string
  status: ReportStatus
  score?: number
  summary?: string
  strengths?: string[]
  improvements?: string[]
  createdAt: string
  completedAt?: string
}
