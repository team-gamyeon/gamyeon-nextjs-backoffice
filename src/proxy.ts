import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/login']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  const refreshToken = request.cookies.get('refreshToken')?.value

  if (isPublic) {
    if (refreshToken) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  if (!refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
