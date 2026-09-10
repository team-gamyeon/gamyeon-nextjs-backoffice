import { parseSafePathId, type ValidationResult } from '@/shared/lib/validation/actionInput'

export function parseReportId(input: unknown): ValidationResult<string> {
  return parseSafePathId(input, '리포트 ID')
}
