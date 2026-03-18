'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/dialog'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { Switch } from '@/shared/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { createNoticeAction, updateNoticeAction } from '@/featured/notices/actions/notices.action'
import { NOTICE_CATEGORY } from '@/featured/notices/constants'
import type { Notice, NoticeCategory } from '@/featured/notices/types'

interface NoticeDialogProps {
  open: boolean
  notice?: Notice
  onClose: () => void
  onSave: () => void
}

export function NoticeDialog({ open, notice, onClose, onSave }: NoticeDialogProps) {
  const [title, setTitle] = useState(notice?.title ?? '')
  const [content, setContent] = useState(notice?.content ?? '')
  const [isActive, setIsActive] = useState(notice?.isActive ?? false)
  const [category, setCategory] = useState<NoticeCategory>(notice?.category ?? 'NOTICE')
  const [isLoading, setIsLoading] = useState(false)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return
    const target = e.target as HTMLElement
    const isInput = target.tagName === 'INPUT'
    const isTextarea = target.tagName === 'TEXTAREA'
    if (!isInput && !isTextarea) return
    if (isTextarea && !(e.ctrlKey || e.metaKey)) return
    if (!title.trim() || isLoading) return
    e.preventDefault()
    handleSave()
  }

  const handleSave = async () => {
    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()
    if (!trimmedTitle) return
    setIsLoading(true)
    const result = notice
      ? await updateNoticeAction(Number(notice.id), {
          title: trimmedTitle,
          content: trimmedContent,
          category,
        })
      : await createNoticeAction({ title: trimmedTitle, content: trimmedContent, category })
    setIsLoading(false)
    if (!result.success) {
      toast.error(notice ? '공지사항 수정에 실패했습니다.' : '공지사항 생성에 실패했습니다.')
      return
    }
    toast.success(notice ? '공지사항이 수정되었습니다.' : '공지사항이 생성되었습니다.')
    onSave()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="flex max-h-[90vh] max-w-lg flex-col">
        <DialogHeader>
          <DialogTitle>{notice ? '공지사항 수정' : '공지사항 추가'}</DialogTitle>
        </DialogHeader>
        <div className="-mx-1 min-h-0 flex-1 space-y-4 overflow-y-auto px-1 py-2" onKeyDown={handleKeyDown}>
          <div className="space-y-1.5">
            <Label htmlFor="notice-title">제목</Label>
            <div className="flex items-center gap-2">
              <Select value={category} onValueChange={(v) => setCategory(v as NoticeCategory)}>
                <SelectTrigger className="w-auto shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(NOTICE_CATEGORY) as NoticeCategory[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs font-medium ${NOTICE_CATEGORY[key].color}`}
                      >
                        {NOTICE_CATEGORY[key].label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="notice-title"
                placeholder="공지사항 제목을 입력하세요"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notice-content">내용</Label>
            <Textarea
              id="notice-content"
              placeholder="공지사항 내용을 입력하세요"
              rows={5}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="resize-none overflow-y-auto"
            />
          </div>
          <div className="border-border/60 flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <p className="text-sm font-medium">공지 활성화</p>
              <p className="text-muted-foreground text-xs">
                비활성화 시 유저에게 노출되지 않습니다
              </p>
            </div>
            <Switch
              id="notice-active"
              className="cursor-pointer"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="cursor-pointer">
            취소
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim() || isLoading}
            className="cursor-pointer"
          >
            {isLoading ? (notice ? '저장 중...' : '생성 중...') : notice ? '저장' : '생성'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
