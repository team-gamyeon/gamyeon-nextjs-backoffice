import { PageHeader } from '@/shared/components/PageHeader'
import { ReportsClient } from '@/featured/reports/components/ReportsClient'
import { getReportsAction } from '@/featured/reports/actions/reports.action'
import { REPORT_LIST_QUERY_CONFIG } from '@/featured/reports/constants'
import { mapApiReportToAnalysisReport } from '@/shared/lib/utils/mappers'
import { LIST_PAGE_SIZE, normalizeListSearchParams } from '@/shared/lib/validation/listQuery'
import { toListView } from '@/shared/lib/list/toListView'
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
  const view = toListView(result, { page: query.page ?? 1, limit: LIST_PAGE_SIZE })
  const reports = view.items.map(mapApiReportToAnalysisReport)

  return (
    <div className="space-y-6">
      <PageHeader
        title="리포트 관리"
        description="AI가 분석한 면접 리포트를 조회하고 분석 현황을 확인합니다."
      />
      <ReportsClient
        initialReports={reports}
        meta={view.meta}
        query={query}
        hasLoadError={view.loadError !== null}
      />
    </div>
  )
}
