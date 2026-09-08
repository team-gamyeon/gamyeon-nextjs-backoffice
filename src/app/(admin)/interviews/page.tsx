import { PageHeader } from '@/shared/components/PageHeader'
import { InterviewsClient } from '@/featured/interviews/components/InterviewsClient'
import { getInterviewsAction } from '@/featured/interviews/actions/interviews.action'
import { INTERVIEW_LIST_QUERY_CONFIG } from '@/featured/interviews/constants'
import { mapApiInterviewToSession } from '@/featured/interviews/utils/mapApiInterviewToSession'
import { LIST_PAGE_SIZE, normalizeListSearchParams } from '@/shared/lib/validation/listQuery'
import { toListView } from '@/shared/lib/list/toListView'
import type { InterviewListQuery } from '@/featured/interviews/types'
import type { ListSearchParams } from '@/shared/lib/validation/listQuery'

interface InterviewsPageProps {
  searchParams: Promise<ListSearchParams>
}

export default async function InterviewsPage({ searchParams }: InterviewsPageProps) {
  const query: InterviewListQuery = normalizeListSearchParams(
    await searchParams,
    INTERVIEW_LIST_QUERY_CONFIG,
  )
  const result = await getInterviewsAction(query)
  const view = toListView(result, { page: query.page, limit: LIST_PAGE_SIZE })
  const sessions = view.items.map(mapApiInterviewToSession)

  return (
    <div className="space-y-6">
      <PageHeader
        title="면접 관리"
        description="면접 세션을 조회하고 진행 상태와 소요 시간을 확인합니다."
      />
      <InterviewsClient
        initialSessions={sessions}
        meta={view.meta}
        query={query}
        hasLoadError={view.loadError !== null}
      />
    </div>
  )
}
