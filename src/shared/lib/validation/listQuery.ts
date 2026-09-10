import type { SortOrder } from '@/shared/types/pagination'

export const LIST_PAGE_SIZE = 20
export const MAX_LIST_PAGE = 100_000
export const MAX_LIST_SEARCH_LENGTH = 100

export interface ListQueryConfig<TStatus extends string, TSortBy extends string> {
  statuses: readonly TStatus[]
  sortFields: readonly TSortBy[]
  defaultSortBy: TSortBy
  defaultSortOrder?: SortOrder
  includeDateRange?: boolean
}

export type ListSearchParams = Record<string, string | string[] | undefined>

export interface SafeListQuery<TStatus extends string, TSortBy extends string> {
  page: number
  limit: number
  search?: string
  status?: TStatus
  sortBy: TSortBy
  sortOrder: SortOrder
  from?: string
  to?: string
}

export type ListQueryParseResult<TStatus extends string, TSortBy extends string> =
  | { success: true; data: SafeListQuery<TStatus, TSortBy> }
  | { success: false; error: string }

function hasOwn(value: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(value, key)
}

function isAllowedValue<T extends string>(value: unknown, allowed: readonly T[]): value is T {
  return typeof value === 'string' && allowed.some((candidate) => candidate === value)
}

export function isValidListDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (year < 1 || month < 1 || month > 12 || day < 1) return false

  const daysInMonth = [
    31,
    year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ]

  return day <= daysInMonth[month - 1]
}

function parseOptionalDate(
  input: Record<string, unknown>,
  key: 'from' | 'to',
): { success: true; value?: string } | { success: false; error: string } {
  if (!hasOwn(input, key) || input[key] === undefined || input[key] === '') {
    return { success: true }
  }

  const value = input[key]
  if (typeof value !== 'string' || !isValidListDate(value)) {
    return { success: false, error: `${key}은 YYYY-MM-DD 형식의 실제 날짜여야 합니다.` }
  }

  return { success: true, value }
}

export function parseListQuery<TStatus extends string, TSortBy extends string>(
  input: unknown,
  options: ListQueryConfig<TStatus, TSortBy>,
): ListQueryParseResult<TStatus, TSortBy> {
  if (
    input !== undefined &&
    (typeof input !== 'object' || input === null || Array.isArray(input))
  ) {
    return { success: false, error: '목록 조회 조건은 객체여야 합니다.' }
  }

  const query = (input ?? {}) as Record<string, unknown>

  const page = query.page ?? 1
  if (typeof page !== 'number' || !Number.isSafeInteger(page) || page < 1 || page > MAX_LIST_PAGE) {
    return { success: false, error: `page는 1 이상 ${MAX_LIST_PAGE} 이하의 정수여야 합니다.` }
  }

  let search: string | undefined
  if (hasOwn(query, 'search') && query.search !== undefined) {
    if (typeof query.search !== 'string') {
      return { success: false, error: 'search는 문자열이어야 합니다.' }
    }

    const normalizedSearch = query.search.trim()
    if (normalizedSearch.length > MAX_LIST_SEARCH_LENGTH) {
      return {
        success: false,
        error: `search는 ${MAX_LIST_SEARCH_LENGTH}자 이하여야 합니다.`,
      }
    }
    search = normalizedSearch || undefined
  }

  let status: TStatus | undefined
  if (hasOwn(query, 'status') && query.status !== undefined && query.status !== '') {
    if (!isAllowedValue(query.status, options.statuses)) {
      return { success: false, error: '허용되지 않은 status입니다.' }
    }
    status = query.status
  }

  const sortBy = query.sortBy ?? options.defaultSortBy
  if (!isAllowedValue(sortBy, options.sortFields)) {
    return { success: false, error: '허용되지 않은 sortBy입니다.' }
  }

  const sortOrder = query.sortOrder ?? options.defaultSortOrder ?? 'desc'
  if (sortOrder !== 'asc' && sortOrder !== 'desc') {
    return { success: false, error: 'sortOrder는 asc 또는 desc여야 합니다.' }
  }

  const data: SafeListQuery<TStatus, TSortBy> = {
    page,
    limit: LIST_PAGE_SIZE,
    search,
    status,
    sortBy,
    sortOrder,
  }

  if (options.includeDateRange) {
    const from = parseOptionalDate(query, 'from')
    if (!from.success) return from

    const to = parseOptionalDate(query, 'to')
    if (!to.success) return to

    if (from.value && to.value && from.value > to.value) {
      return { success: false, error: 'from은 to보다 늦을 수 없습니다.' }
    }

    data.from = from.value
    data.to = to.value
  }

  return { success: true, data }
}

function firstSearchParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export function normalizeListSearchParams<TStatus extends string, TSortBy extends string>(
  input: ListSearchParams,
  config: ListQueryConfig<TStatus, TSortBy>,
): SafeListQuery<TStatus, TSortBy> {
  const rawSearch = firstSearchParam(input.search)?.trim()
  const rawStatus = firstSearchParam(input.status)
  const rawSortBy = firstSearchParam(input.sortBy)
  const rawSortOrder = firstSearchParam(input.sortOrder)
  const rawFrom = config.includeDateRange ? firstSearchParam(input.from) : undefined
  const rawTo = config.includeDateRange ? firstSearchParam(input.to) : undefined

  const from = rawFrom && isValidListDate(rawFrom) ? rawFrom : undefined
  const to = rawTo && isValidListDate(rawTo) ? rawTo : undefined
  const hasValidDateRange = !from || !to || from <= to

  return {
    page: 1,
    limit: LIST_PAGE_SIZE,
    search: rawSearch && rawSearch.length <= MAX_LIST_SEARCH_LENGTH ? rawSearch : undefined,
    status: isAllowedValue(rawStatus, config.statuses) ? rawStatus : undefined,
    sortBy: isAllowedValue(rawSortBy, config.sortFields) ? rawSortBy : config.defaultSortBy,
    sortOrder:
      rawSortOrder === 'asc' || rawSortOrder === 'desc'
        ? rawSortOrder
        : (config.defaultSortOrder ?? 'desc'),
    from: hasValidDateRange ? from : undefined,
    to: hasValidDateRange ? to : undefined,
  }
}
