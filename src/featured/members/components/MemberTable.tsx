'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, MoreHorizontal, Shield, ShieldOff } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { MemberStatusBadge } from './MemberStatusBadge'
import { MemberDetailDialog } from './MemberDetailDialog'
import { SanctionDialog } from './SanctionDialog'
import type { Member } from '@/featured/members/types'

interface MemberTableProps {
  members: Member[]
}

export function MemberTable({ members }: MemberTableProps) {
  const [isMounted, setIsMounted] = useState(false)

  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [sanctionTarget, setSanctionTarget] = useState<{
    member: Member
    type: 'warning' | 'suspended' | 'release'
  } | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      {/* 💡 표 전체 좌우 여백을 늘리고 싶다면 부모 div에 px을 주거나, th/td의 px을 늘립니다. 여기선 th/td의 px을 늘렸습니다. */}
      <div className="border-border/60 overflow-hidden rounded-lg border">
        <table className="w-full table-fixed text-sm">
          <thead className="bg-muted/40">
            <tr>
              {/* 항목 순서 재배치 및 px-6으로 좌우 여백 확대 */}
              <th className="text-muted-foreground w-[25%] px-6 py-4 text-left font-medium">
                이메일
              </th>
              <th className="text-muted-foreground w-[15%] px-6 py-4 text-left font-medium">
                닉네임
              </th>
              <th className="text-muted-foreground w-[15%] px-6 py-4 text-center font-medium">
                가입일
              </th>
              <th className="text-muted-foreground w-[15%] px-6 py-4 text-center font-medium">
                마지막 활동
              </th>
              <th className="text-muted-foreground w-[10%] px-6 py-4 text-center font-medium">
                세션 수
              </th>
              <th className="text-muted-foreground w-[10%] px-6 py-4 text-center font-medium">
                상태
              </th>
              <th className="w-24 px-6 py-4" /> {/* 액션 버튼 고정 너비 약간 증가 */}
            </tr>
          </thead>
          <tbody className="divide-border/40 bg-background divide-y">
            {members.map((member) => (
              <motion.tr key={member.id} className="group hover:bg-muted/30 transition-colors">
                <td className="text-muted-foreground truncate px-6 py-3">{member.email}</td>
                <td className="truncate px-6 py-3 font-medium">{member.nickname}</td>
                <td className="text-muted-foreground truncate px-6 py-3 text-center">
                  {member.joinedAt}
                </td>
                <td className="text-muted-foreground truncate px-6 py-3 text-center">
                  {member.lastActiveAt}
                </td>
                <td className="truncate px-6 py-3 text-center font-medium">
                  {member.sessionCount}
                </td>
                <td className="truncate px-6 py-3 text-center">
                  <div className="flex justify-center">
                    <MemberStatusBadge status={member.status} />
                  </div>
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground h-8 w-8 transition-colors"
                      onClick={() => setSelectedMember(member)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-foreground h-8 w-8 transition-colors"
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
                              type: 'warning',
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
                              type: 'suspended',
                            })
                          }
                          className="text-destructive focus:text-destructive gap-2"
                        >
                          <ShieldOff className="h-4 w-4" />
                          정지 처분
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            member.status !== 'active' &&
                            setSanctionTarget({ member, type: 'release' })
                          }
                          disabled={member.status === 'active'}
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
          <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
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
  )
}
