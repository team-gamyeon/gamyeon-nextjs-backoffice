'use client'

import { useState, useMemo } from 'react'
import type { AnalysisReport, ReportStatus } from '@/featured/reports/types'

export function useReports(initialReports: AnalysisReport[]) {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<ReportStatus | 'all'>('all')
  const [selected, setSelected] = useState<AnalysisReport | null>(null)

  const filtered = useMemo(() => {
    return initialReports.filter((report) => {
      if (
        search &&
        !report.userNickname.toLowerCase().includes(search.toLowerCase()) &&
        !report.sessionId.includes(search)
      )
        return false
      if (activeTab !== 'all' && report.status !== activeTab) return false
      return true
    })
  }, [initialReports, search, activeTab])

  const completedCount = initialReports.filter((report) => report.status === 'COMPLETED').length
  const analyzingCount = initialReports.filter((report) => report.status === 'IN_PROGRESS').length
  const failedCount = initialReports.filter((report) => report.status === 'FAILED').length

  return {
    search,
    setSearch,
    activeTab,
    setActiveTab,
    selected,
    setSelected,
    filtered,
    totalCount: initialReports.length,
    completedCount,
    analyzingCount,
    failedCount,
  }
}
