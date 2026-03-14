import { serverApi } from '@/shared/lib/api'
import type { UserListResponse } from '@/featured/members/types'

export async function getUsers() {
  return serverApi.get<UserListResponse>('/api/v1/users')
}
