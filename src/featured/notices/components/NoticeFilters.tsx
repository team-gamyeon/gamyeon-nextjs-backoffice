'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { SearchInput } from '@/shared/components/SearchInput'
import { MAX_LIST_SEARCH_LENGTH } from '@/shared/lib/validation/listQuery'
import { NOTICE_STATUS_OPTIONS } from '@/featured/notices/constants'
import type { NoticeStatus } from '@/featured/notices/types'

interface NoticeFiltersProps {
  activeTab: NoticeStatus | 'all'
  search: string
  onTabChange: (tab: NoticeStatus | 'all') => void
  onSearchChange: (value: string) => void
  onAdd: () => void
}

export function NoticeFilters({
  activeTab,
  search,
  onTabChange,
  onSearchChange,
  onAdd,
}: NoticeFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as NoticeStatus | 'all')}>
        <TabsList className="h-9">
          <TabsTrigger value="all" className="text-xs">
            전체
          </TabsTrigger>
          {NOTICE_STATUS_OPTIONS.map((option) => (
            <TabsTrigger key={option.value} value={option.value} className="text-xs">
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder="공지사항 제목 검색..."
        className="min-w-48 flex-1"
        maxLength={MAX_LIST_SEARCH_LENGTH}
      />

      <Button size="sm" className="h-9 cursor-pointer gap-1.5" onClick={onAdd}>
        <Plus className="h-4 w-4" />
        공지 추가
      </Button>
    </div>
  )
}
