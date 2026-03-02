"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, MoreHorizontal, Shield, ShieldOff } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { MemberStatusBadge } from "./MemberStatusBadge";
import { MemberDetailDialog } from "./MemberDetailDialog";
import { SanctionDialog } from "./SanctionDialog";
import type { Member } from "@/featured/members/types";

interface MemberTableProps {
  members: Member[];
}

export function MemberTable({ members }: MemberTableProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [sanctionTarget, setSanctionTarget] = useState<{
    member: Member;
    type: "warning" | "suspended" | "release";
  } | null>(null);

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border/60">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                닉네임
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                이메일
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                비밀번호 해시
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                상태
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                세션 수
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                마지막 활동
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                가입일
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 bg-background">
            {members.map((member, i) => (
              <motion.tr
                key={member.id}
                layout
                className="group transition-colors hover:bg-muted/30"
              >
                <td className="px-4 py-3 font-medium">{member.nickname}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {member.email}
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-xs text-muted-foreground">
                    {member.passwordHash.slice(0, 20)}…
                  </span>
                </td>
                <td className="px-4 py-3">
                  <MemberStatusBadge status={member.status} />
                </td>
                <td className="px-4 py-3 text-center font-medium">
                  {member.sessionCount}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {member.lastActiveAt}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {member.joinedAt}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100"
                      onClick={() => setSelectedMember(member)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuLabel>회원 제재</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            setSanctionTarget({
                              member,
                              type: "warning",
                            })
                          }
                          className="gap-2 text-amber-600 focus:text-amber-600"
                        >
                          <Shield className="h-4 w-4" />
                          경고 처분
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            setSanctionTarget({
                              member,
                              type: "suspended",
                            })
                          }
                          className="gap-2 text-destructive focus:text-destructive"
                        >
                          <ShieldOff className="h-4 w-4" />
                          정지 처분
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            member.status !== "active" &&
                            setSanctionTarget({ member, type: "release" })
                          }
                          disabled={member.status === "active"}
                          className="gap-2 text-green-600 focus:text-green-600 disabled:pointer-events-none disabled:opacity-40"
                        >
                          <ShieldOff className="h-4 w-4" />
                          제재 해제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {members.length === 0 && (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            검색 결과가 없습니다.
          </div>
        )}
      </div>

      {selectedMember && (
        <MemberDetailDialog
          member={selectedMember}
          open={!!selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}

      {sanctionTarget && (
        <SanctionDialog
          member={sanctionTarget.member}
          type={sanctionTarget.type}
          open={!!sanctionTarget}
          onClose={() => setSanctionTarget(null)}
        />
      )}
    </>
  );
}
