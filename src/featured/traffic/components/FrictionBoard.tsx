'use client'

import { FrictionRanking } from '../types/index'

interface FrictionBoardProps {
  data: FrictionRanking[]
}

export function FrictionBoard({ data }: FrictionBoardProps) {
  return (
    <div>
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
         이탈률(UX 마찰) 발생 Top 화면
      </h2>

      <div className="flex flex-col gap-3">
        {data.map((stat, index) => (
          <div
            key={stat.id}
            className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 p-4"
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white ${index === 0 ? 'bg-red-500' : 'bg-yellow-500'}`}
              >
                {index + 1}
              </span>
              <span className="text-sm font-medium">{stat.title}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">이탈률</span>
              <span
                className={`text-base font-bold ${stat.dropOffRate > 30 ? 'text-red-500' : 'text-gray-700'}`}
              >
                {stat.dropOffRate}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
