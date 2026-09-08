import { timeAgo } from '@/shared/lib/utils/timeAgo'
import type { ApiInterview, InterviewSession } from '@/featured/interviews/types'

export function mapApiInterviewToSession(interview: ApiInterview): InterviewSession {
  return {
    id: String(interview.id),
    userId: String(interview.userId),
    userNickname: interview.user?.nickname?.trim() || '알 수 없음',
    intvTitle: interview.title,
    status: interview.status,
    questionCount: 0,
    answeredCount: 0,
    durationSec: Number(interview.durationSeconds),
    startedAt: interview.startedAt ? timeAgo(interview.startedAt) : null,
    pausedAt: interview.pausedAt ? timeAgo(interview.pausedAt) : null,
    createdAt: timeAgo(interview.createdAt),
    endedAt: interview.finishedAt ? timeAgo(interview.finishedAt) : undefined,
  }
}
