import { PageHeader } from '@/shared/components/PageHeader'
import { NoticesClient } from '@/featured/notices/components/NoticesClient'
import { getNoticesAction } from '@/featured/notices/actions/notices.action'
import { NOTICE_LIST_QUERY_CONFIG } from '@/featured/notices/constants'
import { toListView } from '@/shared/lib/list/toListView'
import { LIST_PAGE_SIZE, normalizeListSearchParams } from '@/shared/lib/validation/listQuery'
import type { ListSearchParams } from '@/shared/lib/validation/listQuery'
import type { GetNoticesParams } from '@/featured/notices/types'

interface NoticesPageProps {
  searchParams: Promise<ListSearchParams>
}

export default async function NoticesPage({ searchParams }: NoticesPageProps) {
  const query: GetNoticesParams = normalizeListSearchParams(
    await searchParams,
    NOTICE_LIST_QUERY_CONFIG,
  )
  const result = await getNoticesAction(query)
  const view = toListView(result, { page: query.page ?? 1, limit: LIST_PAGE_SIZE })

  return (
    <div className="space-y-6">
      <PageHeader
        title="공지사항 관리"
        description="서비스 공지사항을 등록하고 활성화 상태를 관리합니다."
      />
      <NoticesClient
        initialNotices={view.items}
        meta={view.meta}
        query={query}
        hasLoadError={Boolean(view.loadError)}
      />
    </div>
  )
}
