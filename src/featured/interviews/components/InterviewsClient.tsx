"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Badge } from "@/shared/ui/badge";
import { Progress } from "@/shared/ui/progress";
import type { InterviewSession } from "@/featured/sessions/types";

const ABANDONED_SESSIONS: InterviewSession[] = [
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
    id: "4890",
    userId: "5",
    userNickname: "정다현",
    jobCategory: "백엔드",
    status: "abandoned",
    questionCount: 5,
    answeredCount: 3,
    durationSec: 720,
    startedAt: "2026.02.22 11:10",
  },
  {
    id: "4882",
    userId: "8",
    userNickname: "임서준",
    jobCategory: "데이터 분석",
    status: "abandoned",
    questionCount: 5,
    answeredCount: 0,
    durationSec: 45,
    startedAt: "2026.02.20 09:05",
  },
  {
    id: "4871",
    userId: "1",
    userNickname: "김민준",
    jobCategory: "프론트엔드",
    status: "abandoned",
    questionCount: 5,
    answeredCount: 4,
    durationSec: 1540,
    startedAt: "2026.02.18 14:50",
  },
  {
    id: "4860",
    userId: "6",
    userNickname: "강도윤",
    jobCategory: "PM",
    status: "abandoned",
    questionCount: 5,
    answeredCount: 2,
    durationSec: 380,
    startedAt: "2026.02.15 17:30",
  },
];

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

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}분 ${s}초`;
}

export function InterviewsClient() {
  const [search, setSearch] = useState("");
  const [jobCategory, setJobCategory] = useState("전체");

  const filtered = useMemo(() => {
    return ABANDONED_SESSIONS.filter((s) => {
      if (
        search &&
        !s.userNickname.toLowerCase().includes(search.toLowerCase()) &&
        !s.id.includes(search)
      )
        return false;
      if (jobCategory !== "전체" && s.jobCategory !== jobCategory) return false;
      return true;
    });
  }, [search, jobCategory]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Summary banner */}
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 flex items-center gap-3">
        <Badge variant="destructive" className="text-xs">
          중단
        </Badge>
        <p className="text-sm text-muted-foreground">
          현재{" "}
          <span className="font-semibold text-foreground">
            {ABANDONED_SESSIONS.length}
          </span>
          건의 중단된 면접이 있습니다. 중단 원인을 확인하고 서비스 품질을
          개선하세요.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="닉네임 또는 세션 ID 검색..."
            className="pl-9 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={jobCategory} onValueChange={setJobCategory}>
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

        <p className="text-sm text-muted-foreground">
          총{" "}
          <span className="font-semibold text-foreground">{filtered.length}</span>
          건
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border/60">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                세션 ID
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                유저
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                직군
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                답변 진도
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                진행 시간
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                시작일시
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 bg-background">
            {filtered.map((session, i) => (
              <motion.tr
                key={session.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="transition-colors hover:bg-muted/30"
              >
                <td className="px-4 py-3">
                  <span className="font-mono text-xs text-muted-foreground">
                    #{session.id}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">
                  {session.userNickname}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {session.jobCategory}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Progress
                      value={
                        (session.answeredCount / session.questionCount) * 100
                      }
                      className="h-1.5 w-20"
                    />
                    <span className="text-xs text-muted-foreground">
                      {session.answeredCount}/{session.questionCount}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDuration(session.durationSec)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {session.startedAt}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </motion.div>
  );
}
