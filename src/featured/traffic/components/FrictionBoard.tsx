'use client'

import { FrictionRanking } from '../types/index'
import { Flame, AlertTriangle, TrendingDown } from 'lucide-react'

interface FrictionBoardProps {
  data: FrictionRanking[]
}

// 컴포넌트 외부로 분리: 리렌더링 시 함수 재생성 방지
const getUxDetails = (index: number, title: string) => {
  let desc = '화면 대기 중 사용자가 피로도를 느껴 이탈했습니다.'

  // 유지보수를 위해 Dictionary 형태로 관리하는 것도 좋은 방법입니다.
  if (title.includes('질문 생성')) {
    desc = '질문 생성 대기 중 지루함을 느껴 뒤로가기 또는 이탈 발생'
  } else if (title.includes('리포트 분석')) {
    desc = '분석 중 화면이 멈춘 것으로 오해하여 새로고침 또는 이탈 발생'
  }

  // globals.css에 정의된 변수를 활용하여 Tailwind 클래스로 매핑
  const rankStyles = [
    { className: 'bg-destructive/15 text-destructive', Icon: Flame }, // 1위 (빨강/위험)
    // 참고: globals.css에 명시적인 warning 컬러가 없어, 보통 경고색으로 쓰이는 chart-4 또는 Tailwind 기본 amber를 추천합니다.
    { className: 'bg-amber-500/15 text-amber-600 dark:text-amber-500', Icon: AlertTriangle }, // 2위 (노랑/주의)
    { className: 'bg-muted text-muted-foreground', Icon: TrendingDown }, // 3위 이하 (회색/일반)
  ]

  return { desc, style: rankStyles[index] || rankStyles[2] }
}

export function FrictionBoard({ data }: FrictionBoardProps) {
  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card p-6">
      {/* 헤더 영역 */}
      <div className="mb-4 shrink-0">
        <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
          UX 마찰 랭킹 리스트
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          가장 마찰(이탈)이 심한 화면을 순위제로 노출하여, 다음 스프린트의 최우선 해결 과제로
          삼습니다.
        </p>
      </div>

      {/* 리스트 영역 */}
      <div className="flex min-h-0 flex-1 flex-col justify-center space-y-3">
        {data.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            현재 수집된 이탈률 데이터가 없습니다.
          </p>
        ) : (
          data.map((stat, index) => {
            const { desc, style } = getUxDetails(index, stat.title)
            const { Icon, className } = style
            const rankText = String(index + 1).padStart(2, '0')

            return (
              <div
                key={stat.id}
                className="flex items-center rounded-lg border border-border bg-background p-3 transition-shadow hover:shadow-md"
              >
                {/* 순위 숫자 */}
                <div className="mr-4 w-8 text-center text-2xl font-black italic tracking-tighter text-primary opacity-20">
                  {rankText}
                </div>

                {/* 타이틀 및 설명 */}
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-foreground">
                    {stat.title}
                  </h3>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {desc}
                  </p>
                </div>

                {/* 우측 태그 (이탈률 표시) */}
                <div
                  className={`ml-2 flex shrink-0 items-center gap-1.5 rounded px-2 py-1 text-[10px] font-bold ${className}`}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={2.5} />
                  {stat.dropOffRate}% 이탈률
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}