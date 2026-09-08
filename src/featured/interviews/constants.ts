import type { ListQueryConfig } from '@/shared/lib/validation/listQuery'
import type { InterviewSortBy, InterviewStatus } from '@/featured/interviews/types'

export const INTERVIEW_STATUS_OPTIONS = [
  { value: 'READY', label: '대기' },
  { value: 'IN_PROGRESS', label: '진행 중' },
  { value: 'PAUSED', label: '일시중지' },
  { value: 'FINISHED', label: '완료' },
] as const satisfies readonly { value: InterviewStatus; label: string }[]

export const INTERVIEW_SORT_OPTIONS = [
  { value: 'createdAt', label: '생성일' },
  { value: 'startedAt', label: '시작일' },
  { value: 'durationSeconds', label: '진행 시간' },
] as const satisfies readonly { value: InterviewSortBy; label: string }[]

export const INTERVIEW_STATUSES = INTERVIEW_STATUS_OPTIONS.map(
  ({ value }) => value,
) satisfies readonly InterviewStatus[]

export const INTERVIEW_SORT_FIELDS = INTERVIEW_SORT_OPTIONS.map(
  ({ value }) => value,
) satisfies readonly InterviewSortBy[]

export const INTERVIEW_LIST_QUERY_CONFIG = {
  statuses: INTERVIEW_STATUSES,
  sortFields: INTERVIEW_SORT_FIELDS,
  defaultSortBy: 'createdAt',
  defaultSortOrder: 'desc',
  includeDateRange: true,
} as const satisfies ListQueryConfig<InterviewStatus, InterviewSortBy>
