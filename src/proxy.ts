import { NextRequest, NextResponse } from 'next/server'
import { LOGIN_PATH, SESSION_EXPIRED_PARAM } from '@/shared/constants/auth'

const PUBLIC_PATHS = [LOGIN_PATH]

/**
 * 세션 만료로 서버가 되돌려보낸 요청. 죽은 토큰을 지우고 로그인 화면을 그대로 보여준다.
 *
 * 쿠키를 여기서 지우는 이유: RSC 렌더 중에는 쿠키를 수정할 수 없어 serverApi가 직접 지우지 못한다.
 * 지우지 않으면 아래 "이미 로그인됨" 분기가 다시 '/'로 튕겨 무한 루프가 된다.
 */
function clearExpiredSession() {
  const response = NextResponse.next()
  response.cookies.delete('accessToken')
  response.cookies.delete('refreshToken')
  return response
}

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  const refreshToken = request.cookies.get('refreshToken')?.value

  if (isPublic) {
    if (searchParams.has(SESSION_EXPIRED_PARAM)) {
      return clearExpiredSession()
    }
    if (refreshToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  if (!refreshToken) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
