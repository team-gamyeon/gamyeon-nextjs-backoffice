import { QuestionsClient } from '@/featured/questions/components/QuestionsClient'
import { getQuestionsAction } from '@/featured/questions/actions/questions.action'
import { QUESTION_LIST_QUERY_CONFIG } from '@/featured/questions/constants'
import { LIST_PAGE_SIZE, normalizeListSearchParams } from '@/shared/lib/validation/listQuery'
import { toListView } from '@/shared/lib/list/toListView'
import type { QuestionListQuery } from '@/featured/questions/types'
import { PageHeader } from '@/shared/components/PageHeader'
import type { ListSearchParams } from '@/shared/lib/validation/listQuery'

interface QuestionsPageProps {
  searchParams: Promise<ListSearchParams>
}

export default async function QuestionsPage({ searchParams }: QuestionsPageProps) {
  const query: QuestionListQuery = normalizeListSearchParams(
    await searchParams,
    QUESTION_LIST_QUERY_CONFIG,
  )
  const result = await getQuestionsAction(query)
  const view = toListView(result, { page: query.page ?? 1, limit: LIST_PAGE_SIZE })

  return (
    <div className="space-y-6">
      <PageHeader
        title="공통 질문 관리"
        description="면접에서 사용되는 공통 질문을 추가하고 관리합니다."
      />
      <QuestionsClient
        questions={view.items}
        pagination={view.meta}
        query={query}
        hasLoadError={view.loadError !== null}
      />
    </div>
  )
}
