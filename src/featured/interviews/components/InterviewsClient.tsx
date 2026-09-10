'use client'

import { motion } from 'framer-motion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Button } from '@/shared/ui/button'
import { SearchInput } from '@/shared/components/SearchInput'
import { MAX_LIST_SEARCH_LENGTH } from '@/shared/lib/validation/listQuery'
import { useInterviews, type InterviewSortBy } from '@/featured/interviews/hooks/useInterviews'
import { INTERVIEW_SORT_OPTIONS, INTERVIEW_STATUS_OPTIONS } from '@/featured/interviews/constants'
import { InterviewsTable } from '@/featured/interviews/components/InterviewsTable'
import type { PaginationMeta, SortOrder } from '@/shared/types/pagination'
import type {
  InterviewListQuery,
  InterviewSession,
  InterviewStatus,
} from '@/featured/interviews/types'

interface InterviewsClientProps {
  initialSessions: InterviewSession[]
  meta: PaginationMeta
  query: InterviewListQuery
  hasLoadError?: boolean
}

export function InterviewsClient({
  initialSessions,
  meta,
  query,
  hasLoadError,
}: InterviewsClientProps) {
  const {
    sessions,
    statusCounts,
    meta: currentMeta,
    hasMore,
    isLoadingMore,
    loadMoreError,
    initialLoadFailed,
    loadMore,
    search,
    setSearch,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    isPending,
    isPaused,
    resetFilters,
    scrollRootRef,
  } = useInterviews({
    initialSessions,
    initialMeta: meta,
    query,
    hasInitialLoadError: hasLoadError,
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
      aria-busy={isPending}
    >
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="text-muted-foreground">
          전체 <span className="text-foreground mr-1 font-semibold">{currentMeta.totalCount}</span>
          건
        </span>
        <span className="text-muted-foreground">
          불러옴 <span className="text-foreground mr-1 font-semibold">{sessions.length}</span>건
        </span>
        <span className="text-muted-foreground">
          완료{' '}
          <span className="mr-1 font-semibold text-green-600 dark:text-green-400">
            {statusCounts.FINISHED ?? 0}
          </span>
          건
        </span>
        <span className="text-muted-foreground">
          일시중지{' '}
          <span className="text-destructive mr-1 font-semibold">{statusCounts.PAUSED ?? 0}</span>건
        </span>
        <span className="text-muted-foreground">
          대기 <span className="mr-1 font-semibold text-gray-500">{statusCounts.READY ?? 0}</span>건
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="닉네임 또는 세션 ID 검색..."
          className="min-w-52 flex-1"
          maxLength={MAX_LIST_SEARCH_LENGTH}
        />

        <Select
          value={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value as InterviewStatus | 'all')}
          disabled={isPending}
        >
          <SelectTrigger className="h-9 w-32">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            {INTERVIEW_STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as InterviewSortBy)}
          disabled={isPending}
        >
          <SelectTrigger className="h-9 w-36">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            {INTERVIEW_SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortOrder}
          onValueChange={(value) => setSortOrder(value as SortOrder)}
          disabled={isPending}
        >
          <SelectTrigger className="h-9 w-28">
            <SelectValue placeholder="정렬 순서" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">내림차순</SelectItem>
            <SelectItem value="asc">오름차순</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          className="h-9"
          onClick={resetFilters}
          disabled={isPending}
        >
          초기화
        </Button>
      </div>

      <div className={isPending ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
        <InterviewsTable
          sessions={sessions}
          scrollContainerRef={scrollRootRef}
          hasMore={hasMore}
          isLoading={isLoadingMore}
          hasError={loadMoreError}
          initialLoadFailed={initialLoadFailed}
          isPaused={isPaused}
          onLoadMore={loadMore}
        />
      </div>
    </motion.div>
  )
}
