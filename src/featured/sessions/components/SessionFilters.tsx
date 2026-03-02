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
import type { SessionFiltersState } from "@/featured/sessions/types";

const JOB_CATEGORIES = [
  "전체",
  "프론트엔드",
  "백엔드",
  "풀스택",
  "데이터 분석",
  "PM",
  "디자이너",
  "DevOps",
];

interface SessionFiltersProps {
  filters: SessionFiltersState;
  onFilterChange: (partial: Partial<SessionFiltersState>) => void;
}

export function SessionFilters({ filters, onFilterChange }: SessionFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-52">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="닉네임 또는 세션 ID 검색..."
          className="pl-9 h-9"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
        />
      </div>

      <Select
        value={filters.status}
        onValueChange={(v) =>
          onFilterChange({ status: v as SessionFiltersState["status"] })
        }
      >
        <SelectTrigger className="h-9 w-36">
          <Filter className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
          <SelectValue placeholder="상태" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 상태</SelectItem>
          <SelectItem value="completed">완료</SelectItem>
          <SelectItem value="in_progress">진행중</SelectItem>
          <SelectItem value="abandoned">이탈</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.jobCategory}
        onValueChange={(v) => onFilterChange({ jobCategory: v })}
      >
        <SelectTrigger className="h-9 w-36">
          <SelectValue placeholder="직군" />
        </SelectTrigger>
        <SelectContent>
          {JOB_CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.sortBy}
        onValueChange={(v) =>
          onFilterChange({ sortBy: v as SessionFiltersState["sortBy"] })
        }
      >
        <SelectTrigger className="h-9 w-36">
          <SelectValue placeholder="정렬" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="startedAt">시작일시</SelectItem>
          <SelectItem value="score">점수</SelectItem>
          <SelectItem value="durationSec">소요 시간</SelectItem>
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
            jobCategory: "전체",
            sortBy: "startedAt",
            sortOrder: "desc",
          })
        }
      >
        초기화
      </Button>
    </div>
  );
}
