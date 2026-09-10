'use client'

import { useCallback, useMemo, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  deleteNoticeAction,
  getNoticesAction,
  updateNoticeAction,
} from '@/featured/notices/actions/notices.action'
import { useListQueryNavigation } from '@/shared/hooks/useListQueryNavigation'
import { useListResource, type ListPageResult } from '@/shared/hooks/useListResource'
import { useListSearch } from '@/shared/hooks/useListSearch'
import { countBy } from '@/shared/lib/countBy'
import type { GetNoticesParams, Notice, NoticeStatus } from '@/featured/notices/types'
import type { PaginationMeta } from '@/shared/types/pagination'

interface UseNoticesParams {
  initialNotices: Notice[]
  initialMeta: PaginationMeta
  query: GetNoticesParams
  hasInitialLoadError: boolean
}

export function useNotices({
  initialNotices,
  initialMeta,
  query,
  hasInitialLoadError,
}: UseNoticesParams) {
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

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Notice | undefined>(undefined)
  const pendingToggleIdsRef = useRef(new Set<string>())
  const [pendingToggleIds, setPendingToggleIds] = useState<ReadonlySet<string>>(() => new Set())

  const loadPage = useCallback(
    async (page: number): Promise<ListPageResult<Notice>> => {
      const result = await getNoticesAction({ ...query, page })
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
  } = useListResource<Notice>({
    initialItems: initialNotices,
    initialMeta,
    hasInitialLoadError,
    queryKey,
    getKey: (notice) => notice.id,
    loadPage,
    isPaused: isPending,
  })

  const { search, setSearch, isSearchPending } = useListSearch(query.search ?? '', (nextSearch) => {
    queryChangeEpochRef.current += 1
    invalidate()
    updateQuery({ search: nextSearch }, { scroll: false })
  })

  const activeTab: NoticeStatus | 'all' = query.status ?? 'all'

  const setActiveTab = (status: NoticeStatus | 'all') => {
    queryChangeEpochRef.current += 1
    invalidate()
    updateQuery({ status: status === 'all' ? undefined : status })
  }

  const revalidateNotices = () => {
    invalidate()
    startRefresh(() => router.refresh())
  }

  /** 등록·수정·삭제 후 서버 데이터를 다시 받아 목록을 갱신한다. */
  const refresh = () => {
    setExpandedId(null)
    revalidateNotices()
  }

  const handleToggle = async (id: string) => {
    if (pendingToggleIdsRef.current.has(id)) return

    const target = items.find((notice) => notice.id === id)
    if (!target) return

    const requestQueryKey = queryKey
    const requestQueryChangeEpoch = queryChangeEpochRef.current
    const nextStatus: NoticeStatus = target.isActive ? 'INACTIVE' : 'ACTIVE'
    pendingToggleIdsRef.current.add(id)
    setPendingToggleIds(new Set(pendingToggleIdsRef.current))

    try {
      const result = await updateNoticeAction(Number(id), { status: nextStatus })
      if (!result.success) {
        toast.error('상태 변경에 실패했습니다.')
        return
      }

      toast.success(`공지사항이 ${target.isActive ? '비활성화' : '활성화'}되었습니다.`)

      // 요청 중 필터나 정렬이 바뀌었다면 새 목록에 이전 쿼리의 항목을 덮어쓰지 않는다.
      if (
        queryChangeEpochRef.current !== requestQueryChangeEpoch ||
        latestQueryKeyRef.current !== requestQueryKey
      ) {
        revalidateNotices()
        return
      }

      if (query.status && query.status !== nextStatus) {
        setExpandedId((currentId) => (currentId === id ? null : currentId))
        excludeItem(id)
        return
      }

      updateItem({ ...target, isActive: !target.isActive })
      revalidateNotices()
    } finally {
      pendingToggleIdsRef.current.delete(id)
      setPendingToggleIds(new Set(pendingToggleIdsRef.current))
    }
  }

  const handleDelete = async (id: string) => {
    const result = await deleteNoticeAction(Number(id))
    if (!result.success) {
      toast.error('공지사항 삭제에 실패했습니다.')
      return
    }

    toast.success('공지사항이 삭제되었습니다.')
    setExpandedId((currentId) => (currentId === id ? null : currentId))
    deleteItem(id)
  }

  const handleEdit = (notice: Notice) => {
    setEditTarget(notice)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setEditTarget(undefined)
    setDialogOpen(true)
  }

  const handleSave = () => {
    refresh()
  }

  const statusCounts = useMemo(
    () => countBy(items, (notice) => (notice.isActive ? 'active' : 'inactive')),
    [items],
  )

  return {
    notices: items,
    totalCount: meta.totalCount,
    filteredCount: meta.filteredCount,
    hasMore,
    isLoadingMore,
    loadMoreError,
    initialLoadFailed,
    loadMore,
    scrollRootRef,
    isPaused: isPending || isRefreshing || isSearchPending,
    isFiltered: Boolean(query.search || query.status),
    search,
    setSearch,
    activeTab,
    setActiveTab,
    expandedId,
    setExpandedId,
    dialogOpen,
    setDialogOpen,
    editTarget,
    activeCount: statusCounts.active ?? 0,
    inactiveCount: statusCounts.inactive ?? 0,
    pendingToggleIds,
    handleToggle,
    handleDelete,
    handleEdit,
    handleAdd,
    handleSave,
  }
}
