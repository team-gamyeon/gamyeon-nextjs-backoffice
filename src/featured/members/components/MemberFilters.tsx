"use client";

import { Search, Filter } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import type { MemberFiltersState } from "@/featured/members/types";

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

      <Select
        value={filters.status}
        onValueChange={(v) =>
          onFilterChange({ status: v as MemberFiltersState["status"] })
        }
      >
        <SelectTrigger className="h-9 w-36">
          <Filter className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
          <SelectValue placeholder="상태 필터" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 상태</SelectItem>
          <SelectItem value="active">정상</SelectItem>
          <SelectItem value="warning">경고</SelectItem>
          <SelectItem value="suspended">정지</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.sortBy}
        onValueChange={(v) =>
          onFilterChange({ sortBy: v as MemberFiltersState["sortBy"] })
        }
      >
        <SelectTrigger className="h-9 w-36">
          <SelectValue placeholder="정렬 기준" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="joinedAt">가입일</SelectItem>
          <SelectItem value="lastActiveAt">최근 활동</SelectItem>
          <SelectItem value="sessionCount">세션 수</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="sm"
        className="h-9"
        onClick={() =>
          onFilterChange({
            search: "",
            status: "all",
            sortBy: "joinedAt",
            sortOrder: "desc",
          })
        }
      >
        초기화
      </Button>
    </div>
  );
}
