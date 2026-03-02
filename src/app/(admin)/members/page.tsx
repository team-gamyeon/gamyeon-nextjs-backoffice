import { PageHeader } from "@/shared/components/PageHeader";
import { MembersClient } from "@/featured/members/components/MembersClient";

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="회원 관리"
        description="가입된 회원 목록을 조회하고 제재를 관리합니다."
      />
      <MembersClient />
    </div>
  );
}
