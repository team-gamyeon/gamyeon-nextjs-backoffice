'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getMembersPageAction } from '@/featured/members/actions/members.action'
import { MEMBER_STATUS_QUERY_MAP, STATUS_MAP } from '@/featured/members/constants'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useListQueryNavigation } from '@/shared/hooks/useListQueryNavigation'
import { hasNextPage, mergeUniqueBy, toPaginationMeta } from '@/shared/lib/pagination'
import { LIST_PAGE_SIZE } from '@/shared/lib/validation/listQuery'
import type { Member, MemberFiltersState, MemberListQuery } from '@/featured/members/types'
import type { PaginationMeta } from '@/shared/types/pagination'

interface UseMembersParams {
  initialMembers: Member[]
  initialMeta: PaginationMeta
  query: MemberListQuery
}

export function useMembers({ initialMembers, initialMeta, query }: UseMembersParams) {
  const querySearch = query.search ?? ''
  const [search, setSearch] = useState(querySearch)
  const [members, setMembers] = useState(initialMembers)
  const [pagination, setPagination] = useState(initialMeta)
  const [hasMore, setHasMore] = useState(() => hasNextPage(initialMeta))
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

  querySearchRef.current = querySearch
  paginationRef.current = pagination

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
    setHasMore(hasNextPage(initialMeta))
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
    updateQuery(
      { search: normalizedSearch || undefined, page: undefined, limit: undefined },
      { scroll: false },
    )
  }, [cancelPendingLoad, debouncedSearch, updateQuery])

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore || isPending || search.trim() !== querySearch) return

    const requestToken = requestTokenRef.current + 1
    requestTokenRef.current = requestToken
    loadingRef.current = true
    setIsLoadingMore(true)
    setHasLoadError(false)

    const nextPage = paginationRef.current.page + 1

    try {
      const result = await getMembersPageAction({
        ...query,
        page: nextPage,
        limit: LIST_PAGE_SIZE,
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
      const nextMeta = toPaginationMeta(nextData)
      setPagination(nextMeta)
      setHasMore(hasNextPage(nextMeta, nextData.items.length))
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
      updateQuery(
        {
          status: partial.status === 'all' ? undefined : MEMBER_STATUS_QUERY_MAP[partial.status],
          page: undefined,
          limit: undefined,
        },
        { scroll: false },
      )
      return
    }

    if (partial.sortBy !== undefined) {
      cancelPendingLoad()
      updateQuery({ sortBy: partial.sortBy, page: undefined, limit: undefined }, { scroll: false })
      return
    }

    if (partial.sortOrder !== undefined) {
      cancelPendingLoad()
      updateQuery(
        { sortOrder: partial.sortOrder, page: undefined, limit: undefined },
        { scroll: false },
      )
    }
  }

  return {
    members,
    pagination,
    hasMore,
    isLoadingMore,
    hasLoadError,
    isPending,
    hasFilters: Boolean(query.search || query.status),
    filters,
    handleFilterChange,
    loadMore,
    scrollRootRef,
  }
}
