'use client'

import { useState, useMemo } from 'react'
import { deleteNoticeAction, updateNoticeAction, getNoticesAction } from '@/featured/notices/actions/notices.action'
import type { Notice } from '@/featured/notices/types'

export function useNotices(initialNotices: Notice[]) {
  const [notices, setNotices] = useState<Notice[]>(initialNotices)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Notice | undefined>(undefined)

  const filtered = useMemo(() => {
    return notices
      .filter((notice) => {
        if (search && !notice.title.toLowerCase().includes(search.toLowerCase())) return false
        if (activeTab === 'active' && !notice.isActive) return false
        if (activeTab === 'inactive' && notice.isActive) return false
        return true
      })
      .sort((a, b) => Number(b.isActive) - Number(a.isActive))
  }, [notices, search, activeTab])

  const activeCount = notices.filter((notice) => notice.isActive).length
  const inactiveCount = notices.filter((notice) => !notice.isActive).length

  const handleToggle = async (id: string) => {
    const target = notices.find((notice) => notice.id === id)
    if (!target) return
    const nextStatus = target.isActive ? 'INACTIVE' : 'ACTIVE'
    const result = await updateNoticeAction(Number(id), { status: nextStatus })
    if (!result.success) return
    setNotices((prev) =>
      prev.map((notice) => (notice.id === id ? { ...notice, isActive: !notice.isActive } : notice)),
    )
  }

  const handleDelete = async (id: string) => {
    const result = await deleteNoticeAction(Number(id))
    if (!result.success) return
    setNotices((prev) => prev.filter((notice) => notice.id !== id))
    if (expandedId === id) setExpandedId(null)
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
    const result = await getNoticesAction()
    if (result.success && result.data) {
      setNotices(result.data)
    }
  }

  return {
    notices,
    filtered,
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
