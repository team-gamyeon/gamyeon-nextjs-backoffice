'use client'

import { useState, useMemo } from 'react'
import type { Notice } from '@/featured/notices/types'

export function useNotices(initialNotices: Notice[]) {
  const [notices, setNotices] = useState<Notice[]>(initialNotices)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Notice | undefined>(undefined)

  const filtered = useMemo(() => {
    return notices.filter((notice) => {
      if (search && !notice.title.toLowerCase().includes(search.toLowerCase())) return false
      if (activeTab === 'active' && !notice.isActive) return false
      if (activeTab === 'inactive' && notice.isActive) return false
      return true
    })
  }, [notices, search, activeTab])

  const activeCount = notices.filter((notice) => notice.isActive).length
  const inactiveCount = notices.filter((notice) => !notice.isActive).length

  const handleToggle = (id: string) => {
    setNotices((prev) =>
      prev.map((notice) => (notice.id === id ? { ...notice, isActive: !notice.isActive } : notice)),
    )
  }

  const handleDelete = (id: string) => {
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

  const handleSave = (data: { title: string; content: string; isActive: boolean }) => {
    if (editTarget) {
      setNotices((prev) =>
        prev.map((notice) =>
          notice.id === editTarget.id ? { ...notice, ...data, updatedAt: '2026.03.07' } : notice,
        ),
      )
    } else {
      const newNotice: Notice = {
        id: String(Date.now()),
        ...data,
        createdAt: '2026.03.07',
        updatedAt: '2026.03.07',
      }
      setNotices((prev) => [newNotice, ...prev])
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
