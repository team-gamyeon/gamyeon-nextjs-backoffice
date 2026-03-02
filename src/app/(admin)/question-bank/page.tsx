import { PageHeader } from "@/shared/components/PageHeader";
import { QuestionBankClient } from "@/featured/question-bank/components/QuestionBankClient";

export default function QuestionBankPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="질문 뱅크 관리"
        description="RAG 연동을 위한 질문 풀을 관리하고 임베딩 상태를 확인합니다."
      />
      <QuestionBankClient />
    </div>
  );
}
