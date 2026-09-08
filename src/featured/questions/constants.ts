import type { ListQueryConfig } from '@/shared/lib/validation/listQuery'
import type { QuestionListStatus, QuestionSortBy } from '@/featured/questions/types'

export const QUESTION_SORT_FIELDS = [
  'createdAt',
  'updatedAt',
] as const satisfies readonly QuestionSortBy[]

export const QUESTION_STATUS_OPTIONS = [
  { value: 'ACTIVE', label: '활성' },
  { value: 'INACTIVE', label: '비활성' },
] as const satisfies readonly { value: QuestionListStatus; label: string }[]

export const QUESTION_LIST_STATUSES = QUESTION_STATUS_OPTIONS.map(
  ({ value }) => value,
) satisfies readonly QuestionListStatus[]

export const QUESTION_LIST_QUERY_CONFIG = {
  statuses: QUESTION_LIST_STATUSES,
  sortFields: QUESTION_SORT_FIELDS,
  defaultSortBy: 'createdAt',
  defaultSortOrder: 'desc',
  includeDateRange: true,
} as const satisfies ListQueryConfig<QuestionListStatus, QuestionSortBy>
