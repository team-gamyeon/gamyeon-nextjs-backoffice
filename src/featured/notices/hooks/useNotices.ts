'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  deleteNoticeAction,
  getNoticesAction,
  updateNoticeAction,
} from '@/featured/notices/actions/notices.action'
import { buildNoticeListQuery, type NoticeListTab } from '@/featured/notices/utils/noticeListQuery'
import { hasNextPage, mergeUniqueBy } from '@/shared/lib/pagination'
import type { Notice, NoticeListData } from '@/featured/notices/types'

const SEARCH_DEBOUNCE_MS = 350

export function useNotices(initialData: NoticeListData) {
  const [notices, setNotices] = useState<Notice[]>(initialData.items)
  const [totalCount, setTotalCount] = useState(initialData.totalCount)
  const [filteredCount, setFilteredCount] = useState(initialData.filteredCount)
  const [page, setPage] = useState(initialData.page)
  const [hasMore, setHasMore] = useState(() => hasNextPage(initialData, initialData.items.length))
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [loadMoreError, setLoadMoreError] = useState(false)
  const [search, setSearch] = useState('')
  const [querySearch, setQuerySearch] = useState('')
  const [activeTab, setActiveTab] = useState<NoticeListTab>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Notice | undefined>(undefined)
  const requestIdRef = useRef(0)
  const isLoadingRef = useRef(false)
  const querySearchRef = useRef('')
  const searchRef = useRef('')
  const activeTabRef = useRef<NoticeListTab>('all')

  searchRef.current = search

  const reload = useCallback(async (nextSearch: string, nextTab = activeTabRef.current) => {
    const normalizedSearch = nextSearch.trim()
    const previousSearch = querySearchRef.current
    const previousTab = activeTabRef.current
    const requestId = ++requestIdRef.current

    querySearchRef.current = normalizedSearch
    activeTabRef.current = nextTab
    setQuerySearch(normalizedSearch)
    setActiveTab(nextTab)
    setIsRefreshing(true)
    setIsLoadingMore(false)
    setLoadMoreError(false)
    isLoadingRef.current = true

    let result: Awaited<ReturnType<typeof getNoticesAction>>
    try {
      result = await getNoticesAction(buildNoticeListQuery(normalizedSearch, nextTab, 1))
    } catch {
      result = { success: false, error: '공지사항을 불러오지 못했습니다.' }
    }

    if (requestId !== requestIdRef.current) return false

    isLoadingRef.current = false
    setIsRefreshing(false)

    if (!result.success || !result.data) {
      if (previousSearch !== normalizedSearch || previousTab !== nextTab) {
        setNotices([])
        setTotalCount(0)
        setFilteredCount(0)
        setPage(1)
      }
      setHasMore(false)
      toast.error(result.error ?? '공지사항을 불러오지 못했습니다.')
      return false
    }

    setNotices(result.data.items)
    setTotalCount(result.data.totalCount)
    setFilteredCount(result.data.filteredCount)
    setPage(result.data.page)
    setHasMore(hasNextPage(result.data, result.data.items.length))
    setExpandedId(null)
    return true
  }, [])

  useEffect(() => {
    const normalizedSearch = search.trim()
    if (normalizedSearch === querySearch) return

    const timer = window.setTimeout(() => {
      void reload(normalizedSearch)
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [querySearch, reload, search])

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) return

    const nextPage = page + 1
    const requestId = ++requestIdRef.current
    isLoadingRef.current = true
    setIsLoadingMore(true)
    setLoadMoreError(false)

    let result: Awaited<ReturnType<typeof getNoticesAction>>
    try {
      result = await getNoticesAction(
        buildNoticeListQuery(querySearchRef.current, activeTabRef.current, nextPage),
      )
    } catch {
      result = { success: false, error: '추가 공지사항을 불러오지 못했습니다.' }
    }

    if (requestId !== requestIdRef.current) return

    isLoadingRef.current = false
    setIsLoadingMore(false)

    if (!result.success || !result.data) {
      setLoadMoreError(true)
      toast.error(result.error ?? '추가 공지사항을 불러오지 못했습니다.')
      return
    }

    const data = result.data
    setNotices((current) => mergeUniqueBy(current, data.items, (notice) => notice.id))
    setTotalCount(data.totalCount)
    setFilteredCount(data.filteredCount)
    setPage(data.page)
    setHasMore(hasNextPage(data, data.items.length))
  }, [hasMore, page])

  const { activeCount, inactiveCount } = useMemo(() => {
    let active = 0
    let inactive = 0
    for (const notice of notices) {
      if (notice.isActive) active += 1
      else inactive += 1
    }
    return { activeCount: active, inactiveCount: inactive }
  }, [notices])

  const handleToggle = async (id: string) => {
    const target = notices.find((notice) => notice.id === id)
    if (!target) return

    const nextStatus = target.isActive ? 'INACTIVE' : 'ACTIVE'
    const result = await updateNoticeAction(Number(id), { status: nextStatus })
    if (!result.success) {
      toast.error('상태 변경에 실패했습니다.')
      return
    }

    toast.success(`공지사항이 ${target.isActive ? '비활성화' : '활성화'}되었습니다.`)
    await reload(querySearchRef.current, activeTabRef.current)
  }

  const handleDelete = async (id: string) => {
    const result = await deleteNoticeAction(Number(id))
    if (!result.success) {
      toast.error('공지사항 삭제에 실패했습니다.')
      return
    }

    toast.success('공지사항이 삭제되었습니다.')
    if (expandedId === id) setExpandedId(null)
    await reload(querySearchRef.current, activeTabRef.current)
  }

  const handleEdit = (notice: Notice) => {
    setEditTarget(notice)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setEditTarget(undefined)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    await reload(querySearchRef.current, activeTabRef.current)
  }

  const handleTabChange = useCallback(
    (nextTab: NoticeListTab) => {
      if (nextTab === activeTabRef.current) return
      void reload(searchRef.current, nextTab)
    },
    [reload],
  )

  return {
    notices,
    totalCount,
    filteredCount,
    hasMore,
    isRefreshing,
    isLoadingMore,
    loadMoreError,
    isSearchPending: search.trim() !== querySearch,
    loadMore,
    search,
    setSearch,
    querySearch,
    activeTab,
    setActiveTab: handleTabChange,
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
