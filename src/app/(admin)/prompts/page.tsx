import { PageHeader } from "@/shared/components/PageHeader";
import { PromptsClient } from "@/featured/prompts/components/PromptsClient";

export default function PromptsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="프롬프트 버전 관리"
        description="AI 면접에 사용되는 프롬프트의 버전을 관리하고 활성화합니다."
      />
      <PromptsClient />
    </div>
  );
}
