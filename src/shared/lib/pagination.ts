import type { PaginationMeta } from '@/shared/types/pagination'

export function toPaginationMeta(data: PaginationMeta): PaginationMeta {
  return {
    totalCount: data.totalCount,
    filteredCount: data.filteredCount,
    page: data.page,
    limit: data.limit,
  }
}

export function hasNextPage(meta: PaginationMeta, receivedItemCount?: number): boolean {
  return (
    (receivedItemCount === undefined || receivedItemCount > 0) &&
    meta.page * meta.limit < meta.filteredCount
  )
}

export function mergeUniqueBy<T>(
  current: readonly T[],
  incoming: readonly T[],
  getKey: (item: T) => PropertyKey,
): T[] {
  const itemsByKey = new Map(current.map((item) => [getKey(item), item]))
  for (const item of incoming) itemsByKey.set(getKey(item), item)
  return Array.from(itemsByKey.values())
}
