import type { ApiUserStatus, MemberStatus } from '@/featured/members/types'
import type { MemberSortBy } from '@/featured/members/types'
import type { ListQueryConfig } from '@/shared/lib/validation/listQuery'

export const MEMBER_STATUSES = [
  'ACTIVE',
  'WARNED',
  'BANNED',
  'WITHDREW',
] as const satisfies readonly ApiUserStatus[]

export const MEMBER_SORT_FIELDS = [
  'createdAt',
  'updatedAt',
] as const satisfies readonly MemberSortBy[]

export const MEMBER_LIST_QUERY_CONFIG = {
  statuses: MEMBER_STATUSES,
  sortFields: MEMBER_SORT_FIELDS,
  defaultSortBy: 'createdAt',
  defaultSortOrder: 'desc',
} as const satisfies ListQueryConfig<ApiUserStatus, MemberSortBy>

export const STATUS_MAP: Record<ApiUserStatus, MemberStatus> = {
  ACTIVE: 'active',
  WARNED: 'warning',
  BANNED: 'suspended',
  WITHDREW: 'withdrew',
}

// unknown은 display-only이므로 쿼리 맵에 포함되지 않음
export const MEMBER_STATUS_QUERY_MAP: Record<Exclude<MemberStatus, 'unknown'>, ApiUserStatus> = {
  active: 'ACTIVE',
  warning: 'WARNED',
  suspended: 'BANNED',
  withdrew: 'WITHDREW',
}
