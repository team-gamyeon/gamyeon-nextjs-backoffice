import { serverApi } from '@/shared/lib/api'
import type { Admin, AdminLoginPayload } from '@/featured/auth/types'

export async function login(payload: AdminLoginPayload) {
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '')
  const url = `${baseUrl}/api/v1/auth/login`

  console.log('[login] REQUEST →', url, JSON.stringify(payload))

  let res: Response
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.error('[login] NETWORK ERROR:', err)
    throw err
  }

  const text = await res.text()
  console.log('[login] RESPONSE status:', res.status)
  console.log('[login] RESPONSE headers:', Object.fromEntries(res.headers.entries()))
  console.log('[login] RESPONSE body:', text)

  return serverApi.post<Admin>('/api/v1/auth/login', payload)
}

export async function refreshToken(token: string) {
  return serverApi.post('/api/v1/auth/refresh', { refreshToken: token })
}
