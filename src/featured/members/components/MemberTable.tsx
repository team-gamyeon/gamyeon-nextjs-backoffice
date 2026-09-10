'use client'

import { useState } from 'react'
import type { RefObject } from 'react'
import { motion } from 'framer-motion'
import { MoreHorizontal, Shield, ShieldOff } from 'lucide-react'
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
import { SanctionDialog } from './SanctionDialog'
import { InfiniteScrollTrigger } from '@/shared/components/InfiniteScrollTrigger'
import { ListEmptyState } from '@/shared/components/ListEmptyState'
import type { Member } from '@/featured/members/types'

interface MemberTableProps {
  members: Member[]
  scrollRootRef: RefObject<HTMLDivElement | null>
  hasMore: boolean
  isLoadingMore: boolean
  hasLoadError: boolean
  initialLoadFailed: boolean
  isPaused?: boolean
  onLoadMore: () => void | Promise<void>
}

export function MemberTable({
  members,
  scrollRootRef,
  hasMore,
  isLoadingMore,
  hasLoadError,
  initialLoadFailed,
  isPaused,
  onLoadMore,
}: MemberTableProps) {
  const [sanctionTarget, setSanctionTarget] = useState<{
    member: Member
    type: 'warning' | 'suspended' | 'release'
  } | null>(null)

  return (
    <>
      <div className="border-border/60 overflow-hidden rounded-lg border">
        <div
          ref={scrollRootRef}
          className="max-h-140 w-full overflow-auto [scrollbar-gutter:stable]"
        >
          <table className="w-full table-fixed text-sm">
            <colgroup>
              <col className="w-[20%]" />
              <col className="w-[30%]" />
              <col className="w-[15%]" />
              <col className="w-[15%]" />
              <col className="w-[10%]" />
              <col className="w-16" />
            </colgroup>
            <thead className="bg-muted sticky top-0 z-10">
              <tr>
                <th className="text-muted-foreground px-6 py-4 text-left font-medium">닉네임</th>
                <th className="text-muted-foreground px-6 py-4 text-left font-medium">이메일</th>
                <th className="text-muted-foreground px-6 py-4 text-center font-medium">가입일</th>
                <th className="text-muted-foreground px-6 py-4 text-center font-medium">
                  마지막 활동
                </th>
                <th className="text-muted-foreground px-6 py-4 text-center font-medium">상태</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody className="divide-border/40 bg-background divide-y">
              {members.map((member) => (
                <motion.tr key={member.id} className="group hover:bg-muted/30 transition-colors">
                  <td className="truncate px-6 py-3 font-medium">{member.nickname}</td>
                  <td className="text-muted-foreground truncate px-6 py-3">{member.email}</td>
                  <td className="text-muted-foreground truncate px-6 py-3 text-center">
                    {member.joinedAt}
                  </td>
                  <td className="text-muted-foreground truncate px-6 py-3 text-center">
                    {member.lastActiveAt}
                  </td>
                  <td className="truncate px-6 py-3 text-center">
                    <div className="flex justify-center">
                      <MemberStatusBadge status={member.status} />
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-1">
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
                              member.status !== 'withdrew' &&
                              setSanctionTarget({ member, type: 'warning' })
                            }
                            disabled={member.status === 'withdrew'}
                            className="gap-2 text-amber-600 focus:text-amber-600 disabled:pointer-events-none disabled:opacity-40"
                          >
                            <Shield className="h-4 w-4" />
                            경고 처분
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              member.status !== 'withdrew' &&
                              setSanctionTarget({ member, type: 'suspended' })
                            }
                            disabled={member.status === 'withdrew'}
                            className="text-destructive focus:text-destructive gap-2 disabled:pointer-events-none disabled:opacity-40"
                          >
                            <ShieldOff className="h-4 w-4" />
                            정지 처분
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              (member.status === 'warning' || member.status === 'suspended') &&
                              setSanctionTarget({ member, type: 'release' })
                            }
                            disabled={member.status !== 'warning' && member.status !== 'suspended'}
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
            <ListEmptyState
              hasError={initialLoadFailed}
              errorMessage="회원 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."
              emptyMessage="검색 결과가 없습니다."
            />
          )}
          <InfiniteScrollTrigger
            rootRef={scrollRootRef}
            hasMore={hasMore}
            isLoading={isLoadingMore}
            hasError={hasLoadError}
            isPaused={isPaused}
            loadedCount={members.length}
            onLoadMore={onLoadMore}
          />
        </div>
      </div>

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
