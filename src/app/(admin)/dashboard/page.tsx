import { PageHeader } from "@/shared/components/PageHeader";
import { DashboardMetrics } from "@/featured/dashboard/components/DashboardMetrics";
import { DashboardCharts } from "@/featured/dashboard/components/DashboardCharts";
import { RecentActivity } from "@/featured/dashboard/components/RecentActivity";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="대시보드"
        description="Gamyeon 서비스의 핵심 지표를 한눈에 확인하세요."
      />

      <DashboardMetrics />

      <DashboardCharts />

      <RecentActivity />
    </div>
  );
}
