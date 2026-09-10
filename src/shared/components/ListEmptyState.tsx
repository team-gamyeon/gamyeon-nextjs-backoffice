import { cn } from '@/shared/lib/utils'

interface ListEmptyStateProps {
  /** 목록이 빈 이유가 조회 실패인지 여부 */
  hasError: boolean
  errorMessage: string
  emptyMessage: string
}

/**
 * 목록이 비었을 때의 안내.
 *
 * 조회 실패를 "결과가 없습니다"로 보여주면 사용자가 필터를 의심하게 된다.
 * 두 경우를 반드시 구분한다.
 */
export function ListEmptyState({ hasError, errorMessage, emptyMessage }: ListEmptyStateProps) {
  return (
    <div
      className={cn(
        'flex h-32 items-center justify-center px-4 text-center text-sm',
        hasError ? 'text-destructive' : 'text-muted-foreground',
      )}
    >
      {hasError ? errorMessage : emptyMessage}
    </div>
  )
}
