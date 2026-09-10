import {
  hasOnlyKeys,
  isRecord,
  parsePositiveIntegerId,
  type ValidationResult,
} from '@/shared/lib/validation/actionInput'
import type {
  CreateNoticeRequest,
  NoticeCategory,
  NoticeStatus,
  UpdateNoticeRequest,
} from '@/featured/notices/types'

const NOTICE_CATEGORIES = [
  'NOTICE',
  'UPDATE',
  'GUIDE',
  'EVENT',
  'MAINTENANCE',
] as const satisfies readonly NoticeCategory[]
const NOTICE_STATUSES = ['ACTIVE', 'INACTIVE'] as const satisfies readonly NoticeStatus[]
const NOTICE_CREATE_FIELDS = ['title', 'content', 'category'] as const
const NOTICE_UPDATE_FIELDS = ['title', 'content', 'status', 'category'] as const
const MAX_NOTICE_TITLE_LENGTH = 200
const MAX_NOTICE_CONTENT_LENGTH = 10_000

function isNoticeCategory(input: unknown): input is NoticeCategory {
  return typeof input === 'string' && NOTICE_CATEGORIES.some((category) => category === input)
}

function isNoticeStatus(input: unknown): input is NoticeStatus {
  return typeof input === 'string' && NOTICE_STATUSES.some((status) => status === input)
}

function parseTitle(input: unknown): ValidationResult<string> {
  if (typeof input !== 'string') {
    return { success: false, error: '공지사항 제목은 문자열이어야 합니다.' }
  }

  const normalized = input.trim()
  if (normalized.length === 0) {
    return { success: false, error: '공지사항 제목은 비어 있을 수 없습니다.' }
  }

  if (normalized.length > MAX_NOTICE_TITLE_LENGTH) {
    return {
      success: false,
      error: `공지사항 제목은 ${MAX_NOTICE_TITLE_LENGTH}자 이하여야 합니다.`,
    }
  }

  return { success: true, data: normalized }
}

function parseContent(input: unknown): ValidationResult<string> {
  if (typeof input !== 'string') {
    return { success: false, error: '공지사항 내용은 문자열이어야 합니다.' }
  }

  const normalized = input.trim()
  if (normalized.length > MAX_NOTICE_CONTENT_LENGTH) {
    return {
      success: false,
      error: `공지사항 내용은 ${MAX_NOTICE_CONTENT_LENGTH.toLocaleString('ko-KR')}자 이하여야 합니다.`,
    }
  }

  return { success: true, data: normalized }
}

export function parseNoticeId(input: unknown): ValidationResult<number> {
  return parsePositiveIntegerId(input, '공지사항 ID')
}

export function parseCreateNoticeInput(input: unknown): ValidationResult<CreateNoticeRequest> {
  if (!isRecord(input) || !hasOnlyKeys(input, NOTICE_CREATE_FIELDS)) {
    return { success: false, error: '공지사항 생성 정보 형식이 올바르지 않습니다.' }
  }

  const title = parseTitle(input.title)
  if (!title.success) return title

  const content = parseContent(input.content)
  if (!content.success) return content

  if (!isNoticeCategory(input.category)) {
    return { success: false, error: '허용되지 않은 공지사항 카테고리입니다.' }
  }

  return {
    success: true,
    data: { title: title.data, content: content.data, category: input.category },
  }
}

export function parseUpdateNoticeInput(input: unknown): ValidationResult<UpdateNoticeRequest> {
  if (!isRecord(input) || !hasOnlyKeys(input, NOTICE_UPDATE_FIELDS)) {
    return { success: false, error: '공지사항 수정 정보 형식이 올바르지 않습니다.' }
  }

  const hasTitle = Object.hasOwn(input, 'title')
  const hasContent = Object.hasOwn(input, 'content')
  const hasStatus = Object.hasOwn(input, 'status')
  const hasCategory = Object.hasOwn(input, 'category')
  if (!hasTitle && !hasContent && !hasStatus && !hasCategory) {
    return { success: false, error: '수정할 공지사항 정보가 없습니다.' }
  }

  const result: UpdateNoticeRequest = {}
  if (hasTitle) {
    const title = parseTitle(input.title)
    if (!title.success) return title
    result.title = title.data
  }

  if (hasContent) {
    const content = parseContent(input.content)
    if (!content.success) return content
    result.content = content.data
  }

  if (hasStatus) {
    if (!isNoticeStatus(input.status)) {
      return { success: false, error: '허용되지 않은 공지사항 상태입니다.' }
    }
    result.status = input.status
  }

  if (hasCategory) {
    if (!isNoticeCategory(input.category)) {
      return { success: false, error: '허용되지 않은 공지사항 카테고리입니다.' }
    }
    result.category = input.category
  }

  return { success: true, data: result }
}
