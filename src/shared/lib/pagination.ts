import type { PaginationMeta } from '@/shared/types/pagination'

export function hasNextPage(meta: PaginationMeta, receivedItemCount: number): boolean {
  // 빈 응답(no items received)이면 진전이 없으므로 마지막 페이지
  if (receivedItemCount === 0) return false

  // 페이지 * limit >= filteredCount면 마지막 페이지
  return meta.page * meta.limit < meta.filteredCount
}

/**
 * 다음 페이지를 불러온 직후의 hasMore 판정.
 *
 * hasNextPage만으로는 무한 루프를 막을 수 없다. 서버가 요청한 page를 무시하고
 * 같은 페이지를 계속 돌려주면 receivedItemCount는 매번 0보다 크고 meta.page도
 * 그대로라서 조건이 영원히 참으로 남는다. 그래서 "페이지가 실제로 진전했는가"를
 * 함께 본다. page/limit이 응답에 없어 NaN이 되는 경우도 두 비교 모두 false가 되어
 * 안전하게 멈춘다.
 */
export function hasNextPageAfterLoad(
  previousPage: number,
  nextMeta: PaginationMeta,
  receivedItemCount: number,
): boolean {
  if (!(nextMeta.page > previousPage)) return false
  return hasNextPage(nextMeta, receivedItemCount)
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
