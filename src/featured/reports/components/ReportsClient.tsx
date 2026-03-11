'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FileText, Loader2, AlertCircle } from 'lucide-react'
import { Badge } from '@/shared/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog'
import { SearchInput } from '@/shared/components/SearchInput'
import type { AnalysisReport, ReportStatus } from '@/featured/reports/types'

const MOCK_REPORTS: AnalysisReport[] = [
  {
    id: 'r001',
    sessionId: '4901',
    userNickname: '최유진',
    interviewTitle: 'PM 직무 면접',
    status: 'completed',
    score: 88,
    summary:
      'PM 직군에 적합한 논리적 사고력과 커뮤니케이션 능력이 돋보입니다. 데이터 기반 의사결정 경험이 풍부하며 팀 리더십 역량이 우수합니다.',
    strengths: [
      '명확한 문제 정의 및 우선순위 설정 능력',
      '이해관계자 커뮤니케이션 스킬',
      '데이터 기반 의사결정 경험',
    ],
    improvements: ['기술적 깊이 강화 필요', '리스크 관리 방법론 학습 권장'],
    createdAt: '2026.02.27 15:03',
    completedAt: '2026.02.27 15:06',
  },
  {
    id: 'r002',
    sessionId: '4900',
    userNickname: '김민준',
    interviewTitle: '프론트엔드 기술 면접',
    status: 'completed',
    score: 74,
    summary:
      '프론트엔드 기술 역량은 양호하나 실무 프로젝트 경험 서술에서 구체성이 부족합니다. 문제 해결 접근 방식은 체계적입니다.',
    strengths: ['최신 기술 스택 이해', '체계적인 문제 해결 접근'],
    improvements: ['실무 경험 구체화 필요', '성능 최적화 사례 준비 권장', '팀 협업 경험 어필 강화'],
    createdAt: '2026.02.27 13:47',
    completedAt: '2026.02.27 13:50',
  },
  {
    id: 'r003',
    sessionId: '4898',
    userNickname: '이서연',
    interviewTitle: '백엔드 기술 면접',
    status: 'completed',
    score: 92,
    summary:
      '백엔드 개발 전반에 걸쳐 높은 수준의 역량을 보여주었습니다. 시스템 설계 능력과 기술적 깊이가 뛰어나며 면접 전반에서 자신감이 느껴졌습니다.',
    strengths: ['탁월한 시스템 설계 능력', '깊이 있는 기술 이해', '명확한 의사 전달'],
    improvements: ['비기술 직군과의 협업 경험 언급 보강'],
    createdAt: '2026.02.26 10:46',
    completedAt: '2026.02.26 10:49',
  },
  {
    id: 'r004',
    sessionId: '4899',
    userNickname: '강도윤',
    interviewTitle: '백엔드 기술 면접',
    status: 'analyzing',
    createdAt: '2026.02.27 15:45',
  },
  {
    id: 'r005',
    sessionId: '4896',
    userNickname: '임서준',
    interviewTitle: '데이터 분석가 면접',
    status: 'completed',
    score: 61,
    summary:
      '데이터 분석 기초 역량은 갖추고 있으나 실제 비즈니스 인사이트 도출 경험이 부족합니다. 통계적 사고력을 더 발전시킬 필요가 있습니다.',
    strengths: ['기초 통계 이해', 'SQL 활용 능력'],
    improvements: ['비즈니스 인사이트 도출 경험 확보', '시각화 역량 강화', 'A/B 테스트 경험 준비'],
    createdAt: '2026.02.25 09:46',
    completedAt: '2026.02.25 09:49',
  },
  {
    id: 'r006',
    sessionId: '4894',
    userNickname: '최유진',
    interviewTitle: 'PM 직무 면접',
    status: 'completed',
    score: 79,
    summary:
      '전반적으로 양호한 면접 역량을 보였습니다. 이전 면접 대비 성장이 느껴지며 구체적인 사례 제시가 더 강화되었습니다.',
    strengths: ['논리적 사고', '시장 분석 능력'],
    improvements: ['수치 기반 성과 언급 강화', '경쟁사 분석 역량 보강'],
    createdAt: '2026.02.24 11:33',
    completedAt: '2026.02.24 11:36',
  },
  {
    id: 'r007',
    sessionId: '4885',
    userNickname: '정다현',
    interviewTitle: 'UX/UI 디자이너 면접',
    status: 'failed',
    createdAt: '2026.02.23 09:00',
  },
]

function StatusBadge({ status }: { status: ReportStatus }) {
  if (status === 'completed')
    return (
      <Badge className="border-0 bg-green-100 text-xs text-green-700 dark:bg-green-500/20 dark:text-green-400">
        분석 완료
      </Badge>
    )
  if (status === 'analyzing')
    return (
      <Badge className="bg-primary/10 text-primary gap-1 border-0 text-xs">
        <Loader2 className="h-3 w-3 animate-spin" />
        분석 중
      </Badge>
    )
  return <Badge className="bg-destructive/10 text-destructive border-0 text-xs">실패</Badge>
}

function ScoreBadge({ score }: { score?: number }) {
  if (score == null) return <span className="text-muted-foreground">—</span>
  const color =
    score >= 80
      ? 'text-green-600 dark:text-green-400'
      : score >= 60
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-red-600 dark:text-red-400'
  return <span className={`font-semibold ${color}`}>{score}점</span>
}

interface ReportDetailDialogProps {
  report: AnalysisReport
  open: boolean
  onClose: () => void
}

function ReportDetailDialog({ report, open, onClose }: ReportDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="text-primary h-4 w-4" />
            리포트 상세 — {report.userNickname}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="bg-muted/40 flex flex-wrap gap-4 rounded-lg px-4 py-3">
            <div>
              <p className="text-muted-foreground text-xs">면접 제목</p>
              <p className="font-medium">{report.interviewTitle}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">세션 ID</p>
              <p className="font-mono font-medium">#{report.sessionId}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">점수</p>
              <ScoreBadge score={report.score} />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">분석 완료</p>
              <p className="font-medium">{report.completedAt ?? '—'}</p>
            </div>
          </div>

          {report.summary && (
            <div>
              <p className="mb-1 font-semibold">종합 평가</p>
              <p className="text-muted-foreground leading-relaxed">{report.summary}</p>
            </div>
          )}

          {report.strengths && (
            <div>
              <p className="mb-2 font-semibold text-green-600 dark:text-green-400">강점</p>
              <ul className="space-y-1">
                {report.strengths.map((s: string, i: number) => (
                  <li key={i} className="text-muted-foreground flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {report.improvements && (
            <div>
              <p className="mb-2 font-semibold text-amber-600 dark:text-amber-400">개선 필요</p>
              <ul className="space-y-1">
                {report.improvements.map((s: string, i: number) => (
                  <li key={i} className="text-muted-foreground flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ReportsClient() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<ReportStatus | 'all'>('all')
  const [selected, setSelected] = useState<any | null>(null)

  const filtered = useMemo(() => {
    return MOCK_REPORTS.filter((r) => {
      if (
        search &&
        !r.userNickname.toLowerCase().includes(search.toLowerCase()) &&
        !r.sessionId.includes(search)
      )
        return false
      if (activeTab !== 'all' && r.status !== activeTab) return false
      return true
    })
  }, [search, activeTab])

  const completedCount = MOCK_REPORTS.filter((r) => r.status === 'completed').length
  const analyzingCount = MOCK_REPORTS.filter((r) => r.status === 'analyzing').length
  const failedCount = MOCK_REPORTS.filter((r) => r.status === 'failed').length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
      suppressHydrationWarning
    >
      {/* Stats */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-foreground">
          전체 <span className="text-foreground mr-1 font-semibold">{MOCK_REPORTS.length}</span>개
        </span>
        <span className="text-muted-foreground">
          완료{' '}
          <span className="mr-1 font-semibold text-green-600 dark:text-green-400">
            {completedCount}
          </span>
          개
        </span>
        <span className="text-muted-foreground">
          분석 중 <span className="text-primary mr-1 font-semibold">{analyzingCount}</span>개
        </span>
        {failedCount > 0 && (
          <span className="text-muted-foreground">
            실패 <span className="text-destructive mr-1 font-semibold">{failedCount}</span>개
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="h-9">
            <TabsTrigger value="all" className="text-xs">
              전체
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs">
              분석 완료
            </TabsTrigger>
            <TabsTrigger value="analyzing" className="text-xs">
              분석 중
            </TabsTrigger>
            <TabsTrigger value="failed" className="text-xs">
              실패
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="유저명 또는 세션 ID 검색..."
          className="min-w-48 flex-1"
        />
      </div>

      {/* Table */}
      <div className="border-border/60 overflow-hidden rounded-lg border">
        {/* table-fixed 추가 및 각 항목별 비율(w-[%]) 적용 */}
        <table className="w-full table-fixed text-sm">
          <thead className="bg-muted/40">
            <tr>
              {/* 인지 흐름에 맞춘 순서 변경 및 정렬 적용 */}
              <th className="text-muted-foreground w-[15%] px-4 py-3 text-center font-medium">
                생성일시
              </th>
              <th className="text-muted-foreground w-[10%] px-4 py-3 text-center font-medium">
                리포트 ID
              </th>
              <th className="text-muted-foreground w-[10%] px-4 py-3 text-center font-medium">
                세션 ID
              </th>
              <th className="text-muted-foreground w-[10%] px-4 py-3 text-center font-medium">
                유저
              </th>
              <th className="text-muted-foreground w-[25%] px-4 py-3 text-left font-medium">
                면접 제목
              </th>
              <th className="text-muted-foreground w-[12%] px-4 py-3 text-center font-medium">
                상태
              </th>
              <th className="text-muted-foreground w-[10%] px-4 py-3 text-center font-medium">
                점수
              </th>
              <th className="w-[8%] px-4 py-3 text-center" />
            </tr>
          </thead>
          <tbody className="divide-border/40 bg-background divide-y">
            {filtered.map((report, i) => (
              <motion.tr
                key={report.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="group hover:bg-muted/30 transition-colors"
              >
                {/* 데이터 순서도 헤더와 동일하게 매핑 및 정렬 */}
                <td className="text-muted-foreground truncate px-4 py-3 text-center">
                  {report.createdAt}
                </td>
                <td className="truncate px-4 py-3 text-center">
                  <span className="text-muted-foreground font-mono text-xs">{report.id}</span>
                </td>
                <td className="truncate px-4 py-3 text-center">
                  <span className="text-muted-foreground font-mono text-xs">
                    #{report.sessionId}
                  </span>
                </td>
                <td className="truncate px-4 py-3 text-center font-medium">
                  {report.userNickname}
                </td>
                <td className="text-muted-foreground truncate px-4 py-3 text-left">
                  {report.interviewTitle}
                </td>
                <td className="px-4 py-3 text-center">
                  {/* Badge가 가운데 정렬되도록 flex 컨테이너에 justify-center 추가 */}
                  <div className="flex justify-center">
                    <StatusBadge status={report.status} />
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <ScoreBadge score={report.score} />
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center">
                    {report.status === 'completed' ? (
                      <button
                        type="button"
                        onClick={() => setSelected(report)}
                        title="상세 보기"
                        className="text-primary hover:bg-primary/10 flex h-7 w-7 items-center justify-center rounded-md opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        {/* 텍스트 제거하고 아이콘만 유지 */}
                        <FileText className="h-4 w-4" />
                      </button>
                    ) : report.status === 'failed' ? (
                      <div
                        className="text-destructive flex items-center justify-center opacity-0 group-hover:opacity-100"
                        title="분석 실패"
                      >
                        <AlertCircle className="h-4 w-4" />
                      </div>
                    ) : null}
                  </div>
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

      {selected && (
        <ReportDetailDialog report={selected} open={!!selected} onClose={() => setSelected(null)} />
      )}
    </motion.div>
  )
}
