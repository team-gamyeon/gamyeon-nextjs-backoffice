import { PageHeader } from '@/shared/components/PageHeader'
import { MembersClient } from '@/featured/members/components/MembersClient'
import { getMembersPageAction } from '@/featured/members/actions/members.action'
import { MEMBER_LIST_QUERY_CONFIG } from '@/featured/members/constants'
import { LIST_PAGE_SIZE, normalizeListSearchParams } from '@/shared/lib/validation/listQuery'
import type { MemberListQuery } from '@/featured/members/types'
import type { ListSearchParams } from '@/shared/lib/validation/listQuery'
import type { PaginationMeta } from '@/shared/types/pagination'

type MembersPageProps = {
  searchParams: Promise<ListSearchParams>
}

export default async function MembersPage({ searchParams }: MembersPageProps) {
  const query: MemberListQuery = normalizeListSearchParams(
    await searchParams,
    MEMBER_LIST_QUERY_CONFIG,
  )
  const result = await getMembersPageAction(query)
  const data = result.success ? result.data : undefined
  const members = data?.items ?? []
  const meta: PaginationMeta = {
    totalCount: data?.totalCount ?? 0,
    filteredCount: data?.filteredCount ?? 0,
    page: data?.page ?? query.page ?? 1,
    limit: data?.limit ?? query.limit ?? LIST_PAGE_SIZE,
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="유저 관리"
        description="가입된 유저 목록을 조회하고 상세 정보를 확인합니다."
      />
      <MembersClient initialMembers={members} meta={meta} query={query} />
    </div>
  )
}
