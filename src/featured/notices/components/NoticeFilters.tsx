'use client'

import { Plus } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { SearchInput } from '@/shared/components/SearchInput'

type ActiveTab = 'all' | 'active' | 'inactive'

interface NoticeFiltersProps {
  activeTab: ActiveTab
  search: string
  onTabChange: (tab: ActiveTab) => void
  onSearchChange: (value: string) => void
  onAdd: () => void
}

export function NoticeFilters({ activeTab, search, onTabChange, onSearchChange, onAdd }: NoticeFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as ActiveTab)}>
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
        onChange={onSearchChange}
        placeholder="공지사항 제목 검색..."
        className="min-w-48 flex-1"
      />

      <Button size="sm" className="h-9 cursor-pointer gap-1.5" onClick={onAdd}>
        <Plus className="h-4 w-4" />
        공지 추가
      </Button>
    </div>
  )
}
