"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, ShieldOff, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { MemberStatusBadge } from "./MemberStatusBadge";
import { SanctionDialog } from "./SanctionDialog";
import type { Member } from "@/featured/members/types";

// Mock data lookup by ID
const MOCK_MEMBER: Member = {
  id: "1",
  nickname: "김민준",
  email: "minjun.kim@example.com",
  passwordHash:
    "$2b$12$LxZaHvM9kGPzJ3qNwRsYuOcVbDtFnEpAoKXiW5ShlYmQ8rTg6uE4K",
  status: "active",
  joinedAt: "2026.01.05",
  lastActiveAt: "2026.02.27",
  sessionCount: 24,
  sanctionHistory: [],
};

interface MemberDetailViewProps {
  memberId: string;
}

export function MemberDetailView({ memberId: _ }: MemberDetailViewProps) {
  const member = MOCK_MEMBER;
  const [sanctionType, setSanctionType] = useState<
    "warning" | "suspended" | "release" | null
  >(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-3 gap-4"
      >
        {/* Basic Info Card */}
        <div className="col-span-2 space-y-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InfoItem label="닉네임" value={member.nickname} />
                <InfoItem label="이메일" value={member.email} />
                <InfoItem
                  label="상태"
                  value={<MemberStatusBadge status={member.status} />}
                />
                <InfoItem label="세션 수" value={`${member.sessionCount}회`} />
                <InfoItem label="가입일" value={member.joinedAt} />
                <InfoItem label="마지막 활동" value={member.lastActiveAt} />
              </div>

              <Separator />

              <div>
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  비밀번호 해시값
                </p>
                <div className="rounded-md bg-muted px-3 py-2.5">
                  <code className="break-all text-xs text-foreground/80">
                    {member.passwordHash}
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sanction History */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">제재 이력</CardTitle>
            </CardHeader>
            <CardContent>
              {member.sanctionHistory.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  제재 이력이 없습니다.
                </div>
              ) : (
                <div className="space-y-3">
                  {member.sanctionHistory.map((sanction) => (
                    <div
                      key={sanction.id}
                      className="rounded-lg border border-border/60 p-3 space-y-1.5"
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
                      <p className="text-sm">{sanction.reason}</p>
                      {sanction.adminNote && (
                        <p className="text-xs text-muted-foreground">
                          메모: {sanction.adminNote}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions Card */}
        <div className="space-y-4">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-base">제재 관리</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-amber-600 hover:text-amber-700 hover:border-amber-300"
                onClick={() => setSanctionType("warning")}
              >
                <Shield className="h-4 w-4" />
                경고 처분
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:border-destructive/40"
                onClick={() => setSanctionType("suspended")}
              >
                <ShieldOff className="h-4 w-4" />
                정지 처분
              </Button>
              {member.status !== "active" && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 text-green-600 hover:text-green-700 hover:border-green-300"
                  onClick={() => setSanctionType("release")}
                >
                  <CheckCircle className="h-4 w-4" />
                  제재 해제
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {sanctionType && (
        <SanctionDialog
          member={member}
          type={sanctionType}
          open={!!sanctionType}
          onClose={() => setSanctionType(null)}
        />
      )}
    </>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
