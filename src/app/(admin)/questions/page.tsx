import { PageHeader } from "@/shared/components/PageHeader";
import { QuestionsClient } from "@/featured/questions/components/QuestionsClient";
import { getQuestions } from "@/featured/questions/services/questions.service";
import { mapApiQuestionToCommon } from "@/shared/lib/utils/mappers";

export default async function QuestionsPage() {
  const result = await getQuestions();
  const initialQuestions = result?.items?.map(mapApiQuestionToCommon) ?? [];

  return (
    <div className="flex h-full flex-col gap-6">
      <PageHeader
        title="공통 질문 관리"
        description="면접에서 사용되는 공통 질문을 추가하고 관리합니다."
      />
      <QuestionsClient initialQuestions={initialQuestions} />
    </div>
  );
}
