'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { Notice } from '@/featured/notices/types'

interface NoticeTableProps {
  notices: Notice[]
  onToggle: (id: string) => void
  onEdit: (notice: Notice) => void
  onDelete: (id: string) => void
}

export function NoticeTable({ notices, onToggle, onEdit, onDelete }: NoticeTableProps) {
  return (
    <div className="border-border/60 flex h-full flex-col overflow-hidden rounded-lg border">
      <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-gutter:stable]">
        <table className="w-full table-fixed text-sm">
          <colgroup>
            <col className="w-[30%]" />
            <col />
            <col className="w-28" />
            <col className="w-32" />
            <col className="w-20" />
          </colgroup>
          <thead className="bg-muted sticky top-0 z-10">
            <tr>
              <th className="text-muted-foreground px-4 py-3 text-left font-medium">제목</th>
              <th className="text-muted-foreground px-4 py-3 text-left font-medium">내용</th>
              <th className="text-muted-foreground px-4 py-3 text-center font-medium">상태</th>
              <th className="text-muted-foreground px-4 py-3 text-center font-medium">생성일</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-border/40 bg-background divide-y">
            <AnimatePresence initial={false}>
              {notices.map((notice) => (
                <motion.tr
                  key={notice.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="group hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3 font-medium">
                    <p className="truncate">{notice.title}</p>
                  </td>
                  <td className="text-muted-foreground px-4 py-3">
                    <p className="line-clamp-2 leading-relaxed">{notice.content || '-'}</p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => onToggle(notice.id)}
                      className={cn(
                        'inline-flex h-7 w-20 cursor-pointer items-center justify-center rounded-full text-xs font-medium transition-colors',
                        notice.isActive
                          ? 'bg-primary/10 text-primary hover:bg-primary/20'
                          : 'bg-muted text-muted-foreground hover:bg-muted/60',
                      )}
                    >
                      {notice.isActive ? '활성' : '비활성'}
                    </button>
                  </td>
                  <td className="text-muted-foreground px-4 py-3 text-center">
                    {notice.createdAt}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(notice)}
                        className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors"
                        title="수정"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(notice.id)}
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors"
                        title="삭제"
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

        {notices.length === 0 && (
          <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
            공지사항이 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}
