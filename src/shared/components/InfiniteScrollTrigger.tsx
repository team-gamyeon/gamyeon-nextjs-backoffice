'use client'

import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'

interface InfiniteScrollTriggerProps {
  rootRef: RefObject<HTMLElement | null>
  hasMore: boolean
  isLoading: boolean
  isPaused?: boolean
  hasError?: boolean
  loadedCount: number
  onLoadMore: () => void | Promise<void>
}

export function InfiniteScrollTrigger({
  rootRef,
  hasMore,
  isLoading,
  isPaused = false,
  hasError = false,
  loadedCount,
  onLoadMore,
}: InfiniteScrollTriggerProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const sentinel = sentinelRef.current
    if (!root || !sentinel || !hasMore || isLoading || isPaused || hasError) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void onLoadMore()
      },
      { root, rootMargin: '120px 0px', threshold: 0.01 },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasError, hasMore, isLoading, isPaused, onLoadMore, rootRef])

  return (
    <div
      className="relative flex min-h-12 items-center justify-center px-3 py-2 text-center"
      aria-live="polite"
    >
      {hasMore && (
        <div ref={sentinelRef} className="absolute inset-x-0 top-0 h-px" aria-hidden="true" />
      )}
      {isPaused ? null : isLoading ? (
        <p className="text-muted-foreground flex items-center gap-2 text-xs" role="status">
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          추가 항목을 불러오는 중입니다.
        </p>
      ) : hasError ? (
        <Button type="button" variant="ghost" size="sm" onClick={() => void onLoadMore()}>
          다시 불러오기
        </Button>
      ) : !hasMore && loadedCount > 0 ? (
        <p className="text-muted-foreground text-xs">모든 항목을 불러왔습니다.</p>
      ) : null}
    </div>
  )
}
