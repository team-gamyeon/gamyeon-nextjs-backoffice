import {
  hasOnlyKeys,
  isRecord,
  parseSafePathId,
  type ValidationResult,
} from '@/shared/lib/validation/actionInput'
import type {
  CreateQuestionRequest,
  QuestionListStatus,
  UpdateQuestionRequest,
} from '@/featured/questions/types'

const QUESTION_STATUSES = ['ACTIVE', 'INACTIVE'] as const satisfies readonly QuestionListStatus[]
const QUESTION_CREATE_FIELDS = ['content', 'status'] as const
const QUESTION_UPDATE_FIELDS = ['content', 'status'] as const
const MAX_QUESTION_CONTENT_LENGTH = 10_000

function isQuestionStatus(input: unknown): input is QuestionListStatus {
  return typeof input === 'string' && QUESTION_STATUSES.some((status) => status === input)
}

function parseQuestionContent(input: unknown): ValidationResult<string> {
  if (typeof input !== 'string') {
    return { success: false, error: '질문 내용은 문자열이어야 합니다.' }
  }

  const normalized = input.trim()
  if (normalized.length === 0) {
    return { success: false, error: '질문 내용은 비어 있을 수 없습니다.' }
  }

  if (normalized.length > MAX_QUESTION_CONTENT_LENGTH) {
    return {
      success: false,
      error: `질문 내용은 ${MAX_QUESTION_CONTENT_LENGTH.toLocaleString('ko-KR')}자 이하여야 합니다.`,
    }
  }

  return { success: true, data: normalized }
}

export function parseQuestionId(input: unknown): ValidationResult<string> {
  return parseSafePathId(input, '질문 ID')
}

export function parseCreateQuestionInput(input: unknown): ValidationResult<CreateQuestionRequest> {
  if (!(input instanceof FormData)) {
    return { success: false, error: '질문 생성 정보 형식이 올바르지 않습니다.' }
  }

  const entries = Array.from(input.keys())
  if (
    entries.some(
      (key) => !QUESTION_CREATE_FIELDS.includes(key as (typeof QUESTION_CREATE_FIELDS)[number]),
    ) ||
    input.getAll('content').length !== 1 ||
    input.getAll('status').length !== 1
  ) {
    return { success: false, error: '질문 생성 정보 형식이 올바르지 않습니다.' }
  }

  const content = parseQuestionContent(input.get('content'))
  if (!content.success) return content

  const status = input.get('status')
  if (!isQuestionStatus(status)) {
    return { success: false, error: '허용되지 않은 질문 상태입니다.' }
  }

  return { success: true, data: { content: content.data, status } }
}

export function parseUpdateQuestionInput(input: unknown): ValidationResult<UpdateQuestionRequest> {
  if (!isRecord(input) || !hasOnlyKeys(input, QUESTION_UPDATE_FIELDS)) {
    return { success: false, error: '질문 수정 정보 형식이 올바르지 않습니다.' }
  }

  const hasContent = Object.hasOwn(input, 'content')
  const hasStatus = Object.hasOwn(input, 'status')
  if (!hasContent && !hasStatus) {
    return { success: false, error: '수정할 질문 정보가 없습니다.' }
  }

  const result: UpdateQuestionRequest = {}
  if (hasContent) {
    const content = parseQuestionContent(input.content)
    if (!content.success) return content
    result.content = content.data
  }

  if (hasStatus) {
    if (!isQuestionStatus(input.status)) {
      return { success: false, error: '허용되지 않은 질문 상태입니다.' }
    }
    result.status = input.status
  }

  return { success: true, data: result }
}
