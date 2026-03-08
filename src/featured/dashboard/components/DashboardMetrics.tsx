"use client";

import { Users, StopCircle, Bell, FileBarChart2, HelpCircle } from "lucide-react";
import { MetricCard } from "./MetricCard";

const metrics = [
  {
    title: "전체 유저",
    value: "3,481",
    change: 4.2,
    changeLabel: "지난 주 대비",
    icon: <Users className="h-5 w-5" />,
    href: "/members",
  },
  {
    title: "활성화 중인 질문",
    value: "8",
    change: 0,
    changeLabel: "변동 없음",
    icon: <HelpCircle className="h-5 w-5" />,
    href: "/questions",
  },
  {
    title: "활성 공지사항",
    value: "3",
    change: 0,
    changeLabel: "변동 없음",
    icon: <Bell className="h-5 w-5" />,
    href: "/notices",
  },
  {
    title: "중단된 면접 (오늘)",
    value: "18",
    change: -12.5,
    changeLabel: "어제 대비",
    icon: <StopCircle className="h-5 w-5" />,
    href: "/interviews",
  },
  {
    title: "분석 중인 리포트",
    value: "1",
    change: -66.7,
    changeLabel: "어제 대비",
    icon: <FileBarChart2 className="h-5 w-5" />,
    href: "/reports",
  },
];

export function DashboardMetrics() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
      {metrics.map((metric, index) => (
        <MetricCard key={metric.title} {...metric} index={index} />
      ))}
    </div>
  );
}
