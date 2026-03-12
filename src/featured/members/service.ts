import { serverApi } from '@/shared/lib/api'
import { cookies } from 'next/headers'
import type { Member } from '@/featured/members/types'

export async function getUsers() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  return serverApi.get<Member[]>('/api/v1/users', {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
  })
}
