import { PageHeader } from '@/shared/components/PageHeader'
import { InterviewsClient } from '@/featured/interviews/components/InterviewsClient'
import { getInterviewsAction } from '@/featured/interviews/actions/interviews.action'
import { INTERVIEW_LIST_QUERY_CONFIG } from '@/featured/interviews/constants'
import { mapApiInterviewToSession } from '@/featured/interviews/utils/mapApiInterviewToSession'
import { normalizeListSearchParams } from '@/shared/lib/validation/listQuery'
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
  const data = result.data
  const sessions = (data?.items ?? []).map(mapApiInterviewToSession)
  const meta = {
    totalCount: data?.totalCount ?? 0,
    filteredCount: data?.filteredCount ?? 0,
    page: data?.page ?? query.page,
    limit: data?.limit ?? query.limit,
  }
  return (
    <div className="space-y-6">
      <PageHeader
        title="면접 관리"
        description="면접 세션을 조회하고 진행 상태와 소요 시간을 확인합니다."
      />
      <InterviewsClient initialSessions={sessions} meta={meta} query={query} />
    </div>
  )
}
