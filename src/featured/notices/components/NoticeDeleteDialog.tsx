import { Button } from '@/shared/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/dialog'

interface NoticeDeleteDialogProps {
  open: boolean
  title: string
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

export function NoticeDeleteDialog({ open, title, isDeleting, onClose, onConfirm }: NoticeDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>공지사항 삭제</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground text-sm">
          <span className="text-foreground font-medium">{title}</span>을(를) 삭제하시겠습니까?
          <br />
          삭제된 공지사항은 복구할 수 없습니다.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="cursor-pointer">
            취소
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting} className="cursor-pointer">
            {isDeleting ? '삭제 중...' : '삭제'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
