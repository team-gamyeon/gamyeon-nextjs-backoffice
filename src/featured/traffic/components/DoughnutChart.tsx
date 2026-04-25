'use client'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

type ChannelData = {
  channel: string
  totalUsers: number
}

interface firstChannelResultProps {
  data: ChannelData[]
}

export default function DoughnutChart({ data }: firstChannelResultProps) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">유입 채널</h2>
      <Doughnut
        data={{
          labels: data.map((d: any) => d.channel),
          datasets: [
            {
              label: 'Users',
              data: data.map((d: any) => d.totalUsers),
              backgroundColor: ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'],
            },
          ],
        }}
      />
    </div>
  )
}
