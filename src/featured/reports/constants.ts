import type { ListQueryConfig } from '@/shared/lib/validation/listQuery'
import type { ReportSortBy, ReportStatus } from '@/featured/reports/types'

export const REPORT_STATUS_OPTIONS = [
  { value: 'COMPLETED', label: '분석 완료' },
  { value: 'IN_PROGRESS', label: '분석 중' },
  { value: 'FAILED', label: '실패' },
] as const satisfies readonly { value: ReportStatus; label: string }[]

export const REPORT_SORT_OPTIONS = [
  { value: 'createdAt', label: '생성일 순' },
  { value: 'completedAt', label: '완료일 순' },
  { value: 'score', label: '점수 순' },
] as const satisfies readonly { value: ReportSortBy; label: string }[]

export const REPORT_STATUSES = REPORT_STATUS_OPTIONS.map(
  ({ value }) => value,
) satisfies readonly ReportStatus[]

export const REPORT_SORT_FIELDS = REPORT_SORT_OPTIONS.map(
  ({ value }) => value,
) satisfies readonly ReportSortBy[]

export const REPORT_LIST_QUERY_CONFIG = {
  statuses: REPORT_STATUSES,
  sortFields: REPORT_SORT_FIELDS,
  defaultSortBy: 'createdAt',
  defaultSortOrder: 'desc',
} as const satisfies ListQueryConfig<ReportStatus, ReportSortBy>
