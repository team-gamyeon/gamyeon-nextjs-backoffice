"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MemberFilters } from "./MemberFilters";
import { MemberTable } from "./MemberTable";
import type { Member, MemberFiltersState } from "@/featured/members/types";

const MOCK_MEMBERS: Member[] = [
  {
    id: "1",
    nickname: "김민준",
    email: "minjun.kim@example.com",
    passwordHash: "$2b$12$LxZaHvM9kGPzJ3qNwRsYuOcVbDtFnEpAoKXiW5ShlYmQ8rTg6uE4K",
    status: "active",
    joinedAt: "2026.01.05",
    lastActiveAt: "2026.02.27",
    sessionCount: 24,
    sanctionHistory: [],
  },
  {
    id: "2",
    nickname: "이서연",
    email: "seoyeon.lee@example.com",
    passwordHash: "$2b$12$PmNqR7vLwCsXkEoUyHaBfIjDzGtVeN8ApKLXb5ShlYmQ8rTg6uE4K",
    status: "active",
    joinedAt: "2026.01.12",
    lastActiveAt: "2026.02.26",
    sessionCount: 18,
    sanctionHistory: [],
  },
  {
    id: "3",
    nickname: "박준혁",
    email: "junhyuk.park@example.com",
    passwordHash: "$2b$12$QnOsS8wMxDtYlFpVzIbCgJkEaHuWfO9BqLMYc6TilZnR9sTh7vF5L",
    status: "warning",
    joinedAt: "2025.12.20",
    lastActiveAt: "2026.02.24",
    sessionCount: 7,
    sanctionHistory: [
      {
        id: "s1",
        type: "warning",
        reason: "스팸성 반복 사용",
        adminNote: "동일 질문으로 10회 이상 반복 시도",
        createdAt: "2026.02.20",
      },
    ],
  },
  {
    id: "4",
    nickname: "최유진",
    email: "yujin.choi@example.com",
    passwordHash: "$2b$12$RoTtU9xNyEuZmGqWaJcDhKlFbIvXgP0CrMNZd7UjmAoS0tUi8wG6M",
    status: "active",
    joinedAt: "2026.02.01",
    lastActiveAt: "2026.02.27",
    sessionCount: 31,
    sanctionHistory: [],
  },
  {
    id: "5",
    nickname: "정다현",
    email: "dahyun.jung@example.com",
    passwordHash: "$2b$12$SpUuV0yOzFvAnHrXbKdEiLmGcJwYhQ1DsNOAe8VknBpT1uVj9xH7N",
    status: "suspended",
    joinedAt: "2025.11.15",
    lastActiveAt: "2026.02.10",
    sessionCount: 3,
    sanctionHistory: [
      {
        id: "s2",
        type: "warning",
        reason: "부적절한 언어 사용",
        adminNote: "",
        createdAt: "2026.01.25",
      },
      {
        id: "s3",
        type: "suspended",
        reason: "반복적인 약관 위반",
        adminNote: "2차 위반으로 7일 정지",
        createdAt: "2026.02.05",
        expiresAt: "2026.02.12",
      },
    ],
  },
  {
    id: "6",
    nickname: "강도윤",
    email: "doyun.kang@example.com",
    passwordHash: "$2b$12$TqVvW1zPaGwBoIsYcLeJjMnHdKxZiR2EtOPBf9WloCoU2vWk0yI8O",
    status: "active",
    joinedAt: "2026.02.14",
    lastActiveAt: "2026.02.27",
    sessionCount: 12,
    sanctionHistory: [],
  },
  {
    id: "7",
    nickname: "윤하은",
    email: "haeun.yoon@example.com",
    passwordHash: "$2b$12$UrWwX2aQbHxCpJtZdMfKkNoIeLayJs3FuPQCg0XmpDpV3wXl1zJ9P",
    status: "active",
    joinedAt: "2026.01.28",
    lastActiveAt: "2026.02.25",
    sessionCount: 9,
    sanctionHistory: [],
  },
  {
    id: "8",
    nickname: "임서준",
    email: "seojun.lim@example.com",
    passwordHash: "$2b$12$VsXxY3bRcIyDqKuAeNgLlOpJfMbzKt4GvQRDh1YnqEqW4xYm2aK0Q",
    status: "warning",
    joinedAt: "2025.12.05",
    lastActiveAt: "2026.02.22",
    sessionCount: 5,
    sanctionHistory: [
      {
        id: "s4",
        type: "warning",
        reason: "시스템 남용 의심",
        adminNote: "비정상적인 API 호출 패턴",
        createdAt: "2026.02.15",
      },
    ],
  },
];

export function MembersClient() {
  const [filters, setFilters] = useState<MemberFiltersState>({
    search: "",
    status: "all",
    sortBy: "joinedAt",
    sortOrder: "desc",
  });

  const filtered = useMemo(() => {
    let result = [...MOCK_MEMBERS];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (m) =>
          m.nickname.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q)
      );
    }

    if (filters.status !== "all") {
      result = result.filter((m) => m.status === filters.status);
    }

    result.sort((a, b) => {
      const aVal = a[filters.sortBy];
      const bVal = b[filters.sortBy];
      const mul = filters.sortOrder === "desc" ? -1 : 1;
      return aVal > bVal ? mul : -mul;
    });

    return result;
  }, [filters]);

  const handleFilterChange = (partial: Partial<MemberFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

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
          명의 회원
        </p>
      </div>

      <MemberFilters filters={filters} onFilterChange={handleFilterChange} />
      <MemberTable members={filtered} />
    </motion.div>
  );
}
