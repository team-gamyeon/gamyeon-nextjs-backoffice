import { NOTICE_LIST_QUERY_CONFIG } from '@/featured/notices/constants'
import type { GetNoticesParams, NoticeStatus } from '@/featured/notices/types'

export type NoticeListTab = 'all' | 'active' | 'inactive'

const STATUS_BY_TAB: Record<Exclude<NoticeListTab, 'all'>, NoticeStatus> = {
  active: 'ACTIVE',
  inactive: 'INACTIVE',
}

export function buildNoticeListQuery(
  search: string,
  tab: NoticeListTab,
  page: number,
): GetNoticesParams {
  return {
    search: search.trim() || undefined,
    status: tab === 'all' ? undefined : STATUS_BY_TAB[tab],
    sortBy: NOTICE_LIST_QUERY_CONFIG.defaultSortBy,
    sortOrder: NOTICE_LIST_QUERY_CONFIG.defaultSortOrder,
    page,
  }
}
