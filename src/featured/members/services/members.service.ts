import { serverApi } from '@/shared/lib/api'
import { timeAgo } from '@/shared/lib/utils/timeAgo'
import { STATUS_MAP } from '@/featured/members/constants'
import type { ApiUser, Member, UserListResponse } from '@/featured/members/types'

export async function getUsers() {
  return serverApi.get<UserListResponse>('/api/v1/users')
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
