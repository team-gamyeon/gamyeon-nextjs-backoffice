'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { QuestionForm } from './QuestionForm'
import { createQuestionAction, updateQuestionAction } from '@/featured/questions/actions/questions.action'
import type { CommonQuestion } from '@/featured/questions/types'

interface QuestionDialogProps {
  question?: CommonQuestion
  open: boolean
  onClose: () => void
  onSuccess?: (updated: CommonQuestion) => void
}

export function QuestionDialog({ question, open, onClose, onSuccess }: QuestionDialogProps) {
  const [formData, setFormData] = useState<{
    content: string
    isActive: boolean
  }>({
    content: question?.content ?? '',
    isActive: question?.isActive ?? true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    setIsSubmitting(true)
    setError(null)

    if (!isEdit) {
      const formDataPayload = new FormData()
      formDataPayload.append('content', formData.content)
      formDataPayload.append('status', formData.isActive ? 'ACTIVE' : 'INACTIVE')
      const result = await createQuestionAction(null, formDataPayload)
      setIsSubmitting(false)
      if (!result.success) {
        setError(result.error ?? '질문 생성에 실패했습니다.')
        return
      }
      onClose()
      return
    }

    const result = await updateQuestionAction(question!.id, {
      content: formData.content,
      status: formData.isActive ? 'ACTIVE' : 'INACTIVE',
    })
    setIsSubmitting(false)
    if (!result.success) {
      setError(result.error ?? '질문 수정에 실패했습니다.')
      return
    }
    onSuccess?.({ ...question!, content: formData.content, isActive: formData.isActive })
    onClose()
  }

  const isEdit = !!question

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[90vh] max-w-md flex-col">
        <DialogHeader>
          <DialogTitle>{isEdit ? '질문 수정' : '새 질문 추가'}</DialogTitle>
        </DialogHeader>

        <div className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1">
          <QuestionForm initial={question} onChange={setFormData} />
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            취소
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.content.trim() || isSubmitting}
            className="cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="border-primary-foreground h-3.5 w-3.5 animate-spin rounded-full border-2 border-t-transparent" />
                저장 중...
              </span>
            ) : isEdit ? (
              '저장'
            ) : (
              '질문 추가'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
