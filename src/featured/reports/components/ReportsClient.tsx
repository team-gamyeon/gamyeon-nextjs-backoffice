'use client'

import { motion } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { SearchInput } from '@/shared/components/SearchInput'
import { useReports } from '@/featured/reports/hooks/useReports'
import { ReportsTable } from '@/featured/reports/components/ReportsTable'
import { ReportDetailDialog } from '@/featured/reports/components/ReportDetailDialog'
import type { AnalysisReport } from '@/featured/reports/types'

interface ReportsClientProps {
  initialReports: AnalysisReport[]
}

export function ReportsClient({ initialReports }: ReportsClientProps) {
  const {
    search,
    setSearch,
    activeTab,
    setActiveTab,
    selected,
    setSelected,
    filtered,
    totalCount,
    completedCount,
    analyzingCount,
    failedCount,
  } = useReports(initialReports)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
      suppressHydrationWarning
    >
      {/* Stats */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-foreground">
          전체 <span className="text-foreground mr-1 font-semibold">{totalCount}</span>개
        </span>
        <span className="text-muted-foreground">
          완료{' '}
          <span className="mr-1 font-semibold text-green-600 dark:text-green-400">
            {completedCount}
          </span>
          개
        </span>
        <span className="text-muted-foreground">
          분석 중 <span className="text-primary mr-1 font-semibold">{analyzingCount}</span>개
        </span>
        {failedCount > 0 && (
          <span className="text-muted-foreground">
            실패 <span className="text-destructive mr-1 font-semibold">{failedCount}</span>개
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <TabsList className="h-9">
            <TabsTrigger value="all" className="text-xs">
              전체
            </TabsTrigger>
            <TabsTrigger value="COMPLETED" className="text-xs">
              분석 완료
            </TabsTrigger>
            <TabsTrigger value="IN_PROGRESS" className="text-xs">
              분석 중
            </TabsTrigger>
            <TabsTrigger value="FAILED" className="text-xs">
              실패
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="유저명 또는 세션 ID 검색..."
          className="min-w-48 flex-1"
        />
      </div>

      <ReportsTable reports={filtered} onSelect={setSelected} />

      {selected && (
        <ReportDetailDialog report={selected} open={!!selected} onClose={() => setSelected(null)} />
      )}
    </motion.div>
  )
}
