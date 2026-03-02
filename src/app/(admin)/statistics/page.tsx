import { PageHeader } from "@/shared/components/PageHeader";
import { StatisticsClient } from "@/featured/statistics/components/StatisticsClient";

export default function StatisticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="직군별 / 점수 분포 통계"
        description="직군별 면접 점수 분포와 주요 통계 지표를 확인합니다."
      />
      <StatisticsClient />
    </div>
  );
}
