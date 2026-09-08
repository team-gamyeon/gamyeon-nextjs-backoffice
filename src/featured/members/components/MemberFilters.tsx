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
  withdrew: '탈퇴',
}

const SORT_LABELS: Record<MemberFiltersState['sortBy'], string> = {
  createdAt: '가입일',
  updatedAt: '최근 활동',
}

const SORT_ORDER_LABELS: Record<MemberFiltersState['sortOrder'], string> = {
  desc: '내림차순',
  asc: '오름차순',
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
            onValueChange={(value) =>
              onFilterChange({ status: value as MemberFiltersState['status'] })
            }
          >
            <DropdownMenuRadioItem value="all">전체 상태</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="active">정상</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="warning">경고</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="suspended">정지</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="withdrew">탈퇴</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 cursor-pointer gap-2">
            <ArrowUpDown className="text-muted-foreground h-3.5 w-3.5" />
            {SORT_LABELS[filters.sortBy]} · {SORT_ORDER_LABELS[filters.sortOrder]}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
            정렬 기준
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={filters.sortBy}
            onValueChange={(value) =>
              onFilterChange({ sortBy: value as MemberFiltersState['sortBy'] })
            }
          >
            <DropdownMenuRadioItem value="createdAt">가입일</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="updatedAt">최근 활동</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
            정렬 순서
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={filters.sortOrder}
            onValueChange={(value) =>
              onFilterChange({ sortOrder: value as MemberFiltersState['sortOrder'] })
            }
          >
            <DropdownMenuRadioItem value="desc">내림차순</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="asc">오름차순</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
