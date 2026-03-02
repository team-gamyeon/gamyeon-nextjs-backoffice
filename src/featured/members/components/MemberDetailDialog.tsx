"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { MemberStatusBadge } from "./MemberStatusBadge";
import type { Member } from "@/featured/members/types";

interface MemberDetailDialogProps {
  member: Member;
  open: boolean;
  onClose: () => void;
}

export function MemberDetailDialog({
  member,
  open,
  onClose,
}: MemberDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>회원 상세 정보</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Info */}
          <div className="rounded-lg bg-muted/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">닉네임</span>
              <span className="font-medium">{member.nickname}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">이메일</span>
              <span className="text-sm">{member.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">상태</span>
              <MemberStatusBadge status={member.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">세션 수</span>
              <span className="font-medium">{member.sessionCount}회</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">가입일</span>
              <span className="text-sm text-muted-foreground">{member.joinedAt}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">최근 활동</span>
              <span className="text-sm text-muted-foreground">{member.lastActiveAt}</span>
            </div>
          </div>

          {/* Password Hash */}
          <div>
            <p className="mb-1.5 text-sm font-medium text-muted-foreground">
              비밀번호 해시값
            </p>
            <div className="rounded-md bg-muted px-3 py-2">
              <code className="text-xs break-all text-foreground/80">
                {member.passwordHash}
              </code>
            </div>
          </div>

          {/* Sanction History */}
          {member.sanctionHistory.length > 0 && (
            <div>
              <Separator className="mb-3" />
              <p className="mb-3 text-sm font-medium">제재 이력</p>
              <div className="space-y-2">
                {member.sanctionHistory.map((sanction) => (
                  <div
                    key={sanction.id}
                    className="rounded-lg border border-border/60 p-3 text-sm space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={
                          sanction.type === "warning"
                            ? "border-amber-200 text-amber-600"
                            : "border-red-200 text-red-600"
                        }
                      >
                        {sanction.type === "warning" ? "경고" : "정지"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {sanction.createdAt}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{sanction.reason}</p>
                    {sanction.adminNote && (
                      <p className="text-xs text-muted-foreground/70">
                        관리자 메모: {sanction.adminNote}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
