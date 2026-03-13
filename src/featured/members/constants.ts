import type { ApiUserStatus, MemberStatus } from '@/featured/members/types'

export const STATUS_MAP: Record<ApiUserStatus, MemberStatus> = {
  ACTIVE: 'active',
  WARNING: 'warning',
  SUSPENDED: 'suspended',
}
