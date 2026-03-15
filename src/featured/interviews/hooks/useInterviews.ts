'use client'

import { useState, useMemo } from 'react'
import type { InterviewSession, SessionStatus } from '@/featured/interviews/types'

export type InterviewSortBy = 'endedAt' | 'createdAt' | 'score'

export function useInterviews(initialSessions: InterviewSession[]) {
  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<SessionStatus | 'all'>('all')
  const [sortBy, setSortBy] = useState<InterviewSortBy>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const abandonedCount = useMemo(
    () => initialSessions.filter((session) => session.status === 'abandoned').length,
    [initialSessions],
  )
  const completedCount = useMemo(
    () => initialSessions.filter((session) => session.status === 'completed').length,
    [initialSessions],
  )
  const inProgressCount = useMemo(
    () => initialSessions.filter((session) => session.status === 'in_progress').length,
    [initialSessions],
  )

  const resetFilters = () => {
    setSearch('')
    setSelectedStatus('all')
    setSortBy('createdAt')
    setSortOrder('desc')
  }

  const filtered = useMemo(() => {
    const result = initialSessions.filter((session) => {
      if (
        search &&
        !session.userNickname.toLowerCase().includes(search.toLowerCase()) &&
        !session.id.includes(search)
      )
        return false
      if (selectedStatus !== 'all' && session.status !== selectedStatus) return false
      return true
    })

    return [...result].sort((a, b) => {
      let aVal: string | number = ''
      let bVal: string | number = ''

      if (sortBy === 'createdAt') {
        aVal = a.createdAt
        bVal = b.createdAt
      } else if (sortBy === 'endedAt') {
        aVal = a.endedAt ?? ''
        bVal = b.endedAt ?? ''
      } else if (sortBy === 'score') {
        aVal = a.score ?? 0
        bVal = b.score ?? 0
      }

      if (aVal < bVal) return sortOrder === 'desc' ? 1 : -1
      if (aVal > bVal) return sortOrder === 'desc' ? -1 : 1
      return 0
    })
  }, [initialSessions, search, selectedStatus, sortBy, sortOrder])

  return {
    search,
    setSearch,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filtered,
    totalCount: initialSessions.length,
    completedCount,
    inProgressCount,
    abandonedCount,
    resetFilters,
  }
}
