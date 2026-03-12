import { cookies } from 'next/headers'
import { serverApi } from '@/shared/lib/api'
import type { Admin, AdminLoginPayload, LoginResponse } from '@/featured/auth/types'

export async function login(payload: AdminLoginPayload) {
  const result = await serverApi.post<LoginResponse>('/api/v1/auth/login', payload)
  if (!result) return

  const isProd = process.env.NODE_ENV === 'production'
  const cookieStore = await cookies()

  cookieStore.set('accessToken', result.accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    expires: new Date(Date.now() + result.expiresIn * 1000),
  })

  cookieStore.set('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    path: '/',
    expires: new Date(Date.now() + result.refreshExpiresIn * 1000),
  })
}

export async function getMe() {
  return serverApi.get<Admin>('/api/v1/auth/me')
}

export async function refreshToken(token: string) {
  return serverApi.post('/api/v1/auth/refresh', { refreshToken: token })
}
