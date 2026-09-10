'use client'

import { useState } from 'react'
import type { RefObject } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { QuestionDialog } from './QuestionDialog'
import { deleteQuestionAction } from '@/featured/questions/actions/questions.action'
import { QuestionDeleteDialog } from './QuestionDeleteDialog'
import { InfiniteScrollTrigger } from '@/shared/components/InfiniteScrollTrigger'
import { ListEmptyState } from '@/shared/components/ListEmptyState'
import type { CommonQuestion } from '@/featured/questions/types'

interface QuestionTableProps {
  questions: CommonQuestion[]
  onToggle: (id: string) => Promise<void>
  pendingToggleIds: ReadonlySet<string>
  onRemoved: (id: string) => void
  /** 다이얼로그 수정은 갱신된 항목을 알 수 없어 서버에서 다시 받는다. */
  onEdited: () => void
  initialLoadFailed: boolean
  scrollRootRef: RefObject<HTMLDivElement | null>
  hasMore: boolean
  isLoadingMore: boolean
  isLoadMorePaused?: boolean
  loadMoreError: boolean
  onLoadMore: () => void | Promise<void>
}

export function QuestionTable({
  questions,
  onToggle,
  pendingToggleIds,
  onRemoved,
  onEdited,
  initialLoadFailed,
  scrollRootRef,
  hasMore,
  isLoadingMore,
  isLoadMorePaused = false,
  loadMoreError,
  onLoadMore,
}: QuestionTableProps) {
  const [editTarget, setEditTarget] = useState<CommonQuestion | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CommonQuestion | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    const result = await deleteQuestionAction(deleteTarget.id)
    setIsDeleting(false)
    if (result.success) {
      toast.success('질문이 삭제되었습니다.')
      const removedId = deleteTarget.id
      setDeleteTarget(null)
      onRemoved(removedId)
    } else {
      toast.error(result.error ?? '질문 삭제에 실패했습니다.')
    }
  }

  return (
    <>
      <div className="border-border/60 overflow-hidden rounded-lg border">
        <div
          ref={scrollRootRef}
          className="max-h-140 w-full overflow-auto [scrollbar-gutter:stable]"
        >
          <table className="w-full table-fixed text-sm">
            <colgroup>
              <col />
              <col className="w-40" />
              <col className="w-40" />
              <col className="w-40" />
              <col className="w-24" />
            </colgroup>
            <thead className="bg-muted sticky top-0 z-10">
              <tr>
                <th className="text-muted-foreground px-4 py-3 text-left font-medium">질문 내용</th>
                <th className="text-muted-foreground px-4 py-3 text-center font-medium">상태</th>
                <th className="text-muted-foreground px-4 py-3 text-center font-medium">
                  생성일시
                </th>
                <th className="text-muted-foreground px-4 py-3 text-center font-medium">수정일</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-border/40 bg-background divide-y">
              <AnimatePresence initial={false}>
                {questions.map((question) => (
                  <motion.tr
                    key={question.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    <td className="max-w-md px-4 py-3">
                      <p className="line-clamp-2 leading-relaxed">{question.content}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => onToggle(question.id)}
                        disabled={pendingToggleIds.has(question.id)}
                        aria-busy={pendingToggleIds.has(question.id)}
                        className={cn(
                          'inline-flex h-7 w-20 cursor-pointer items-center justify-center rounded-full text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60',
                          question.isActive
                            ? 'bg-primary/10 text-primary hover:bg-primary/20'
                            : 'bg-muted text-muted-foreground hover:bg-muted/60',
                        )}
                      >
                        {question.isActive ? '활성' : '비활성'}
                      </button>
                    </td>
                    <td className="text-muted-foreground px-4 py-3 text-center">
                      {question.createdAt}
                    </td>
                    <td className="text-muted-foreground px-4 py-3 text-center">
                      {question.updatedAt}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors"
                          onClick={() => setEditTarget(question)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors"
                          onClick={() => setDeleteTarget(question)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {questions.length === 0 && (
            <ListEmptyState
              hasError={initialLoadFailed}
              errorMessage="질문 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
              emptyMessage="조건에 맞는 질문이 없습니다."
            />
          )}

          {/* 조회 실패 시에도 렌더한다. 재시도 버튼이 이 안에 있다. */}
          <InfiniteScrollTrigger
            rootRef={scrollRootRef}
            hasMore={hasMore}
            isLoading={isLoadingMore}
            isPaused={isLoadMorePaused}
            hasError={loadMoreError}
            loadedCount={questions.length}
            onLoadMore={onLoadMore}
          />
        </div>
      </div>

      {editTarget && (
        <QuestionDialog
          question={editTarget}
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          onSuccess={() => {
            setEditTarget(null)
            onEdited()
          }}
        />
      )}

      <QuestionDeleteDialog
        open={!!deleteTarget}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </>
  )
}
