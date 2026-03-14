'use client'

import { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/dialog'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { Switch } from '@/shared/ui/switch'
import type { Notice } from '@/featured/notices/types'

interface NoticeDialogProps {
  open: boolean
  notice?: Notice
  onClose: () => void
  onSave: (data: { title: string; content: string; isActive: boolean }) => void
}

export function NoticeDialog({ open, notice, onClose, onSave }: NoticeDialogProps) {
  const [title, setTitle] = useState(notice?.title ?? '')
  const [content, setContent] = useState(notice?.content ?? '')
  const [isActive, setIsActive] = useState(notice?.isActive ?? false)

  const handleSave = () => {
    if (!title.trim()) return
    onSave({ title: title.trim(), content: content.trim(), isActive })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{notice ? '공지사항 수정' : '공지사항 추가'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="notice-title">제목</Label>
            <Input
              id="notice-title"
              placeholder="공지사항 제목을 입력하세요"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notice-content">내용</Label>
            <Textarea
              id="notice-content"
              placeholder="공지사항 내용을 입력하세요"
              rows={5}
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
          </div>
          <div className="border-border/60 flex items-center justify-between rounded-lg border px-4 py-3">
            <div>
              <p className="text-sm font-medium">공지 활성화</p>
              <p className="text-muted-foreground text-xs">
                비활성화 시 유저에게 노출되지 않습니다
              </p>
            </div>
            <Switch id="notice-active" checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="cursor-pointer">
            취소
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()} className="cursor-pointer">
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
