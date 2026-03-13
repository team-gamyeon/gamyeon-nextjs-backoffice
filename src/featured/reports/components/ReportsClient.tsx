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
    score: 88, // 파란색 (75점 이상)
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
    score: 45, // 노란색/주황색 (25~49점)
    summary:
      '프론트엔드 기술에 대한 이해도가 다소 부족하며, 실무 적용 경험에 대한 답변이 미흡합니다. 프레임워크 기초 개념 학습이 더 필요합니다.',
    strengths: ['최신 기술 동향 관심', '체계적인 문제 해결 접근 시도'],
    improvements: [
      '실무 경험 구체화 필요',
      'JavaScript 코어 개념 학습 권장',
      '성능 최적화 사례 준비',
    ],
    createdAt: '2026.02.27 13:47',
    completedAt: '2026.02.27 13:50',
  },
  {
    id: 'r003',
    sessionId: '4898',
    userNickname: '이서연',
    interviewTitle: '백엔드 기술 면접',
    status: 'completed',
    score: 92, // 파란색 (75점 이상)
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
    score: 18, // 빨간색 (0~24점)
    summary:
      '데이터 분석에 대한 기본적인 이해가 부족하며, 질문의 의도를 파악하는 데 어려움을 보였습니다. 통계적 사고력과 SQL 작성 능력을 기초부터 다시 다져야 합니다.',
    strengths: ['학습에 대한 열정'],
    improvements: ['기초 통계학 재학습', 'SQL 쿼리 작성 능력 강화', '비즈니스 로직 이해도 향상'],
    createdAt: '2026.02.25 09:46',
    completedAt: '2026.02.25 09:49',
  },
  {
    id: 'r006',
    sessionId: '4894',
    userNickname: '최유진',
    interviewTitle: 'PM 직무 면접',
    status: 'completed',
    score: 65, // 초록색 (50~74점)
    summary:
      '기본적인 PM 역량은 갖추고 있으나, 특정 상황에서의 위기 대처 능력에 대한 답변이 모호합니다. 구체적인 사례 제시가 더 강화되어야 합니다.',
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

  // 25점 기준으로 컬러 단계 세분화
  let color = ''
  if (score >= 75) {
    color = 'text-blue-600 dark:text-blue-400' // 75~100: 우수 (파랑)
  } else if (score >= 50) {
    color = 'text-green-600 dark:text-green-400' // 50~74: 보통 (초록)
  } else if (score >= 25) {
    color = 'text-yellow-500 dark:text-yellow-300' // 25~49: 미흡 (노랑)
  } else {
    color = 'text-red-600 dark:text-red-400' // 0~24: 부족 (빨강)
  }

  return <span className={`font-semibold ${color}`}>{score}점</span>
}

interface ReportDetailDialogProps {
  report: AnalysisReport
  open: boolean
  onClose: () => void
}

function ReportDetailDialog({ report, open, onClose }: ReportDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="text-primary h-4 w-4" />
            리포트 상세 — {report.userNickname}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div className="bg-muted/40 flex flex-col gap-2.5 rounded-lg px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-sm font-medium">면접 제목</span>
              <span className="text-base font-semibold">{report.interviewTitle}</span>
            </div>

            <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
              <span>세션 ID</span>
              <span className="text-foreground font-mono font-medium">#{report.sessionId}</span>

              <span className="text-border/60 mx-1">|</span>

              <span>점수</span>
              <ScoreBadge score={report.score} />

              <span className="text-border/60 mx-1">|</span>

              <span>분석 완료</span>
              <span className="text-foreground font-medium">{report.completedAt ?? '—'}</span>
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
                {report.strengths.map((strength: string, index: number) => (
                  <li key={index} className="text-muted-foreground flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {report.improvements && (
            <div>
              <p className="mb-2 font-semibold text-amber-600 dark:text-amber-400">개선 필요</p>
              <ul className="space-y-1">
                {report.improvements.map((improvement: string, index: number) => (
                  <li key={index} className="text-muted-foreground flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    {improvement}
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
    return MOCK_REPORTS.filter((report) => {
      if (
        search &&
        !report.userNickname.toLowerCase().includes(search.toLowerCase()) &&
        !report.sessionId.includes(search)
      )
        return false
      if (activeTab !== 'all' && report.status !== activeTab) return false
      return true
    })
  }, [search, activeTab])

  const completedCount = MOCK_REPORTS.filter((report) => report.status === 'completed').length
  const analyzingCount = MOCK_REPORTS.filter((report) => report.status === 'analyzing').length
  const failedCount = MOCK_REPORTS.filter((report) => report.status === 'failed').length

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
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
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
        <table className="w-full table-fixed text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-muted-foreground w-[12%] px-4 py-3 text-left font-medium">
                유저
              </th>
              <th className="text-muted-foreground w-[24%] px-4 py-3 text-left font-medium">
                면접 제목
              </th>
              <th className="text-muted-foreground w-[12%] px-4 py-3 text-center font-medium">
                상태
              </th>
              <th className="text-muted-foreground w-[10%] px-4 py-3 text-center font-medium">
                점수
              </th>
              <th className="text-muted-foreground w-[16%] px-4 py-3 text-center font-medium">
                생성일시
              </th>
              <th className="text-muted-foreground w-[10%] px-4 py-3 text-center font-medium">
                세션 ID
              </th>
              <th className="text-muted-foreground w-[10%] px-4 py-3 text-center font-medium">
                리포트 ID
              </th>
              <th className="w-[6%] px-4 py-3 text-center" />
            </tr>
          </thead>
          <tbody className="divide-border/40 bg-background divide-y">
            {filtered.map((report, index) => (
              <motion.tr
                key={report.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.04 }}
                className="group hover:bg-muted/30 transition-colors"
              >
                <td className="truncate px-4 py-3 text-left font-medium">{report.userNickname}</td>

                <td className="text-muted-foreground truncate px-4 py-3 text-left">
                  {report.interviewTitle}
                </td>

                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center">
                    <StatusBadge status={report.status} />
                  </div>
                </td>

                <td className="px-4 py-3 text-center">
                  <ScoreBadge score={report.score} />
                </td>

                <td className="text-muted-foreground truncate px-4 py-3 text-center">
                  {report.createdAt}
                </td>

                <td className="truncate px-4 py-3 text-center">
                  <span className="text-muted-foreground font-mono text-xs">
                    #{report.sessionId}
                  </span>
                </td>

                <td className="truncate px-4 py-3 text-center">
                  <span className="text-muted-foreground font-mono text-xs">{report.id}</span>
                </td>

                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center">
                    {report.status === 'completed' ? (
                      <button
                        type="button"
                        onClick={() => setSelected(report)}
                        title="상세 보기"
                        className="text-primary hover:bg-primary/10 flex h-7 w-7 items-center justify-center rounded-md transition-opacity"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    ) : report.status === 'failed' ? (
                      <div
                        className="text-destructive flex items-center justify-center"
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
