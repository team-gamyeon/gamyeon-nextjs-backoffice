'use client'

import { motion } from 'framer-motion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import { SearchInput } from '@/shared/components/SearchInput'
import { useInterviews, type InterviewSortBy } from '@/featured/interviews/hooks/useInterviews'
import { InterviewsTable } from '@/featured/interviews/components/InterviewsTable'
import type { InterviewSession, SessionStatus } from '@/featured/interviews/types'

interface InterviewsClientProps {
  initialSessions: InterviewSession[]
}

export function InterviewsClient({ initialSessions }: InterviewsClientProps) {
  const {
    search,
    setSearch,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filtered,
    totalCount,
    completedCount,
    inProgressCount,
    abandonedCount,
    resetFilters,
  } = useInterviews(initialSessions)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="border-destructive/20 bg-destructive/5 flex items-center gap-3 rounded-lg border px-4 py-3">
        <Badge variant="destructive" className="text-xs">
          중단
        </Badge>
        <p className="text-muted-foreground text-sm">
          현재 <span className="text-foreground font-semibold">{abandonedCount}</span>
          건의 중단된 면접이 있습니다. 중단 원인을 확인하고 서비스 품질을 개선하세요.
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-foreground">
          총 <span className="text-foreground mr-1 font-semibold">{totalCount}</span>건
        </span>
        <span className="text-muted-foreground">
          완료{' '}
          <span className="mr-1 font-semibold text-green-600 dark:text-green-400">
            {completedCount}
          </span>
          건
        </span>
        <span className="text-muted-foreground">
          진행 중 <span className="text-primary mr-1 font-semibold">{inProgressCount}</span>건
        </span>
        <span className="text-muted-foreground">
          중단 <span className="text-destructive mr-1 font-semibold">{abandonedCount}</span>건
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="닉네임 또는 세션 ID 검색..."
          className="min-w-52 flex-1"
        />

        <Select
          value={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value as SessionStatus | 'all')}
        >
          <SelectTrigger className="h-9 w-28">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="abandoned">중단</SelectItem>
            <SelectItem value="in_progress">진행 중</SelectItem>
            <SelectItem value="completed">완료</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value) => setSortBy(value as InterviewSortBy)}>
          <SelectTrigger className="h-9 w-32">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="endedAt">완료일 순</SelectItem>
            <SelectItem value="startedAt">생성일 순</SelectItem>
            <SelectItem value="score">점수 순</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
          <SelectTrigger className="h-9 w-28">
            <SelectValue placeholder="정렬 순서" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">최신순</SelectItem>
            <SelectItem value="asc">오래된순</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" className="h-9" onClick={resetFilters}>
          초기화
        </Button>
      </div>

      <InterviewsTable sessions={filtered} />
    </motion.div>
  )
}
