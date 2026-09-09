import { unstable_rethrow } from 'next/navigation'
import type { ActionResult } from '@/shared/types/action'

/**
 * Server Action의 유일한 에러 처리 지점.
 *
 * 계층마다 try/catch를 두면 두 가지가 무너진다.
 * 1. redirect() 같은 Next 제어 흐름 예외를 중간에서 삼켜버린다.
 *    (세션 만료 시 serverApi가 보내는 리다이렉트가 막히면 로그인으로 돌아갈 길이 없다)
 * 2. 백엔드 응답의 message를 그대로 브라우저에 흘려보낸다.
 *
 * 그래서 상세 원인은 서버 로그에만 남기고, 브라우저에는 고정 문구만 내려보낸다.
 */
export async function toActionResult<T>(
  run: () => Promise<T>,
  failureMessage: string,
): Promise<ActionResult<T>> {
  try {
    return { success: true, data: await run() }
  } catch (error) {
    unstable_rethrow(error)
    console.error(`[action] ${failureMessage}`, error)
    return { success: false, error: failureMessage }
  }
}
