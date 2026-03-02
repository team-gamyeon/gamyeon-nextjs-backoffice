"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SessionFilters } from "./SessionFilters";
import { SessionTable } from "./SessionTable";
import type { InterviewSession, SessionFiltersState } from "@/featured/sessions/types";

const MOCK_SESSIONS: InterviewSession[] = [
  {
    id: "4901",
    userId: "4",
    userNickname: "최유진",
    jobCategory: "PM",
    status: "completed",
    questionCount: 5,
    answeredCount: 5,
    score: 88,
    durationSec: 1842,
    startedAt: "2026.02.27 14:32",
    endedAt: "2026.02.27 15:03",
  },
  {
    id: "4900",
    userId: "1",
    userNickname: "김민준",
    jobCategory: "프론트엔드",
    status: "completed",
    questionCount: 5,
    answeredCount: 5,
    score: 74,
    durationSec: 2214,
    startedAt: "2026.02.27 13:10",
    endedAt: "2026.02.27 13:47",
  },
  {
    id: "4899",
    userId: "6",
    userNickname: "강도윤",
    jobCategory: "백엔드",
    status: "in_progress",
    questionCount: 5,
    answeredCount: 3,
    durationSec: 920,
    startedAt: "2026.02.27 15:45",
  },
  {
    id: "4898",
    userId: "2",
    userNickname: "이서연",
    jobCategory: "백엔드",
    status: "completed",
    questionCount: 5,
    answeredCount: 5,
    score: 92,
    durationSec: 1560,
    startedAt: "2026.02.26 10:20",
    endedAt: "2026.02.26 10:46",
  },
  {
    id: "4897",
    userId: "7",
    userNickname: "윤하은",
    jobCategory: "디자이너",
    status: "abandoned",
    questionCount: 5,
    answeredCount: 2,
    durationSec: 480,
    startedAt: "2026.02.26 16:00",
  },
  {
    id: "4896",
    userId: "8",
    userNickname: "임서준",
    jobCategory: "데이터 분석",
    status: "completed",
    questionCount: 5,
    answeredCount: 5,
    score: 61,
    durationSec: 2760,
    startedAt: "2026.02.25 09:15",
    endedAt: "2026.02.25 09:46",
  },
  {
    id: "4895",
    userId: "3",
    userNickname: "박준혁",
    jobCategory: "풀스택",
    status: "abandoned",
    questionCount: 5,
    answeredCount: 1,
    durationSec: 190,
    startedAt: "2026.02.24 20:30",
  },
  {
    id: "4894",
    userId: "4",
    userNickname: "최유진",
    jobCategory: "PM",
    status: "completed",
    questionCount: 5,
    answeredCount: 5,
    score: 79,
    durationSec: 1980,
    startedAt: "2026.02.24 11:00",
    endedAt: "2026.02.24 11:33",
  },
];

export function SessionsClient() {
  const [filters, setFilters] = useState<SessionFiltersState>({
    search: "",
    status: "all",
    jobCategory: "전체",
    sortBy: "startedAt",
    sortOrder: "desc",
  });

  const filtered = useMemo(() => {
    let result = [...MOCK_SESSIONS];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.userNickname.toLowerCase().includes(q) ||
          s.id.includes(q)
      );
    }

    if (filters.status !== "all") {
      result = result.filter((s) => s.status === filters.status);
    }

    if (filters.jobCategory !== "전체") {
      result = result.filter((s) => s.jobCategory === filters.jobCategory);
    }

    result.sort((a, b) => {
      const aVal = a[filters.sortBy] ?? 0;
      const bVal = b[filters.sortBy] ?? 0;
      const mul = filters.sortOrder === "desc" ? -1 : 1;
      return aVal > bVal ? mul : -mul;
    });

    return result;
  }, [filters]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          총{" "}
          <span className="font-semibold text-foreground">{filtered.length}</span>
          개의 세션
        </p>
      </div>

      <SessionFilters filters={filters} onFilterChange={(p) => setFilters((prev) => ({ ...prev, ...p }))} />
      <SessionTable sessions={filtered} />
    </motion.div>
  );
}
