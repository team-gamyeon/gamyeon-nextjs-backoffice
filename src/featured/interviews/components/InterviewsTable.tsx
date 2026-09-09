import type { RefObject } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/shared/ui/badge'
import { InfiniteScrollTrigger } from '@/shared/components/InfiniteScrollTrigger'
import { ListEmptyState } from '@/shared/components/ListEmptyState'
import { formatDuration } from '@/shared/lib/utils/formatDuration'
import type { InterviewSession } from '@/featured/interviews/types'

const STATUS_LABEL: Record<
  InterviewSession['status'],
  {
    label: string
    variant: 'destructive' | 'default' | 'secondary' | 'outline'
    className?: string
  }
> = {
  READY: { label: '대기', variant: 'outline' },
  IN_PROGRESS: { label: '진행 중', variant: 'default' },
  PAUSED: { label: '일시중지', variant: 'destructive' },
  FINISHED: {
    label: '완료',
    variant: 'secondary',
    className: 'bg-green-600 text-white dark:bg-green-400 dark:text-white',
  },
}

interface InterviewsTableProps {
  sessions: InterviewSession[]
  scrollContainerRef: RefObject<HTMLDivElement | null>
  hasMore: boolean
  isLoading: boolean
  hasError: boolean
  initialLoadFailed: boolean
  isPaused?: boolean
  onLoadMore: () => void | Promise<void>
}

export function InterviewsTable({
  sessions,
  scrollContainerRef,
  hasMore,
  isLoading,
  hasError,
  initialLoadFailed,
  isPaused,
  onLoadMore,
}: InterviewsTableProps) {
  return (
    <div className="border-border/60 overflow-hidden rounded-lg border">
      <div
        ref={scrollContainerRef}
        className="max-h-140 w-full overflow-auto [scrollbar-gutter:stable]"
      >
        <table className="w-full min-w-200 text-sm">
          <thead className="bg-muted sticky top-0 z-10">
            <tr>
              <th className="text-muted-foreground w-[10%] px-6 py-4 text-center font-medium">
                인터뷰 ID
              </th>
              <th className="text-muted-foreground w-[14%] px-6 py-4 text-left font-medium">
                유저
              </th>
              <th className="text-muted-foreground w-[24%] px-6 py-4 text-left font-medium">
                면접 제목
              </th>
              <th className="text-muted-foreground w-[10%] px-6 py-4 text-center font-medium">
                상태
              </th>
              <th className="text-muted-foreground w-[14%] px-6 py-4 text-center font-medium">
                생성일시
              </th>
              <th className="text-muted-foreground w-[14%] px-6 py-4 text-center font-medium">
                시작일시
              </th>
              <th className="text-muted-foreground w-[14%] px-6 py-4 text-center font-medium">
                진행 시간
              </th>
            </tr>
          </thead>
          <tbody className="divide-border/40 bg-background divide-y">
            {sessions.map((session) => (
              <motion.tr
                key={session.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="truncate px-6 py-3 text-center">
                  <span className="text-muted-foreground font-mono text-xs">#{session.id}</span>
                </td>

                <td className="truncate px-6 py-3 font-medium">{session.userNickname}</td>

                <td className="text-muted-foreground truncate px-6 py-3">{session.intvTitle}</td>

                <td className="px-6 py-3 text-center">
                  <div className="flex justify-center">
                    <Badge
                      variant={STATUS_LABEL[session.status].variant}
                      className={`text-xs ${STATUS_LABEL[session.status].className ?? ''}`}
                    >
                      {STATUS_LABEL[session.status].label}
                    </Badge>
                  </div>
                </td>

                <td className="text-muted-foreground truncate px-6 py-3 text-center">
                  {session.createdAt}
                </td>

                <td className="text-muted-foreground truncate px-6 py-3 text-center">
                  {session.startedAt ?? '—'}
                </td>

                <td className="text-muted-foreground truncate px-6 py-3 text-center">
                  {formatDuration(session.durationSec)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {sessions.length === 0 && (
          <ListEmptyState
            hasError={initialLoadFailed}
            errorMessage="면접 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
            emptyMessage="검색 결과가 없습니다."
          />
        )}
        <InfiniteScrollTrigger
          rootRef={scrollContainerRef}
          hasMore={hasMore}
          isLoading={isLoading}
          hasError={hasError}
          isPaused={isPaused}
          loadedCount={sessions.length}
          onLoadMore={onLoadMore}
        />
      </div>
    </div>
  )
}
