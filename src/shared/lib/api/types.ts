/** 서버 공통 응답 래퍼 — success, data 필수 */
export interface ApiResponse<T> {
  success: boolean
  data: T | null
}

/** API 에러 — 서버 raw body 전체를 보존 */
export class ApiError extends Error {
  readonly status: number
  readonly raw: Record<string, unknown>

  constructor(status: number, raw: Record<string, unknown>) {
    const errorObj = raw['error'] as Record<string, unknown> | undefined
    const message =
      typeof raw['message'] === 'string'
        ? raw['message']
        : typeof errorObj?.['message'] === 'string'
          ? errorObj['message']
          : '오류가 발생했습니다.'
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.raw = raw
  }
}

/** 서버 응답 없이 네트워크 자체가 실패한 경우 */
export class NetworkError extends Error {
  readonly status = 0

  constructor() {
    super('네트워크 오류가 발생했습니다.')
    this.name = 'NetworkError'
  }
}

export type ApiResult<T> = { data: T | null; error: null } | { data: null; error: ApiError }

export interface RequestConfig {
  /** true이면 에러 toast를 띄우지 않음 */
  silent?: boolean
  /** URL 쿼리 파라미터 */
  params?: Record<string, string | number | boolean>
  headers?: Record<string, string>
  cache?: RequestCache
  next?: NextFetchRequestConfig
}
