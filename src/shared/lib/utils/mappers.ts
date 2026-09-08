import { timeAgo } from '@/shared/lib/utils/timeAgo'
import { STATUS_MAP } from '@/featured/members/constants'
import type { ApiNotice, Notice } from '@/featured/notices/types'
import type { ApiUser, Member } from '@/featured/members/types'
import type { ApiQuestion, CommonQuestion } from '@/featured/questions/types'
import type { ApiReport, AnalysisReport } from '@/featured/reports/types'

export function mapApiNoticeToNotice(notice: ApiNotice): Notice {
  return {
    id: String(notice.id),
    title: notice.title,
    content: notice.content,
    category: notice.category,
    isActive: notice.status === 'ACTIVE',
    createdAt: timeAgo(notice.createdAt),
    updatedAt: timeAgo(notice.updatedAt),
  }
}

export function mapApiUserToMember(user: ApiUser): Member {
  return {
    id: String(user.id),
    nickname: user.nickname,
    email: user.email,
    passwordHash: '',
    status: STATUS_MAP[user.status] ?? 'active',
    joinedAt: timeAgo(user.createdAt),
    lastActiveAt: timeAgo(user.updatedAt),
    sessionCount: 0,
    sanctionHistory: [],
  }
}

export function mapApiReportToAnalysisReport(report: ApiReport): AnalysisReport {
  return {
    id: report.reportId,
    sessionId: report.intvId,
    userNickname: report.user.nickname,
    jobCategory: report.jobCategory,
    status: report.status,
    score: report.score ?? undefined,
    createdAt: timeAgo(report.createdAt),
    completedAt: report.completedAt ? timeAgo(report.completedAt) : undefined,
  }
}

export function mapApiQuestionToCommon(question: ApiQuestion): CommonQuestion {
  return {
    id: question.id,
    content: question.content,
    category: '자기소개',
    isActive: question.status === 'ACTIVE',
    usageCount: 0,
    createdAt: timeAgo(question.createdAt),
    updatedAt: timeAgo(question.updatedAt),
  }
}
