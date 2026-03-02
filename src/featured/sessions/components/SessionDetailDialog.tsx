"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Progress } from "@/shared/ui/progress";
import { SessionStatusBadge } from "./SessionStatusBadge";
import type { InterviewSession } from "@/featured/sessions/types";

interface SessionDetailDialogProps {
  session: InterviewSession;
  open: boolean;
  onClose: () => void;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}분 ${s}초`;
}

export function SessionDetailDialog({
  session,
  open,
  onClose,
}: SessionDetailDialogProps) {
  const progressPct = Math.round(
    (session.answeredCount / session.questionCount) * 100
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            세션 상세
            <span className="font-mono text-xs font-normal text-muted-foreground">
              #{session.id}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-muted/40 p-4 space-y-3">
            <InfoRow label="회원" value={session.userNickname} />
            <InfoRow label="직군" value={session.jobCategory} />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">상태</span>
              <SessionStatusBadge status={session.status} />
            </div>
            <InfoRow label="시작일시" value={session.startedAt} />
            {session.endedAt && (
              <InfoRow label="종료일시" value={session.endedAt} />
            )}
            <InfoRow
              label="소요 시간"
              value={formatDuration(session.durationSec)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">답변 진도</span>
              <span className="text-muted-foreground">
                {session.answeredCount} / {session.questionCount} 문항
              </span>
            </div>
            <Progress value={progressPct} className="h-2" />
            <p className="text-right text-xs text-muted-foreground">
              {progressPct}%
            </p>
          </div>

          {session.score != null && (
            <div className="flex items-center justify-between rounded-lg border border-border/60 p-3">
              <span className="text-sm font-medium">최종 점수</span>
              <span
                className={`text-xl font-bold ${
                  session.score >= 80
                    ? "text-green-600"
                    : session.score >= 60
                      ? "text-amber-600"
                      : "text-destructive"
                }`}
              >
                {session.score}점
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
