import { PageHeader } from "@/shared/components/PageHeader";
import { SttMonitoringClient } from "@/featured/stt-monitoring/components/SttMonitoringClient";

export default function SttMonitoringPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="STT 오류율 모니터링"
        description="음성-텍스트 변환의 오류율을 세션별로 추적하고 품질 이슈를 파악합니다."
      />
      <SttMonitoringClient />
    </div>
  );
}
