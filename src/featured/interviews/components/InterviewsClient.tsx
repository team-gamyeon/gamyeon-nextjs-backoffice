'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select'
import { Badge } from '@/shared/ui/badge'
import { Progress } from '@/shared/ui/progress'
import { SearchInput } from '@/shared/components/SearchInput'
import type { InterviewSession } from '@/featured/sessions/types'

const INTERVIEW_TITLES = [
  '전체',
  '프론트엔드 기술 면접',
  '백엔드 기술 면접',
  '풀스택 실무 면접',
  '데이터 분석가 면접',
  'PM 직무 면접',
  'UX/UI 디자이너 면접',
  'DevOps 인프라 면접',
]

const ABANDONED_SESSIONS: InterviewSession[] = [
  {
    id: '4897',
    userId: '7',
    userNickname: '윤하은',
    interviewTitle: 'UX/UI 디자이너 면접',
    status: 'abandoned',
    questionCount: 5,
    answeredCount: 2,
    durationSec: 480,
    startedAt: '2026.02.26 16:00',
  },
  {
    id: '4895',
    userId: '3',
    userNickname: '박준혁',
    interviewTitle: '풀스택 실무 면접',
    status: 'abandoned',
    questionCount: 5,
    answeredCount: 1,
    durationSec: 190,
    startedAt: '2026.02.24 20:30',
  },
  {
    id: '4890',
    userId: '5',
    userNickname: '정다현',
    interviewTitle: '백엔드 기술 면접',
    status: 'abandoned',
    questionCount: 5,
    answeredCount: 3,
    durationSec: 720,
    startedAt: '2026.02.22 11:10',
  },
  {
    id: '4882',
    userId: '8',
    userNickname: '임서준',
    interviewTitle: '데이터 분석가 면접',
    status: 'abandoned',
    questionCount: 5,
    answeredCount: 0,
    durationSec: 45,
    startedAt: '2026.02.20 09:05',
  },
  {
    id: '4871',
    userId: '1',
    userNickname: '김민준',
    interviewTitle: '프론트엔드 기술 면접',
    status: 'abandoned',
    questionCount: 5,
    answeredCount: 4,
    durationSec: 1540,
    startedAt: '2026.02.18 14:50',
  },
  {
    id: '4860',
    userId: '6',
    userNickname: '강도윤',
    interviewTitle: 'PM 직무 면접',
    status: 'abandoned',
    questionCount: 5,
    answeredCount: 2,
    durationSec: 380,
    startedAt: '2026.02.15 17:30',
  },
]

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}분 ${s}초`
}

export function InterviewsClient() {
  const [search, setSearch] = useState('')
  const [selectedTitle, setSelectedTitle] = useState('전체')

  const filtered = useMemo(() => {
    return ABANDONED_SESSIONS.filter((s) => {
      if (
        search &&
        !s.userNickname.toLowerCase().includes(search.toLowerCase()) &&
        !s.id.includes(search)
      )
        return false
      if (selectedTitle !== '전체' && s.interviewTitle !== selectedTitle) return false
      return true
    })
  }, [search, selectedTitle])

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
          현재 <span className="text-foreground font-semibold">{ABANDONED_SESSIONS.length}</span>
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
            {INTERVIEW_TITLES.map((title) => (
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
              <th className="text-muted-foreground w-[16%] px-4 py-3 text-center font-medium">
                시작일시
              </th>
              <th className="text-muted-foreground w-[16%] px-4 py-3 text-center font-medium">
                답변 진도
              </th>
              <th className="text-muted-foreground w-[16%] px-4 py-3 text-center font-medium">
                진행 시간
              </th>
              <th className="text-muted-foreground w-[12%] px-4 py-3 text-center font-medium">
                세션 ID
              </th>
            </tr>
          </thead>
          <tbody className="divide-border/40 bg-background divide-y">
            {filtered.map((session, i) => (
              <motion.tr
                key={session.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="truncate px-4 py-3 text-left font-medium">{session.userNickname}</td>

                <td className="text-muted-foreground truncate px-4 py-3 text-left">
                  {session.interviewTitle}
                </td>

                <td className="text-muted-foreground truncate px-4 py-3 text-center">
                  {session.startedAt}
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <Progress
                      value={(session.answeredCount / session.questionCount) * 100}
                      className="h-1.5 w-16"
                    />
                    <span className="text-muted-foreground text-xs whitespace-nowrap">
                      {session.answeredCount}/{session.questionCount}
                    </span>
                  </div>
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
