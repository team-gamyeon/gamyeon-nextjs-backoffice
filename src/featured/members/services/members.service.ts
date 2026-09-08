import { serverApi } from '@/shared/lib/api'
import type { MemberListQuery, UserListResponse } from '@/featured/members/types'

export async function getUsers(query: MemberListQuery = {}): Promise<UserListResponse | null> {
  const params = Object.fromEntries(
    Object.entries(query).filter(([, value]) => value !== undefined),
  )

  try {
    return await serverApi.get<UserListResponse>('/api/v1/users', { params })
  } catch {
    return null
  }
}
