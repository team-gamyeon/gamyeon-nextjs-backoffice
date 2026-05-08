'use client'

import { FrictionRanking } from '../types/index'

interface FrictionBoardProps {
  data: FrictionRanking[]
}

export function FrictionBoard({ data }: FrictionBoardProps) {
  // UX 설명을 위한 헬퍼 함수 (API 데이터에 없는 부가 설명 및 스타일링 동적 매핑)
  const getUxDetails = (index: number, title: string) => {
    let desc = '화면 대기 중 사용자가 피로도를 느껴 이탈했습니다.'

    // 타이틀 키워드에 따라 UX 문구 다르게 부여
    if (title.includes('질문 생성')) {
      desc = '질문 생성 대기 중 지루함을 느껴 뒤로가기 또는 이탈 발생'
    } else if (title.includes('리포트 분석')) {
      desc = '분석 중 화면이 멈춘 것으로 오해하여 새로고침 또는 이탈 발생'
    }

    // 순위별 태그 색상 (1위: 빨강, 2위: 노랑, 3위 이하: 회색)
    const styles = [
      { bg: '#fee2e2', color: '#dc2626', icon: '🔥' },
      { bg: '#fef3c7', color: '#d97706', icon: '⚠️' },
      { bg: '#f1f5f9', color: '#475569', icon: '📉' },
    ]

    return { desc, style: styles[index] || styles[2] }
  }

  return (
    <div
      className="flex h-full flex-col border p-6"
      style={{
        backgroundColor: 'var(--card)',
        borderColor: 'var(--border)',
        borderRadius: 'var(--radius)',
      }}
    >
      {/* 헤더 영역 */}
      <div className="mb-4 shrink-0">
        <h2
          className="flex items-center gap-2 text-lg font-bold"
          style={{ color: 'var(--foreground)' }}
        >
          디자인 A : UX 마찰 랭킹 리스트
          <span className="text-sm font-normal" style={{ color: 'var(--muted-foreground)' }}>
            (Wall of Shame)
          </span>
        </h2>
        <p className="mt-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
          가장 마찰(이탈)이 심한 화면을 순위제로 노출하여, 다음 스프린트의 최우선 해결 과제로
          삼습니다.
        </p>
      </div>

      {/* 리스트 영역 */}
      <div className="flex min-h-0 flex-1 flex-col justify-center space-y-3">
        {data.length === 0 ? (
          <p className="py-4 text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
            현재 수집된 이탈률 데이터가 없습니다.
          </p>
        ) : (
          data.map((stat, index) => {
            const { desc, style } = getUxDetails(index, stat.title)
            // 숫자 포맷팅 (1 -> '01', 2 -> '02')
            const rankText = String(index + 1).padStart(2, '0')

            return (
              <div
                key={stat.id}
                className="flex items-center rounded-lg border p-3 transition-shadow hover:shadow-md"
                style={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                }}
              >
                {/* 순위 숫자 */}
                <div
                  className="mr-4 w-8 text-center text-2xl font-black tracking-tighter italic opacity-20"
                  style={{ color: 'var(--primary)' }}
                >
                  {rankText}
                </div>

                {/* 타이틀 및 설명 */}
                <div className="flex-1">
                  <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>
                    {stat.title}
                  </h3>
                  <p className="mt-0.5 text-[11px]" style={{ color: 'var(--muted-foreground)' }}>
                    {desc}
                  </p>
                </div>

                {/* 우측 태그 (이탈률 표시) */}
                <div
                  className="ml-2 flex shrink-0 items-center gap-1 rounded px-2 py-1 text-[10px] font-bold"
                  style={{ backgroundColor: style.bg, color: style.color }}
                >
                  <span>{style.icon}</span>
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
