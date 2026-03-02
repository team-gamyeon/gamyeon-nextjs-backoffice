import { PageHeader } from "@/shared/components/PageHeader";
import { AnomalyClient } from "@/featured/anomaly/components/AnomalyClient";

export default function AnomalyPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="이상 세션 감지"
        description="비정상적인 패턴이 감지된 면접 세션을 모니터링하고 조치합니다."
      />
      <AnomalyClient />
    </div>
  );
}
