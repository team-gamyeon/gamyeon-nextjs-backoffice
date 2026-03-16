export interface SignupTrendItem {
  date: string
  count: number
}

export interface CompletionSegment {
  label: string
  count: number
  percentage: number
}

export interface ActivityItem {
  type: string
  message: string
  createdAt: string
}

export interface DashboardSummary {
  kpi: {
    totalUsers: { value: number }
    activeQuestions: { value: number }
    totalNotices: { value: number }
    pausedInterviews: { value: number }
    analyzingReports: { value: number }
  }
  signupTrend: {
    period: string
    items: SignupTrendItem[]
  }
  interviewCompletion: {
    completionRate: number
    segments: CompletionSegment[]
  }
  reportAnalysis: {
    completionRate: number
    totalCount: number
    segments: CompletionSegment[]
  }
  recentActivities: {
    items: ActivityItem[]
  }
}
