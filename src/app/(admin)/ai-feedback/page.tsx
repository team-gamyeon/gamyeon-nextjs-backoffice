import { PageHeader } from "@/shared/components/PageHeader";
import { AiFeedbackClient } from "@/featured/ai-feedback/components/AiFeedbackClient";

export default function AiFeedbackPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI 피드백 품질 조회"
        description="AI가 생성한 면접 피드백의 품질 지표를 모니터링합니다."
      />
      <AiFeedbackClient />
    </div>
  );
}
