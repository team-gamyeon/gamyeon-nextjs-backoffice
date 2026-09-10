'use client'

import { useCallback, useMemo, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  getQuestionsAction,
  updateQuestionAction,
} from '@/featured/questions/actions/questions.action'
import { useListQueryNavigation } from '@/shared/hooks/useListQueryNavigation'
import { useListResource, type ListPageResult } from '@/shared/hooks/useListResource'
import { useListSearch } from '@/shared/hooks/useListSearch'
import { countBy } from '@/shared/lib/countBy'
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
  const latestQueryKeyRef = useRef(queryKey)
  latestQueryKeyRef.current = queryKey
  const queryChangeEpochRef = useRef(0)
  const pendingToggleIdsRef = useRef(new Set<string>())
  const [pendingToggleIds, setPendingToggleIds] = useState<ReadonlySet<string>>(() => new Set())

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
    excludeItem,
    deleteItem,
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
    queryChangeEpochRef.current += 1
    invalidate()
    updateQuery({ search: nextSearch })
  })

  const activeTab: QuestionListStatus | 'all' = query.status ?? 'all'

  const setActiveTab = (status: QuestionListStatus | 'all') => {
    queryChangeEpochRef.current += 1
    invalidate()
    updateQuery({ status: status === 'all' ? undefined : status })
  }

  const statusCounts = useMemo(
    () => countBy(items, (question) => (question.isActive ? 'active' : 'inactive')),
    [items],
  )

  /** 등록·수정·삭제 후 서버 데이터를 다시 받아 목록을 갱신한다. */
  const refreshQuestions = () => {
    invalidate()
    startRefresh(() => router.refresh())
  }

  const handleToggle = async (id: string) => {
    if (pendingToggleIdsRef.current.has(id)) return

    const target = items.find((question) => question.id === id)
    if (!target) return

    const requestQueryKey = queryKey
    const requestQueryChangeEpoch = queryChangeEpochRef.current
    const nextStatus: QuestionListStatus = target.isActive ? 'INACTIVE' : 'ACTIVE'
    pendingToggleIdsRef.current.add(id)
    setPendingToggleIds(new Set(pendingToggleIdsRef.current))

    try {
      const result = await updateQuestionAction(id, { status: nextStatus })
      if (!result.success) {
        toast.error(result.error ?? '상태 변경에 실패했습니다.')
        return
      }

      toast.success(`질문이 ${target.isActive ? '비활성화' : '활성화'}되었습니다.`)

      // 요청 중 필터나 정렬이 바뀌었다면 새 목록에 이전 쿼리의 항목을 덮어쓰지 않는다.
      if (
        queryChangeEpochRef.current !== requestQueryChangeEpoch ||
        latestQueryKeyRef.current !== requestQueryKey
      ) {
        refreshQuestions()
        return
      }

      if (query.status && query.status !== nextStatus) {
        excludeItem(id)
        return
      }

      updateItem({ ...target, isActive: !target.isActive })
      refreshQuestions()
    } finally {
      pendingToggleIdsRef.current.delete(id)
      setPendingToggleIds(new Set(pendingToggleIdsRef.current))
    }
  }

  return {
    questions: items,
    meta,
    search,
    setSearch,
    activeTab,
    setActiveTab,
    isFiltered: Boolean(query.search || query.status || query.from || query.to),
    activeCount: statusCounts.active ?? 0,
    inactiveCount: statusCounts.inactive ?? 0,
    isPending,
    isLoadingMore,
    loadMoreError,
    initialLoadFailed,
    hasMore,
    loadMore,
    isPaused: isPending || isRefreshing || isSearchPending,
    refreshQuestions,
    handleToggle,
    pendingToggleIds,
    updateItem,
    deleteItem,
    scrollRootRef,
  }
}
