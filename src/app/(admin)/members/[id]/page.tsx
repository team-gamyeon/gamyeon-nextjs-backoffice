import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { PageHeader } from "@/shared/components/PageHeader";
import { MemberDetailView } from "@/featured/members/components/MemberDetailView";

interface MemberDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MemberDetailPage({ params }: MemberDetailPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="gap-1">
          <Link href="/members">
            <ChevronLeft className="h-4 w-4" />
            회원 목록
          </Link>
        </Button>
      </div>

      <PageHeader
        title="회원 상세"
        description={`회원 ID: ${id}`}
      />

      <MemberDetailView memberId={id} />
    </div>
  );
}
