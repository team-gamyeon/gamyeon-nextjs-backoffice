'use client'

import { useCallback } from 'react'
import { getMembersPageAction } from '@/featured/members/actions/members.action'
import { MEMBER_STATUS_QUERY_MAP, STATUS_MAP } from '@/featured/members/constants'
import { useListQueryNavigation } from '@/shared/hooks/useListQueryNavigation'
import { useListResource, type ListPageResult } from '@/shared/hooks/useListResource'
import { useListSearch } from '@/shared/hooks/useListSearch'
import type { Member, MemberFiltersState, MemberListQuery } from '@/featured/members/types'
import type { PaginationMeta } from '@/shared/types/pagination'

interface UseMembersParams {
  initialMembers: Member[]
  initialMeta: PaginationMeta
  query: MemberListQuery
  hasInitialLoadError?: boolean
}

export function useMembers({
  initialMembers,
  initialMeta,
  query,
  hasInitialLoadError = false,
}: UseMembersParams) {
  const { isPending, updateQuery } = useListQueryNavigation()
  const queryKey = [query.search, query.status, query.sortBy, query.sortOrder].join('|')

  const loadPage = useCallback(
    async (page: number): Promise<ListPageResult<Member>> => {
      const result = await getMembersPageAction({ ...query, page })
      if (!result.success) return { ok: false }

      const data = result.data
      return {
        ok: true,
        items: data.items,
        meta: {
          totalCount: data.totalCount,
          filteredCount: data.filteredCount,
          page: data.page,
          limit: data.limit,
        },
      }
    },
    [query],
  )

  const {
    items,
    meta,
    hasMore,
    isLoadingMore,
    loadMoreError,
    initialLoadFailed,
    loadMore,
    invalidate,
    scrollRootRef,
  } = useListResource<Member>({
    initialItems: initialMembers,
    initialMeta,
    hasInitialLoadError,
    queryKey,
    getKey: (member) => member.id,
    loadPage,
    isPaused: isPending,
  })

  const { search, setSearch, isSearchPending } = useListSearch(query.search ?? '', (nextSearch) => {
    invalidate()
    updateQuery({ search: nextSearch }, { scroll: false })
  })

  const filters: MemberFiltersState = {
    search,
    status: query.status ? STATUS_MAP[query.status] : 'all',
    sortBy: query.sortBy ?? 'createdAt',
    sortOrder: query.sortOrder ?? 'desc',
  }

  const handleFilterChange = (partial: Partial<MemberFiltersState>) => {
    if (partial.search !== undefined) {
      setSearch(partial.search)
      return
    }

    invalidate()

    if (partial.status !== undefined) {
      // unknown은 표시 전용이라 백엔드 필터로 보내지 않는다.
      if (partial.status === 'unknown') return
      updateQuery(
        { status: partial.status === 'all' ? undefined : MEMBER_STATUS_QUERY_MAP[partial.status] },
        { scroll: false },
      )
      return
    }

    if (partial.sortBy !== undefined) {
      updateQuery({ sortBy: partial.sortBy }, { scroll: false })
      return
    }

    if (partial.sortOrder !== undefined) {
      updateQuery({ sortOrder: partial.sortOrder }, { scroll: false })
    }
  }

  return {
    members: items,
    pagination: meta,
    hasMore,
    isLoadingMore,
    hasLoadError: loadMoreError,
    initialLoadFailed,
    isPending,
    isPaused: isPending || isSearchPending,
    hasFilters: Boolean(query.search || query.status),
    filters,
    handleFilterChange,
    loadMore,
    scrollRootRef,
  }
}
