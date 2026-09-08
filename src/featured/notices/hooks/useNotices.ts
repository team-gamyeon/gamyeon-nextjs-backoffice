'use client'

import { useCallback, useMemo, useState, useTransition } from 'react'
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
  const queryKey = [query.search, query.status, query.sortBy, query.sortOrder].join('|')

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Notice | undefined>(undefined)

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
    loadMore,
    invalidate,
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
    invalidate()
    updateQuery({ search: nextSearch }, { scroll: false })
  })

  const activeTab: NoticeStatus | 'all' = query.status ?? 'all'

  const setActiveTab = (status: NoticeStatus | 'all') => {
    invalidate()
    updateQuery({ status: status === 'all' ? undefined : status })
  }

  /** 등록·수정·삭제 후 서버 데이터를 다시 받아 목록을 갱신한다. */
  const refresh = () => {
    invalidate()
    setExpandedId(null)
    startRefresh(() => router.refresh())
  }

  const handleToggle = async (id: string) => {
    const target = items.find((notice) => notice.id === id)
    if (!target) return

    const result = await updateNoticeAction(Number(id), {
      status: target.isActive ? 'INACTIVE' : 'ACTIVE',
    })
    if (!result.success) {
      toast.error('상태 변경에 실패했습니다.')
      return
    }

    toast.success(`공지사항이 ${target.isActive ? '비활성화' : '활성화'}되었습니다.`)
    refresh()
  }

  const handleDelete = async (id: string) => {
    const result = await deleteNoticeAction(Number(id))
    if (!result.success) {
      toast.error('공지사항 삭제에 실패했습니다.')
      return
    }

    toast.success('공지사항이 삭제되었습니다.')
    refresh()
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

  const { activeCount, inactiveCount } = useMemo(() => {
    let active = 0
    let inactive = 0
    for (const notice of items) {
      if (notice.isActive) active += 1
      else inactive += 1
    }
    return { activeCount: active, inactiveCount: inactive }
  }, [items])

  return {
    notices: items,
    totalCount: meta.totalCount,
    filteredCount: meta.filteredCount,
    hasMore,
    isLoadingMore,
    loadMoreError,
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
    activeCount,
    inactiveCount,
    handleToggle,
    handleDelete,
    handleEdit,
    handleAdd,
    handleSave,
  }
}
