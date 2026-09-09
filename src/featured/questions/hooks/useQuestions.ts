'use client'

import { useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { getQuestionsAction } from '@/featured/questions/actions/questions.action'
import { useListQueryNavigation } from '@/shared/hooks/useListQueryNavigation'
import { useListResource, type ListPageResult } from '@/shared/hooks/useListResource'
import { useListSearch } from '@/shared/hooks/useListSearch'
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
  const [isRefreshing, startRefresh] = useTransition()
  const queryKey = [
    query.search,
    query.status,
    query.sortBy,
    query.sortOrder,
    query.from,
    query.to,
  ].join('|')

  const loadPage = useCallback(
    async (page: number): Promise<ListPageResult<CommonQuestion>> => {
      const result = await getQuestionsAction({ ...query, page })
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
    updateItem,
    removeItem,
    scrollRootRef,
  } = useListResource<CommonQuestion>({
    initialItems: initialQuestions,
    initialMeta: initialPagination,
    hasInitialLoadError,
    queryKey,
    getKey: (question) => question.id,
    loadPage,
    isPaused: isPending,
  })

  const { search, setSearch, isSearchPending } = useListSearch(query.search ?? '', (nextSearch) => {
    invalidate()
    updateQuery({ search: nextSearch })
  })

  const activeTab: QuestionListStatus | 'all' = query.status ?? 'all'

  const setActiveTab = (status: QuestionListStatus | 'all') => {
    invalidate()
    updateQuery({ status: status === 'all' ? undefined : status })
  }

  /** 등록·수정·삭제 후 서버 데이터를 다시 받아 목록을 갱신한다. */
  const refreshQuestions = () => {
    invalidate()
    startRefresh(() => router.refresh())
  }

  return {
    questions: items,
    meta,
    search,
    setSearch,
    activeTab,
    setActiveTab,
    isFiltered: Boolean(query.search || query.status || query.from || query.to),
    isPending,
    isLoadingMore,
    loadMoreError,
    initialLoadFailed,
    hasMore,
    loadMore,
    isPaused: isPending || isRefreshing || isSearchPending,
    refreshQuestions,
    updateItem,
    removeItem,
    scrollRootRef,
  }
}
