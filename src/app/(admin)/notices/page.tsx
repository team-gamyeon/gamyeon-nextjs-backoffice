import { PageHeader } from "@/shared/components/PageHeader";
import { NoticesClient } from "@/featured/notices/components/NoticesClient";

export default function NoticesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="공지사항 관리"
        description="서비스 공지사항을 등록하고 활성화 상태를 관리합니다."
      />
      <NoticesClient />
    </div>
  );
}
