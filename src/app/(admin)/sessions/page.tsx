import { PageHeader } from "@/shared/components/PageHeader";
import { SessionsClient } from "@/featured/sessions/components/SessionsClient";

export default function SessionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="면접 세션 관리"
        description="진행 중이거나 완료된 면접 세션을 관리합니다."
      />
      <SessionsClient />
    </div>
  );
}
