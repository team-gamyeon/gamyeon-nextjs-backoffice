import { PageHeader } from "@/shared/components/PageHeader";
import { QuestionsClient } from "@/featured/questions/components/QuestionsClient";

export default function QuestionsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="공통 질문 관리"
        description="면접에서 사용되는 공통 질문을 추가하고 관리합니다."
      />
      <QuestionsClient />
    </div>
  );
}
