import { NextResponse } from 'next/server'
import { unstable_rethrow } from 'next/navigation'

const SERVER_ERROR_STATUS = 500

/**
 * 에러에서 응답에 쓸 HTTP 상태를 고른다.
 * NetworkError는 status가 0이라 그대로 쓰면 NextResponse가 거부한다.
 */
function toHttpStatus(error: unknown): number {
  if (typeof error !== 'object' || error === null) return SERVER_ERROR_STATUS

  const status = (error as { status?: unknown }).status
  if (typeof status === 'number' && status >= 400 && status <= 599) return status

  return SERVER_ERROR_STATUS
}

/**
 * Route Handler의 유일한 에러 처리 지점. 규칙은 toActionResult와 같다.
 * 상세 원인은 서버 로그에만 남기고, 응답에는 고정 문구만 담는다.
 */
export async function toRouteResponse<T>(
  run: () => Promise<T>,
  failureMessage: string,
): Promise<NextResponse> {
  try {
    return NextResponse.json({ success: true, data: await run() })
  } catch (error) {
    unstable_rethrow(error)
    console.error(`[route] ${failureMessage}`, error)
    return NextResponse.json(
      { success: false, message: failureMessage },
      { status: toHttpStatus(error) },
    )
  }
}
