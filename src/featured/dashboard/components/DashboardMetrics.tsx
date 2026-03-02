"use client";

import { Users, PlayCircle, TrendingUp, AlertTriangle } from "lucide-react";
import { MetricCard } from "./MetricCard";

const metrics = [
  {
    title: "일간 활성 이용자",
    value: "2,104",
    change: 12.3,
    changeLabel: "어제 대비",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "오늘 면접 완료",
    value: "847",
    change: 8.1,
    changeLabel: "어제 대비",
    icon: <PlayCircle className="h-5 w-5" />,
  },
  {
    title: "신규 가입",
    value: "134",
    change: -3.2,
    changeLabel: "어제 대비",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    title: "제재 회원",
    value: "23",
    change: -8.0,
    changeLabel: "지난 주 대비",
    icon: <AlertTriangle className="h-5 w-5" />,
  },
];

export function DashboardMetrics() {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard key={metric.title} {...metric} index={index} />
      ))}
    </div>
  );
}
