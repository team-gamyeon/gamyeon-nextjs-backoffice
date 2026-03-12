/**
 * Set-Cookie 헤더 배열에서 각 쿠키의 expires 값을 파싱해 Map으로 반환.
 * 예: ["accessToken=xxx; Expires=Thu, 01 Jan 2026 00:00:00 GMT; Path=/", ...]
 *     → Map { 'accessToken' => Date }
 */
export function parseSetCookieExpires(setCookieHeaders: string[]): Map<string, Date> {
  const result = new Map<string, Date>()

  for (const header of setCookieHeaders) {
    const parts = header.split(';').map((p) => p.trim())
    const namePart = parts[0]
    if (!namePart) continue

    const eqIdx = namePart.indexOf('=')
    if (eqIdx === -1) continue
    const cookieName = namePart.slice(0, eqIdx)

    for (const part of parts.slice(1)) {
      const lower = part.toLowerCase()
      if (lower.startsWith('expires=')) {
        const dateStr = part.slice('expires='.length)
        const date = new Date(dateStr)
        if (!isNaN(date.getTime())) {
          result.set(cookieName, date)
        }
        break
      }
    }
  }

  return result
}
