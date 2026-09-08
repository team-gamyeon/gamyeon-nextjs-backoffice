'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getQuestionsAction } from '@/featured/questions/actions/questions.action'
import { useDebounce } from '@/shared/hooks/useDebounce'
import { useListQueryNavigation } from '@/shared/hooks/useListQueryNavigation'
import { hasNextPage, mergeUniqueBy, toPaginationMeta } from '@/shared/lib/pagination'
import { LIST_PAGE_SIZE } from '@/shared/lib/validation/listQuery'
import type {
  CommonQuestion,
  QuestionListQuery,
  QuestionListStatus,
} from '@/featured/questions/types'
import type { PaginationMeta } from '@/shared/types/pagination'

interface UseQuestionsParams {
  initialQuestions: CommonQuestion[]
  initialPagination: PaginationMeta
  query: QuestionListQuery
  hasInitialLoadError: boolean
}

export function useQuestions({
  initialQuestions,
  initialPagination,
  query,
  hasInitialLoadError,
}: UseQuestionsParams) {
  const router = useRouter()
  const { isPending, updateQuery } = useListQueryNavigation()
  const querySearch = query.search ?? ''
  const queryKey = JSON.stringify([
    query.search,
    query.status,
    query.sortBy,
    query.sortOrder,
    query.from,
    query.to,
  ])
  const [search, setSearch] = useState(querySearch)
  const [questions, setQuestions] = useState(initialQuestions)
  const [meta, setMeta] = useState(initialPagination)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [loadMoreError, setLoadMoreError] = useState(false)
  const previousQuerySearchRef = useRef(querySearch)
  const querySearchRef = useRef(querySearch)
  const scrollRootRef = useRef<HTMLDivElement>(null)
  const queryGenerationRef = useRef(0)
  const nextRequestIdRef = useRef(0)
  const activeRequestIdRef = useRef<number | null>(null)

  querySearchRef.current = querySearch

  const debouncedSearch = useDebounce(search, 300)
  const activeTab: QuestionListStatus | 'all' = query.status ?? 'all'
  const isFiltered = Boolean(query.search || query.status || query.from || query.to)
  const hasMore = !hasInitialLoadError && hasNextPage(meta)

  const cancelPendingLoadMore = useCallback(() => {
    queryGenerationRef.current += 1
    activeRequestIdRef.current = null
    setIsLoadingMore(false)
    setLoadMoreError(false)
  }, [])

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

    cancelPendingLoadMore()
    updateQuery({ search: normalizedSearch || undefined }, { resetPage: true })
  }, [cancelPendingLoadMore, debouncedSearch, updateQuery])

  useEffect(() => {
    queryGenerationRef.current += 1
    activeRequestIdRef.current = null
    setQuestions(initialQuestions)
    setMeta(initialPagination)
    setIsLoadingMore(false)
    setLoadMoreError(false)
    scrollRootRef.current?.scrollTo({ top: 0 })
  }, [hasInitialLoadError, initialPagination, initialQuestions, queryKey])

  const loadMore = useCallback(async () => {
    if (activeRequestIdRef.current !== null || !hasMore || isPending) return

    const requestId = ++nextRequestIdRef.current
    const generation = queryGenerationRef.current
    const nextPage = meta.page + 1
    activeRequestIdRef.current = requestId
    setIsLoadingMore(true)
    setLoadMoreError(false)

    try {
      const result = await getQuestionsAction({
        ...query,
        page: nextPage,
        limit: LIST_PAGE_SIZE,
      })

      if (generation !== queryGenerationRef.current) return
      if (!result.success) {
        setLoadMoreError(true)
        return
      }

      const nextData = result.data
      setQuestions((currentQuestions) =>
        mergeUniqueBy(currentQuestions, nextData.items, (question) => question.id),
      )
      setMeta(toPaginationMeta(nextData))
    } catch {
      if (generation === queryGenerationRef.current) setLoadMoreError(true)
    } finally {
      if (activeRequestIdRef.current === requestId) {
        activeRequestIdRef.current = null
        setIsLoadingMore(false)
      }
    }
  }, [hasMore, isPending, meta.page, query])

  const setActiveTab = (status: QuestionListStatus | 'all') => {
    cancelPendingLoadMore()
    updateQuery({ status: status === 'all' ? undefined : status }, { resetPage: true })
  }

  const refreshQuestions = () => {
    cancelPendingLoadMore()
    router.refresh()
  }

  return {
    questions,
    meta,
    search,
    setSearch,
    activeTab,
    setActiveTab,
    isFiltered,
    isPending,
    isLoadingMore,
    loadMoreError,
    hasMore,
    loadMore,
    refreshQuestions,
    scrollRootRef,
  }
}
