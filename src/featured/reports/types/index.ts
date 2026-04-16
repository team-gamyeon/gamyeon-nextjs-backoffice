// API 타입
export type ReportStatus = 'COMPLETED' | 'IN_PROGRESS' | 'FAILED'
export type ReportSortBy = 'completedAt' | 'createdAt' | 'score'
export type SortOrder = 'asc' | 'desc'

export interface ApiReportUser {
  id: string
  email: string
  nickname: string
  provider: string
  providerId: string
  status: string
  withdrawnAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ApiReport {
  reportId: string
  intvId: string
  userId: string
  jobCategory: string
  status: ReportStatus
  score: number | null
  feedback: string | null
  completedAt: string | null
  createdAt: string
  user: ApiReportUser
}

export interface ApiQuestionResult {
  id: string
  questionId: string
  question: string
  answer: string
  score: number | null
  feedback: string | null
  reportId: string
}

export interface ApiReportDetail extends ApiReport {
  strengths: string[]
  improvements: string[]
  questionResults: ApiQuestionResult[]
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
  jobCategory: string
  status: ReportStatus
  score?: number
  summary?: string
  strengths?: string[]
  improvements?: string[]
  createdAt: string
  completedAt?: string
}
