'use client'

import { Filter, ArrowUpDown } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { SearchInput } from '@/shared/components/SearchInput'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/shared/ui/dropdown-menu'
import type { MemberFiltersState } from '@/featured/members/types'

const STATUS_LABELS: Record<MemberFiltersState['status'], string> = {
  all: '전체 상태',
  active: '정상',
  warning: '경고',
  suspended: '정지',
}

const SORT_LABELS: Record<MemberFiltersState['sortBy'], string> = {
  joinedAt: '가입일',
  lastActiveAt: '최근 활동',
  sessionCount: '세션 수',
}

interface MemberFiltersProps {
  filters: MemberFiltersState
  onFilterChange: (filters: Partial<MemberFiltersState>) => void
}

export function MemberFilters({ filters, onFilterChange }: MemberFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <SearchInput
        value={filters.search}
        onChange={(value) => onFilterChange({ search: value })}
        placeholder="닉네임 또는 이메일 검색..."
        className="min-w-52 flex-1"
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 cursor-pointer gap-2">
            <Filter className="text-muted-foreground h-3.5 w-3.5" />
            {STATUS_LABELS[filters.status]}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-36">
          <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
            상태 필터
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={filters.status}
            onValueChange={(v) => onFilterChange({ status: v as MemberFiltersState['status'] })}
          >
            <DropdownMenuRadioItem value="all">전체 상태</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="active">정상</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="warning">경고</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="suspended">정지</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 cursor-pointer gap-2">
            <ArrowUpDown className="text-muted-foreground h-3.5 w-3.5" />
            {SORT_LABELS[filters.sortBy]}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-36">
          <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
            정렬 기준
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={filters.sortBy}
            onValueChange={(v) => onFilterChange({ sortBy: v as MemberFiltersState['sortBy'] })}
          >
            <DropdownMenuRadioItem value="joinedAt">가입일</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="lastActiveAt">최근 활동</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="sessionCount">세션 수</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
