export type SortOrder = 'asc' | 'desc'

export interface PaginationMeta {
  totalCount: number
  filteredCount: number
  page: number
  limit: number
}

export interface PaginatedData<T> extends PaginationMeta {
  items: T[]
}

// 목록 조회 요청의 입력 형태.
// limit은 서버가 소유한다 — parseListQuery가 항상 LIST_PAGE_SIZE로 덮어쓰므로
// 클라이언트가 보내는 limit은 무시된다. 그래서 입력 타입에 두지 않는다.
export interface ListQueryParams {
  page?: number
  search?: string
  sortOrder?: SortOrder
}
