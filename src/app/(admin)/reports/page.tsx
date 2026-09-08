import { PageHeader } from '@/shared/components/PageHeader'
import { ReportsClient } from '@/featured/reports/components/ReportsClient'
import { getReportsAction } from '@/featured/reports/actions/reports.action'
import { REPORT_LIST_QUERY_CONFIG } from '@/featured/reports/constants'
import { mapApiReportToAnalysisReport } from '@/shared/lib/utils/mappers'
import { LIST_PAGE_SIZE, normalizeListSearchParams } from '@/shared/lib/validation/listQuery'
import type { GetReportsParams } from '@/featured/reports/types'
import type { ListSearchParams } from '@/shared/lib/validation/listQuery'

interface ReportsPageProps {
  searchParams: Promise<ListSearchParams>
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const query: GetReportsParams = normalizeListSearchParams(
    await searchParams,
    REPORT_LIST_QUERY_CONFIG,
  )

  const result = await getReportsAction(query)
  const reports = (result.data?.items ?? []).map(mapApiReportToAnalysisReport)
  const meta = {
    totalCount: result.data?.totalCount ?? 0,
    filteredCount: result.data?.filteredCount ?? 0,
    page: result.data?.page ?? query.page ?? 1,
    limit: result.data?.limit ?? query.limit ?? LIST_PAGE_SIZE,
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="리포트 관리"
        description="AI가 분석한 면접 리포트를 조회하고 분석 현황을 확인합니다."
      />
      <ReportsClient initialReports={reports} meta={meta} query={query} />
    </div>
  )
}
