import { PageHeader } from "@/shared/components/PageHeader";
import { InterviewsClient } from "@/featured/interviews/components/InterviewsClient";

export default function InterviewsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="면접 관리"
        description="중단된 면접 세션을 조회하고 원인을 파악합니다."
      />
      <InterviewsClient />
    </div>
  );
}
