import { serverApi } from '@/shared/lib/api'
import type { ApiUser, ApiUserStatus, Member, MemberStatus, UserListResponse } from '@/featured/members/types'

export async function getUsers() {
  return serverApi.get<UserListResponse>('/api/v1/users')
}

const STATUS_MAP: Record<ApiUserStatus, MemberStatus> = {
  ACTIVE: 'active',
  WARNING: 'warning',
  SUSPENDED: 'suspended',
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export function mapApiUserToMember(user: ApiUser): Member {
  return {
    id: String(user.id),
    nickname: user.nickname,
    email: user.email,
    passwordHash: '',
    status: STATUS_MAP[user.status] ?? 'active',
    joinedAt: formatDate(user.createdAt),
    lastActiveAt: formatDate(user.updatedAt),
    sessionCount: 0,
    sanctionHistory: [],
  }
}
