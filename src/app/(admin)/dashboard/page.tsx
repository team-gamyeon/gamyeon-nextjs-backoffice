import { PageHeader } from "@/shared/components/PageHeader";
import { DashboardMetrics } from "@/featured/dashboard/components/DashboardMetrics";
import { DashboardCharts } from "@/featured/dashboard/components/DashboardCharts";
import { RecentActivity } from "@/featured/dashboard/components/RecentActivity";
import { getDashboardSummary } from "@/featured/dashboard/service";

export default async function DashboardPage() {
  const summary = await getDashboardSummary();

  return (
    <div className="space-y-6">
      <PageHeader
        title="대시보드"
        description="Gamyeon 서비스의 핵심 지표를 한눈에 확인하세요."
      />

      <DashboardMetrics kpi={summary?.kpi} />

      <DashboardCharts
        signupTrend={summary?.signupTrend}
        intvCompletion={summary?.interviewCompletion}
        reportAnalysis={summary?.reportAnalysis}
      />

      <RecentActivity items={summary?.recentActivities?.items ?? []} />
    </div>
  );
}
