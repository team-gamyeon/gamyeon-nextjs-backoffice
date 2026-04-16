import { PageHeader } from "@/shared/components/PageHeader";
import { MembersClient } from "@/featured/members/components/MembersClient";
import { getUsers } from "@/featured/members/services/members.service";
import { mapApiUserToMember } from "@/shared/lib/utils/mappers";

export default async function MembersPage() {
  const result = await getUsers();
  const members = result?.items?.map(mapApiUserToMember) ?? [];

  return (
    <div className="flex h-full flex-col gap-6">
      <PageHeader
        title="유저 관리"
        description="가입된 유저 목록을 조회하고 상세 정보를 확인합니다."
      />
      <MembersClient initialMembers={members} />
    </div>
  );
}
