import { PageHeader } from '@/shared/components/PageHeader'
import { NoticesClient } from '@/featured/notices/components/NoticesClient'
import { getNoticesAction } from '@/featured/notices/actions/notices.action'
import { LIST_PAGE_SIZE } from '@/shared/lib/validation/listQuery'
import type { NoticeListData } from '@/featured/notices/types'

export default async function NoticesPage() {
  const result = await getNoticesAction()
  const initialData: NoticeListData = result.data ?? {
    totalCount: 0,
    filteredCount: 0,
    page: 1,
    limit: LIST_PAGE_SIZE,
    items: [],
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="공지사항 관리"
        description="서비스 공지사항을 등록하고 활성화 상태를 관리합니다."
      />
      <NoticesClient initialData={initialData} />
    </div>
  )
}
