import { serverApi } from '@/shared/lib/api'
import { cookies } from 'next/headers'
import type { Notice } from '@/featured/notices/types'

export async function getNotices() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  return serverApi.get<Notice[]>('/api/v1/notices', {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
  })
}
