import type { ActionResult } from '@/shared/types/action'
import type { PaginationMeta, PaginatedData } from '@/shared/types/pagination'

interface ListViewData<T> {
  items: T[]
  meta: PaginationMeta
  loadError: string | null
}

/**
 * ActionResult + query → { items, meta, loadError }로 정규화
 * API 실패를 "검색 결과가 없습니다"로 위장하지 않기 위해 사용
 *
 * @param result - Server Action 결과
 * @param fallbackMeta - API 실패 시 대체 메타 (보통 쿼리에서 나온 값)
 * @returns 정규화된 리스트 뷰 데이터
 */
export function toListView<T>(
  result: ActionResult<PaginatedData<T>>,
  fallbackMeta: Pick<PaginationMeta, 'page' | 'limit'>,
): ListViewData<T> {
  if (!result.success) {
    return {
      items: [],
      meta: {
        totalCount: 0,
        filteredCount: 0,
        page: fallbackMeta.page,
        limit: fallbackMeta.limit,
      },
      loadError: result.error,
    }
  }

  const data = result.data
  return {
    items: data.items,
    meta: {
      totalCount: data.totalCount,
      filteredCount: data.filteredCount,
      page: data.page ?? fallbackMeta.page,
      limit: data.limit ?? fallbackMeta.limit,
    },
    loadError: null,
  }
}
