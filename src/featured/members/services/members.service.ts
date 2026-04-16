import { serverApi } from '@/shared/lib/api'
import type { UserListResponse } from '@/featured/members/types'

export async function getUsers(): Promise<UserListResponse | null> {
  try {
    return await serverApi.get<UserListResponse>('/api/v1/users')
  } catch {
    return null
  }
}
