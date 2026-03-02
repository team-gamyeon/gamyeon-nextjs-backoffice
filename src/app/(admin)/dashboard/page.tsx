import { PageHeader } from "@/shared/components/PageHeader";
import { DashboardMetrics } from "@/featured/dashboard/components/DashboardMetrics";
import { DauChart } from "@/featured/dashboard/components/DauChart";
import { CompletionRateCard } from "@/featured/dashboard/components/CompletionRateCard";
import { RecentActivity } from "@/featured/dashboard/components/RecentActivity";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="대시보드"
        description="InterviewAI 서비스의 핵심 지표를 한눈에 확인하세요."
      />

      <DashboardMetrics />

      <div className="grid grid-cols-3 gap-4">
        <DauChart />
        <CompletionRateCard />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          {/* Placeholder for future chart */}
          <div className="h-full rounded-lg border border-dashed border-border/60 p-6 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              추가 차트 (2차 개발 예정)
            </p>
          </div>
        </div>
        <RecentActivity />
      </div>
    </div>
  );
}
