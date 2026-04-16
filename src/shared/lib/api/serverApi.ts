import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NetworkError } from './types'
import type { RequestConfig } from './types'
import { buildUrl, parseApiResponse } from './_utils'

async function tryRefresh(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
): Promise<string | null> {
  const refreshToken = cookieStore.get('refreshToken')?.value
  if (!refreshToken) return null

  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '')
  try {
    const res = await fetch(`${apiUrl}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    const data = await res.json()
    if (!data.success || !data.data?.accessToken) return null

    const newAccessToken: string = data.data.accessToken
    const isProd = process.env.NODE_ENV === 'production'

    try {
      cookieStore.set('accessToken', newAccessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        path: '/',
      })
      if (data.data.refreshToken) {
        cookieStore.set('refreshToken', data.data.refreshToken, {
          httpOnly: true,
          secure: isProd,
          sameSite: 'lax',
          path: '/',
        })
      }
    } catch {
      // RSC 컨텍스트 — 쿠키 저장 불가, 현재 요청 retry에만 사용
    }

    return newAccessToken
  } catch {
    return null
  }
}

async function serverFetch<T>(
  method: string,
  endpoint: string,
  body?: unknown,
  config?: RequestConfig,
): Promise<T> {
  const cookieStore = await cookies()
  const url = buildUrl(endpoint, config?.params)
  const jsonBody = body !== undefined ? JSON.stringify(body) : undefined

  const doFetch = (accessToken: string) =>
    fetch(url, {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        ...(jsonBody !== undefined && { 'Content-Type': 'application/json' }),
        ...config?.headers,
      },
      body: jsonBody,
      cache: config?.cache,
      next: config?.next,
    })

  const accessToken = cookieStore.get('accessToken')?.value ?? ''

  let res: Response
  try {
    res = await doFetch(accessToken)
  } catch {
    throw new NetworkError()
  }

  if (res.status === 401) {
    const newAccessToken = await tryRefresh(cookieStore)
    if (!newAccessToken) redirect('/login')

    try {
      res = await doFetch(newAccessToken)
    } catch {
      throw new NetworkError()
    }
  }

  const { data, error } = await parseApiResponse<T>(res)
  if (error) throw error
  return data as T
}

export const serverApi = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    serverFetch<T>('GET', endpoint, undefined, config),

  post: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    serverFetch<T>('POST', endpoint, body, config),

  put: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    serverFetch<T>('PUT', endpoint, body, config),

  patch: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    serverFetch<T>('PATCH', endpoint, body, config),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    serverFetch<T>('DELETE', endpoint, undefined, config),
}
