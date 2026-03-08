import { PageHeader } from "@/shared/components/PageHeader";
import { MembersClient } from "@/featured/members/components/MembersClient";

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="유저 관리"
        description="가입된 유저 목록을 조회하고 상세 정보를 확인합니다."
      />
      <MembersClient />
    </div>
  );
}
