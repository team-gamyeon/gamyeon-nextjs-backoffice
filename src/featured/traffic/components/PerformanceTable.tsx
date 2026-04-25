'use client'

type PagePerformanceData = {
  routePage: string
  pageViews: number
  activeUsers: number
  userDurations: number
}

interface PerformanceTableProps {
  data: PagePerformanceData[]
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainSeconds = Math.floor(seconds % 60)

  return `${minutes}분 ${remainSeconds}초`
}

export function PerformanceTable({ data }: PerformanceTableProps) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">페이지별 성과</h2>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b bg-gray-50 text-left">
            <th className="px-4 py-3">페이지 경로</th>
            <th className="px-4 py-3">조회수</th>
            <th className="px-4 py-3">활성 사용자</th>
            <th className="px-4 py-3">활성 사용자당 평균 참여 시간</th>
          </tr>
        </thead>

        <tbody>
          {data.map((d) => (
            <tr key={d.routePage} className="border-b">
              <td className="px-4 py-3">{d.routePage}</td>
              <td className="px-4 py-3">{d.pageViews}</td>
              <td className="px-4 py-3">{d.activeUsers}</td>
              <td className="px-4 py-3">
                {formatTime(d.activeUsers > 0 ? d.userDurations / d.activeUsers : 0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
