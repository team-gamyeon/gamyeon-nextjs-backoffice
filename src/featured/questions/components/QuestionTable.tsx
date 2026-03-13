'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { QuestionDialog } from './QuestionDialog'
import { updateQuestionAction } from '@/featured/questions/actions/questions.action'
import type { CommonQuestion } from '@/featured/questions/types'

interface QuestionTableProps {
  questions: CommonQuestion[]
  onDelete: (id: string) => void
}

export function QuestionTable({ questions, onDelete }: QuestionTableProps) {
  const [editTarget, setEditTarget] = useState<CommonQuestion | null>(null)

  return (
    <>
      <div className="border-border/60 flex h-full flex-col overflow-hidden rounded-lg border">
        <div className="flex-1 min-h-0 overflow-y-auto [scrollbar-gutter:stable]">
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
                <th className="text-muted-foreground px-4 py-3 text-center font-medium">생성일시</th>
                <th className="text-muted-foreground px-4 py-3 text-center font-medium">수정일</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-border/40 bg-background divide-y">
              <AnimatePresence initial={false}>
                {questions.map((question) => (
                  <motion.tr
                    key={question.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    <td className="max-w-md px-4 py-3">
                      <p className="line-clamp-2 leading-relaxed">{question.content}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => updateQuestionAction(question.id, { status: question.isActive ? 'INACTIVE' : 'ACTIVE' })}
                        className={cn(
                          'inline-flex h-7 w-20 cursor-pointer items-center justify-center rounded-full text-xs font-medium transition-colors',
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
                          onClick={() => onDelete(question.id)}
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
            <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
              등록된 질문이 없습니다.
            </div>
          )}
        </div>
      </div>

      {editTarget && (
        <QuestionDialog
          question={editTarget}
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}
    </>
  )
}
