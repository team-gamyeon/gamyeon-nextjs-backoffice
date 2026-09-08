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

export interface ListQueryParams {
  page?: number
  limit?: number
  search?: string
  sortOrder?: SortOrder
}
