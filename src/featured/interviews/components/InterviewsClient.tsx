'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Badge } from '@/shared/ui/badge'
import { Progress } from '@/shared/ui/progress'
import { SearchInput } from '@/shared/components/SearchInput'
import type { InterviewSession } from '../types'

const STATUS_LABEL: Record<InterviewSession['status'], { label: string; variant: 'destructive' | 'default' | 'secondary' }> = {
  abandoned: { label: '중단', variant: 'destructive' },
  in_progress: { label: '진행 중', variant: 'default' },
  completed: { label: '완료', variant: 'secondary' },
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}분 ${remainingSeconds}초`
}

interface InterviewsClientProps {
  initialSessions: InterviewSession[]
}

export function InterviewsClient({ initialSessions }: InterviewsClientProps) {
  const [search, setSearch] = useState('')
  const [selectedTitle, setSelectedTitle] = useState('전체')

  const titles = useMemo(() => {
    const unique = Array.from(new Set(initialSessions.map((session) => session.interviewTitle)))
    return ['전체', ...unique]
  }, [initialSessions])

  const abandonedCount = useMemo(
    () => initialSessions.filter((session) => session.status === 'abandoned').length,
    [initialSessions],
  )

  const filtered = useMemo(() => {
    return initialSessions.filter((session) => {
      if (
        search &&
        !session.userNickname.toLowerCase().includes(search.toLowerCase()) &&
        !session.id.includes(search)
      )
        return false
      if (selectedTitle !== '전체' && session.interviewTitle !== selectedTitle) return false
      return true
    })
  }, [initialSessions, search, selectedTitle])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="border-destructive/20 bg-destructive/5 flex items-center gap-3 rounded-lg border px-4 py-3">
        <Badge variant="destructive" className="text-xs">
          중단
        </Badge>
        <p className="text-muted-foreground text-sm">
          현재 <span className="text-foreground font-semibold">{abandonedCount}</span>
          건의 중단된 면접이 있습니다. 중단 원인을 확인하고 서비스 품질을 개선하세요.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="닉네임 또는 세션 ID 검색..."
          className="min-w-52 flex-1"
        />

        <Select value={selectedTitle} onValueChange={setSelectedTitle}>
          <SelectTrigger className="h-9 w-48">
            <SelectValue placeholder="면접 제목" />
          </SelectTrigger>
          <SelectContent>
            {titles.map((title) => (
              <SelectItem key={title} value={title}>
                {title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <p className="text-muted-foreground text-sm">
          총 <span className="text-foreground font-semibold">{filtered.length}</span>건
        </p>
      </div>

      <div className="border-border/60 overflow-hidden rounded-lg border">
        <table className="w-full table-fixed text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-muted-foreground w-[12%] px-4 py-3 text-left font-medium">
                유저
              </th>
              <th className="text-muted-foreground w-[28%] px-4 py-3 text-left font-medium">
                면접 제목
              </th>
              <th className="text-muted-foreground w-[12%] px-4 py-3 text-center font-medium">
                상태
              </th>
              <th className="text-muted-foreground w-[16%] px-4 py-3 text-center font-medium">
                시작일시
              </th>
              <th className="text-muted-foreground w-[16%] px-4 py-3 text-center font-medium">
                진행 시간
              </th>
              <th className="text-muted-foreground w-[16%] px-4 py-3 text-center font-medium">
                세션 ID
              </th>
            </tr>
          </thead>
          <tbody className="divide-border/40 bg-background divide-y">
            {filtered.map((session, index) => (
              <motion.tr
                key={session.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.04 }}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="truncate px-4 py-3 text-left font-medium">{session.userNickname}</td>

                <td className="text-muted-foreground truncate px-4 py-3 text-left">
                  {session.interviewTitle}
                </td>

                <td className="px-4 py-3 text-center">
                  <Badge variant={STATUS_LABEL[session.status].variant} className="text-xs">
                    {STATUS_LABEL[session.status].label}
                  </Badge>
                </td>

                <td className="text-muted-foreground truncate px-4 py-3 text-center">
                  {session.startedAt}
                </td>

                <td className="text-muted-foreground truncate px-4 py-3 text-center">
                  {formatDuration(session.durationSec)}
                </td>

                <td className="truncate px-4 py-3 text-center">
                  <span className="text-muted-foreground font-mono text-xs">#{session.id}</span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </motion.div>
  )
}
