export type ValidationResult<T> = { success: true; data: T } | { success: false; error: string }

export const MAX_PATH_ID_LENGTH = 128

export function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input)
}

export function hasOnlyKeys(
  input: Record<string, unknown>,
  allowedKeys: readonly string[],
): boolean {
  const allowed = new Set(allowedKeys)
  return Object.keys(input).every((key) => allowed.has(key))
}

/**
 * 동적 URL path segment로 사용할 문자열 ID를 검증한다.
 *
 * ID 규격이 도메인에 명시되어 있지 않으므로 UUID/숫자/slug에서 공통으로 안전한
 * 문자만 허용한다. slash, backslash, percent-encoding, query/hash 구분자를 원천 차단해
 * URL 정규화나 이중 디코딩으로 다른 API 경로를 가리키지 못하게 한다.
 */
export function parseSafePathId(input: unknown, label: string): ValidationResult<string> {
  if (typeof input !== 'string' || input.length === 0) {
    return { success: false, error: `${label} 형식이 올바르지 않습니다.` }
  }

  if (input.length > MAX_PATH_ID_LENGTH) {
    return { success: false, error: `${label}는 ${MAX_PATH_ID_LENGTH}자 이하여야 합니다.` }
  }

  if (!/^[A-Za-z0-9_-]+$/.test(input)) {
    return { success: false, error: `${label} 형식이 올바르지 않습니다.` }
  }

  return { success: true, data: input }
}

export function parsePositiveIntegerId(input: unknown, label: string): ValidationResult<number> {
  if (typeof input !== 'number' || !Number.isSafeInteger(input) || input <= 0) {
    return { success: false, error: `${label} 형식이 올바르지 않습니다.` }
  }

  return { success: true, data: input }
}
