import { toast } from 'sonner'
import { NetworkError } from './types'
import { parseApiResponse, serializeBody } from './_utils'
import type { RequestConfig } from './types'

/**
 * Next.js Route Handler 전용 fetch 래퍼.
 * clientApi와 달리 NEXT_PUBLIC_API_URL을 붙이지 않고 상대경로로 호출한다.
 *
 * @example
 * const data = await routeApi.get<DashboardSummary>('/api/dashboard/summary')
 * await routeApi.post('/api/notices', { title, content })
 */
async function request<T>(
  method: string,
  endpoint: string,
  body?: unknown,
  config?: RequestConfig,
): Promise<T | null> {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

  const url = config?.params
    ? `${path}?${new URLSearchParams(
        Object.fromEntries(
          Object.entries(config.params).map(([k, v]) => [k, String(v)]),
        ),
      )}`
    : path

  const init: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      ...(typeof body !== 'undefined' &&
        !(body instanceof FormData) && { 'Content-Type': 'application/json' }),
      ...config?.headers,
    },
    body: body !== undefined ? serializeBody(body) : undefined,
    cache: config?.cache,
    next: config?.next,
  }

  let res: Response
  try {
    res = await fetch(url, init)
  } catch {
    const error = new NetworkError()
    if (!config?.silent) toast.error(error.message)
    throw error
  }

  const { data, error } = await parseApiResponse<T>(res)
  if (error) {
    if (!config?.silent) toast.error(error.message)
    throw error
  }
  return data
}

export const routeApi = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>('GET', endpoint, undefined, config),

  post: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>('POST', endpoint, body, config),

  put: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>('PUT', endpoint, body, config),

  patch: <T>(endpoint: string, body?: unknown, config?: RequestConfig) =>
    request<T>('PATCH', endpoint, body, config),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>('DELETE', endpoint, undefined, config),
}
