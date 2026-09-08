import { QuestionsClient } from '@/featured/questions/components/QuestionsClient'
import { getQuestionsAction } from '@/featured/questions/actions/questions.action'
import { QUESTION_LIST_QUERY_CONFIG } from '@/featured/questions/constants'
import type { QuestionListQuery } from '@/featured/questions/types'
import { PageHeader } from '@/shared/components/PageHeader'
import { LIST_PAGE_SIZE, normalizeListSearchParams } from '@/shared/lib/validation/listQuery'
import type { ListSearchParams } from '@/shared/lib/validation/listQuery'
import type { PaginationMeta } from '@/shared/types/pagination'

interface QuestionsPageProps {
  searchParams: Promise<ListSearchParams>
}

export default async function QuestionsPage({ searchParams }: QuestionsPageProps) {
  const query: QuestionListQuery = normalizeListSearchParams(
    await searchParams,
    QUESTION_LIST_QUERY_CONFIG,
  )
  const result = await getQuestionsAction(query)
  const data = result.success ? result.data : undefined
  const questions = data?.items ?? []
  const pagination: PaginationMeta = {
    totalCount: data?.totalCount ?? 0,
    filteredCount: data?.filteredCount ?? 0,
    page: data?.page ?? query.page ?? 1,
    limit: data?.limit ?? query.limit ?? LIST_PAGE_SIZE,
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="공통 질문 관리"
        description="면접에서 사용되는 공통 질문을 추가하고 관리합니다."
      />
      <QuestionsClient
        questions={questions}
        pagination={pagination}
        query={query}
        hasLoadError={!result.success}
      />
    </div>
  )
}
