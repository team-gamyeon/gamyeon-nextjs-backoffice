'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { Notice } from '@/featured/notices/types'
import { NOTICE_CATEGORY } from '@/featured/notices/constants'
import { NoticeDeleteDialog } from '@/featured/notices/components/NoticeDeleteDialog'

interface NoticeListItemProps {
  notice: Notice
  index: number
  isExpanded: boolean
  onToggleExpand: () => void
  onToggle: (id: string) => Promise<void>
  onEdit: (notice: Notice) => void
  onDelete: (id: string) => Promise<void>
}

export function NoticeListItem({
  notice,
  index,
  isExpanded,
  onToggleExpand,
  onToggle,
  onEdit,
  onDelete,
}: NoticeListItemProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteConfirm = async () => {
    setIsDeleting(true)
    await onDelete(notice.id)
    setIsDeleting(false)
    setConfirmOpen(false)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04 }}
        className="border-border/60 bg-card rounded-lg border"
      >
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <button
            type="button"
            onClick={onToggleExpand}
            className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 pr-4 text-left"
          >
            {isExpanded ? (
              <ChevronUp className="text-muted-foreground h-4 w-4 shrink-0" />
            ) : (
              <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0" />
            )}
            <span className={cn('shrink-0 rounded px-1.5 py-0.5 text-xs font-medium', NOTICE_CATEGORY[notice.category].color)}>
              {NOTICE_CATEGORY[notice.category].label}
            </span>
            <span className="truncate text-sm font-medium">{notice.title}</span>
          </button>
          <div className="flex shrink-0 items-center gap-6 sm:gap-8">
            <span className="text-muted-foreground w-24 text-center text-xs">{notice.createdAt}</span>
            <button
              type="button"
              onClick={() => onToggle(notice.id)}
              className={cn(
                'inline-flex h-7 w-20 shrink-0 cursor-pointer items-center justify-center rounded-full text-xs font-medium transition-colors',
                notice.isActive
                  ? 'bg-primary/10 text-primary hover:bg-primary/20'
                  : 'bg-muted text-muted-foreground hover:bg-muted/60',
              )}
            >
              {notice.isActive ? '활성' : '비활성'}
            </button>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onEdit(notice)}
                className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors"
                title="수정"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors"
                title="삭제"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border-border/60 border-t px-4 py-3">
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {notice.content || '내용이 없습니다.'}
                </p>
                <p className="text-muted-foreground/60 mt-2 text-xs">최종 수정: {notice.updatedAt}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <NoticeDeleteDialog
        open={confirmOpen}
        title={notice.title}
        isDeleting={isDeleting}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  )
}
