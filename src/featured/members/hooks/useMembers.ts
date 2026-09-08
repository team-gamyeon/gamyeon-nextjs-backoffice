'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getMembersPageAction } from '@/featured/members/actions/members.action'
import { MEMBER_STATUS_QUERY_MAP, STATUS_MAP } from '@/featured/members/constants'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useListQueryNavigation } from '@/shared/hooks/useListQueryNavigation'
import { hasNextPage, hasNextPageAfterLoad, mergeUniqueBy } from '@/shared/lib/pagination'
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
  hasInitialLoadError,
}: UseMembersParams) {
  const querySearch = query.search ?? ''
  const [search, setSearch] = useState(querySearch)
  const [members, setMembers] = useState(initialMembers)
  const [pagination, setPagination] = useState(initialMeta)
  const [hasMore, setHasMore] = useState(
    () => !hasInitialLoadError && hasNextPage(initialMeta, initialMembers.length),
  )
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasLoadError, setHasLoadError] = useState(false)
  const previousQuerySearchRef = useRef(querySearch)
  const querySearchRef = useRef(querySearch)
  const scrollRootRef = useRef<HTMLDivElement>(null)
  const requestTokenRef = useRef(0)
  const loadingRef = useRef(false)
  const paginationRef = useRef(initialMeta)
  const previousQueryKeyRef = useRef('')
  const queryKey = JSON.stringify([query.search, query.status, query.sortBy, query.sortOrder])

  useEffect(() => {
    querySearchRef.current = querySearch
    paginationRef.current = pagination
  }, [querySearch, pagination])

  const debouncedSearch = useDebounce(search, 300)
  const { isPending, updateQuery } = useListQueryNavigation()

  const cancelPendingLoad = useCallback(() => {
    requestTokenRef.current += 1
    loadingRef.current = false
    setIsLoadingMore(false)
    setHasLoadError(false)
  }, [])

  useEffect(() => {
    if (previousQueryKeyRef.current === queryKey) return

    previousQueryKeyRef.current = queryKey
    cancelPendingLoad()
    setMembers(initialMembers)
    setPagination(initialMeta)
    setHasMore(hasNextPage(initialMeta, initialMembers.length))
    scrollRootRef.current?.scrollTo({ top: 0 })
  }, [cancelPendingLoad, initialMembers, initialMeta, queryKey])

  useEffect(() => {
    const previousQuerySearch = previousQuerySearchRef.current
    previousQuerySearchRef.current = querySearch
    setSearch((currentSearch) =>
      currentSearch === previousQuerySearch ? querySearch : currentSearch,
    )
  }, [querySearch])

  useEffect(() => {
    const normalizedSearch = debouncedSearch.trim()
    if (normalizedSearch === querySearchRef.current) return

    cancelPendingLoad()
    updateQuery({ search: normalizedSearch || undefined }, { scroll: false })
  }, [cancelPendingLoad, debouncedSearch, updateQuery])

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore || isPending || search.trim() !== querySearch) return

    const requestToken = requestTokenRef.current + 1
    requestTokenRef.current = requestToken
    loadingRef.current = true
    setIsLoadingMore(true)
    setHasLoadError(false)

    const previousMeta = paginationRef.current
    const nextPage = previousMeta.page + 1

    try {
      const result = await getMembersPageAction({
        ...query,
        page: nextPage,
      })
      if (requestToken !== requestTokenRef.current) return

      if (!result.success) {
        setHasLoadError(true)
        return
      }

      const nextData = result.data
      setMembers((currentMembers) =>
        mergeUniqueBy(currentMembers, nextData.items, (member) => member.id),
      )
      const nextMeta = {
        totalCount: nextData.totalCount,
        filteredCount: nextData.filteredCount,
        page: nextData.page,
        limit: nextData.limit,
      }
      setPagination(nextMeta)
      setHasMore(hasNextPageAfterLoad(previousMeta.page, nextMeta, nextData.items.length))
    } catch {
      if (requestToken === requestTokenRef.current) setHasLoadError(true)
    } finally {
      if (requestToken === requestTokenRef.current) {
        loadingRef.current = false
        setIsLoadingMore(false)
      }
    }
  }, [hasMore, isPending, query, querySearch, search])

  const filters: MemberFiltersState = {
    search,
    status: query.status ? STATUS_MAP[query.status] : 'all',
    sortBy: query.sortBy ?? 'createdAt',
    sortOrder: query.sortOrder ?? 'desc',
  }

  const handleFilterChange = (partial: Partial<MemberFiltersState>) => {
    if (partial.search !== undefined) {
      cancelPendingLoad()
      setSearch(partial.search)
      return
    }

    if (partial.status !== undefined) {
      cancelPendingLoad()
      // 'unknown'은 display-only 상태이므로 쿼리에 포함되지 않음
      if (partial.status !== 'unknown') {
        updateQuery(
          {
            status: partial.status === 'all' ? undefined : MEMBER_STATUS_QUERY_MAP[partial.status],
          },
          { scroll: false },
        )
      }
      return
    }

    if (partial.sortBy !== undefined) {
      cancelPendingLoad()
      updateQuery({ sortBy: partial.sortBy }, { scroll: false })
      return
    }

    if (partial.sortOrder !== undefined) {
      cancelPendingLoad()
      updateQuery({ sortOrder: partial.sortOrder }, { scroll: false })
    }
  }

  // InfiniteScrollTrigger는 hasMore/isLoading을 이미 스스로 본다.
  // 여기서는 그쪽이 모르는 조건(네비게이션 진행 중, 검색어 미확정)만 알려준다.
  // hasMore를 넣으면 "모든 항목을 불러왔습니다" 안내가 가려지므로 넣지 않는다.
  const isPaused = isPending || search.trim() !== querySearch

  return {
    members,
    pagination,
    hasMore,
    isLoadingMore,
    hasLoadError,
    isPending,
    isPaused,
    hasFilters: Boolean(query.search || query.status),
    filters,
    handleFilterChange,
    loadMore,
    scrollRootRef,
  }
}
