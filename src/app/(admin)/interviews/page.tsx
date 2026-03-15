import { PageHeader } from "@/shared/components/PageHeader";
import { InterviewsClient } from "@/featured/interviews/components/InterviewsClient";
import { getInterviewsAction } from "@/featured/interviews/actions/interviews.action";
import { mapApiInterviewToSession } from "@/shared/lib/utils/mappers";

export default async function InterviewsPage() {
  const result = await getInterviewsAction()
  const sessions = (result.data?.items ?? []).map(mapApiInterviewToSession)

  return (
    <div className="space-y-6">
      <PageHeader
        title="면접 관리"
        description="중단된 면접 세션을 조회하고 원인을 파악합니다."
      />
      <InterviewsClient initialSessions={sessions} />
    </div>
  );
}
