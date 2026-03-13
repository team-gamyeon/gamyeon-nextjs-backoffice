'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/ui/dialog'
import { Label } from '@/shared/ui/label'
import { Textarea } from '@/shared/ui/textarea'
import { Switch } from '@/shared/ui/switch'
import { cn } from '@/shared/lib/utils'
import { SearchInput } from '@/shared/components/SearchInput'
import type { Notice } from '@/featured/notices/types'

const INITIAL_NOTICES: Notice[] = [
  {
    id: '1',
    title: '서비스 이용약관 개정 안내',
    content:
      '2026년 3월 1일부로 서비스 이용약관이 개정됩니다. 주요 변경 사항은 개인정보 처리 방침 강화 및 AI 면접 데이터 보관 기간 조정입니다.',
    isActive: true,
    createdAt: '2026.02.20',
    updatedAt: '2026.02.20',
  },
  {
    id: '2',
    title: '2월 정기 점검 안내 (완료)',
    content:
      '2026년 2월 15일 오전 2시~4시 정기 서버 점검이 진행되었습니다. 현재 서비스가 정상 운영 중입니다.',
    isActive: false,
    createdAt: '2026.02.13',
    updatedAt: '2026.02.15',
  },
  {
    id: '3',
    title: 'AI 리포트 기능 출시 안내',
    content:
      '면접 종료 후 AI가 분석한 맞춤형 리포트를 확인할 수 있는 새 기능이 출시되었습니다. 마이페이지에서 확인해보세요.',
    isActive: true,
    createdAt: '2026.02.01',
    updatedAt: '2026.02.01',
  },
  {
    id: '4',
    title: '신규 직군 질문 추가 안내',
    content:
      '데이터 분석, AI/ML 엔지니어 직군의 면접 질문 세트가 추가되었습니다. 더욱 다양한 직군에 맞는 면접을 경험해보세요.',
    isActive: true,
    createdAt: '2026.01.15',
    updatedAt: '2026.01.15',
  },
  {
    id: '5',
    title: '연말 서비스 점검 안내 (완료)',
    content: '2025년 12월 31일 오후 11시~자정 연말 서버 점검이 진행되었습니다.',
    isActive: false,
    createdAt: '2025.12.29',
    updatedAt: '2025.12.31',
  },
]

interface NoticeDialogProps {
  open: boolean
  notice?: Notice
  onClose: () => void
  onSave: (data: { title: string; content: string; isActive: boolean }) => void
}

function NoticeDialog({ open, notice, onClose, onSave }: NoticeDialogProps) {
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

export function NoticesClient() {
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'inactive'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Notice | undefined>(undefined)

  const filtered = useMemo(() => {
    return notices.filter((notice) => {
      if (search && !notice.title.toLowerCase().includes(search.toLowerCase())) return false
      if (activeTab === 'active' && !notice.isActive) return false
      if (activeTab === 'inactive' && notice.isActive) return false
      return true
    })
  }, [notices, search, activeTab])

  const handleToggle = (id: string) => {
    setNotices((prev) => prev.map((notice) => (notice.id === id ? { ...notice, isActive: !notice.isActive } : notice)))
  }

  const handleDelete = (id: string) => {
    setNotices((prev) => prev.filter((notice) => notice.id !== id))
    if (expandedId === id) setExpandedId(null)
  }

  const handleEdit = (notice: Notice) => {
    setEditTarget(notice)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setEditTarget(undefined)
    setDialogOpen(true)
  }

  const handleSave = (data: { title: string; content: string; isActive: boolean }) => {
    if (editTarget) {
      setNotices((prev) =>
        prev.map((notice) => (notice.id === editTarget.id ? { ...notice, ...data, updatedAt: '2026.03.07' } : notice)),
      )
    } else {
      const newNotice: Notice = {
        id: String(Date.now()),
        ...data,
        createdAt: '2026.03.07',
        updatedAt: '2026.03.07',
      }
      setNotices((prev) => [newNotice, ...prev])
    }
  }

  const activeCount = notices.filter((notice) => notice.isActive).length
  const inactiveCount = notices.filter((notice) => !notice.isActive).length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-foreground">
          전체 <span className="text-foreground mr-1 font-semibold">{notices.length}</span>개
        </span>
        <span className="text-muted-foreground">
          활성 <span className="text-primary mr-1 font-semibold">{activeCount}</span>개
        </span>
        <span className="text-muted-foreground">
          비활성 <span className="mr-1 font-semibold text-gray-500">{inactiveCount}</span>개
        </span>
      </div>

      {/* Filters + Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <TabsList className="h-9">
            <TabsTrigger value="all" className="text-xs">
              전체
            </TabsTrigger>
            <TabsTrigger value="active" className="text-xs">
              활성
            </TabsTrigger>
            <TabsTrigger value="inactive" className="text-xs">
              비활성
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="공지사항 제목 검색..."
          className="min-w-48 flex-1"
        />

        <Button size="sm" className="h-9 cursor-pointer gap-1.5" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          공지 추가
        </Button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <p className="text-muted-foreground py-10 text-center text-sm">공지사항이 없습니다.</p>
        )}
        {filtered.map((notice, index) => {
          const isExpanded = expandedId === notice.id
          return (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="border-border/60 bg-card rounded-lg border"
            >
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : notice.id)}
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 pr-4 text-left"
                >
                  {isExpanded ? (
                    <ChevronUp className="text-muted-foreground h-4 w-4 shrink-0" />
                  ) : (
                    <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0" />
                  )}
                  <span className="truncate text-sm font-medium">{notice.title}</span>
                </button>
                <div className="flex shrink-0 items-center gap-6 sm:gap-8">
                  <span className="text-muted-foreground w-24 text-center text-xs">
                    {notice.createdAt}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggle(notice.id)}
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
                      onClick={() => handleEdit(notice)}
                      className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors"
                      title="수정"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(notice.id)}
                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded content */}
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
                      <p className="text-muted-foreground/60 mt-2 text-xs">
                        최종 수정: {notice.updatedAt}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      <NoticeDialog
        key={editTarget?.id ?? 'new'}
        open={dialogOpen}
        notice={editTarget}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />
    </motion.div>
  )
}
