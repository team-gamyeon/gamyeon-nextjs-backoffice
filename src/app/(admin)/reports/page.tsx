import { PageHeader } from "@/shared/components/PageHeader";
import { ReportsClient } from "@/featured/reports/components/ReportsClient";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="리포트 관리"
        description="AI가 분석한 면접 리포트를 조회하고 분석 현황을 확인합니다."
      />
      <ReportsClient />
    </div>
  );
}
