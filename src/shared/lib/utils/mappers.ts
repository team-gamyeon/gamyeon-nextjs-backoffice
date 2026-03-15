import { timeAgo } from '@/shared/lib/utils/timeAgo'
import { STATUS_MAP } from '@/featured/members/constants'
import type { ApiNotice, Notice } from '@/featured/notices/types'
import type { ApiUser, Member } from '@/featured/members/types'
import type { ApiQuestion, CommonQuestion } from '@/featured/questions/types'
import type { ApiInterview, InterviewSession, InterviewStatus, SessionStatus } from '@/featured/interviews/types'

function mapInterviewStatus(status: InterviewStatus): SessionStatus {
  if (status === 'FINISHED') return 'completed'
  if (status === 'IN_PROGRESS') return 'in_progress'
  return 'abandoned'
}

export function mapApiInterviewToSession(interview: ApiInterview): InterviewSession {
  return {
    id: String(interview.id),
    userId: String(interview.userId),
    userNickname: interview.user.nickname,
    interviewTitle: interview.title,
    status: mapInterviewStatus(interview.status),
    questionCount: 0,
    answeredCount: 0,
    durationSec: interview.durationSeconds,
    startedAt: interview.startedAt ? timeAgo(interview.startedAt) : '-',
    endedAt: interview.finishedAt ? timeAgo(interview.finishedAt) : undefined,
  }
}

export function mapApiNoticeToNotice(notice: ApiNotice): Notice {
  return {
    id: String(notice.id),
    title: notice.title,
    content: notice.content,
    category: notice.category,
    isActive: true,
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
