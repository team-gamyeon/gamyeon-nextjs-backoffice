"use client";

import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/shared/ui/dropdown-menu";
import type { MemberFiltersState } from "@/featured/members/types";

const STATUS_LABELS: Record<MemberFiltersState["status"], string> = {
  all: "전체 상태",
  active: "정상",
  warning: "경고",
  suspended: "정지",
};

const SORT_LABELS: Record<MemberFiltersState["sortBy"], string> = {
  joinedAt: "가입일",
  lastActiveAt: "최근 활동",
  sessionCount: "세션 수",
};

interface MemberFiltersProps {
  filters: MemberFiltersState;
  onFilterChange: (filters: Partial<MemberFiltersState>) => void;
}

export function MemberFilters({ filters, onFilterChange }: MemberFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-52">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="닉네임 또는 이메일 검색..."
          className="pl-9 h-9"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
        />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-2 cursor-pointer">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            {STATUS_LABELS[filters.status]}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-36">
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
            상태 필터
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={filters.status}
            onValueChange={(v) =>
              onFilterChange({ status: v as MemberFiltersState["status"] })
            }
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
          <Button variant="outline" size="sm" className="h-9 gap-2 cursor-pointer">
            <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
            {SORT_LABELS[filters.sortBy]}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-36">
          <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
            정렬 기준
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={filters.sortBy}
            onValueChange={(v) =>
              onFilterChange({ sortBy: v as MemberFiltersState["sortBy"] })
            }
          >
            <DropdownMenuRadioItem value="joinedAt">가입일</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="lastActiveAt">최근 활동</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="sessionCount">세션 수</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
