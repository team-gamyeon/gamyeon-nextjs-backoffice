'use server'

import { getUsers } from '@/featured/members/services/members.service'
import { MEMBER_LIST_QUERY_CONFIG } from '@/featured/members/constants'
import { mapApiUserToMember } from '@/shared/lib/utils/mappers'
import { parseListQuery } from '@/shared/lib/validation/listQuery'
import type { Member, MemberListQuery } from '@/featured/members/types'
import type { ActionResult } from '@/shared/types/action'
import type { PaginatedData } from '@/shared/types/pagination'

type MemberPageData = PaginatedData<Member>

export type GetMembersPageActionResult = ActionResult<MemberPageData>

export async function getMembersPageAction(query: unknown): Promise<GetMembersPageActionResult> {
  const parsed = parseListQuery(query, MEMBER_LIST_QUERY_CONFIG)
  if (!parsed.success) {
    return { success: false, error: parsed.error }
  }

  const result = await getUsers(parsed.data satisfies MemberListQuery)

  if (!result) {
    return { success: false, error: '회원 목록을 불러오지 못했습니다.' }
  }

  return {
    success: true,
    data: {
      totalCount: result.totalCount,
      filteredCount: result.filteredCount,
      page: result.page,
      limit: result.limit,
      items: result.items.map(mapApiUserToMember),
    },
  }
}
