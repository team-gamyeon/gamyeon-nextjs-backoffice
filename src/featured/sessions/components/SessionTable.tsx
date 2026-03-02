"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Progress } from "@/shared/ui/progress";
import { SessionStatusBadge } from "./SessionStatusBadge";
import { SessionDetailDialog } from "./SessionDetailDialog";
import type { InterviewSession } from "@/featured/sessions/types";

interface SessionTableProps {
  sessions: InterviewSession[];
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}분 ${s}초`;
}

export function SessionTable({ sessions }: SessionTableProps) {
  const [selected, setSelected] = useState<InterviewSession | null>(null);

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border/60">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                세션 ID
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                회원
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                직군
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                상태
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                답변 진도
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                점수
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                소요 시간
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                시작일시
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 bg-background">
            {sessions.map((session, i) => (
              <motion.tr
                key={session.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="group transition-colors hover:bg-muted/30"
              >
                <td className="px-4 py-3">
                  <span className="font-mono text-xs text-muted-foreground">
                    #{session.id}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">{session.userNickname}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {session.jobCategory}
                </td>
                <td className="px-4 py-3">
                  <SessionStatusBadge status={session.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Progress
                      value={(session.answeredCount / session.questionCount) * 100}
                      className="h-1.5 w-20"
                    />
                    <span className="text-xs text-muted-foreground">
                      {session.answeredCount}/{session.questionCount}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {session.score != null ? (
                    <span
                      className={
                        session.score >= 80
                          ? "font-semibold text-green-600 dark:text-green-400"
                          : session.score >= 60
                            ? "font-semibold text-amber-600 dark:text-amber-400"
                            : "font-semibold text-red-600 dark:text-red-400"
                      }
                    >
                      {session.score}점
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDuration(session.durationSec)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {session.startedAt}
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => setSelected(session)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {sessions.length === 0 && (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            검색 결과가 없습니다.
          </div>
        )}
      </div>

      {selected && (
        <SessionDetailDialog
          session={selected}
          open={!!selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}
