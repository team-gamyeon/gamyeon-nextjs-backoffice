"use client";

import { Users, StopCircle, Bell, FileBarChart2, HelpCircle } from "lucide-react";
import { MetricCard } from "./MetricCard";
import type { DashboardSummary } from "@/featured/dashboard/types";

interface Props {
  kpi?: DashboardSummary["kpi"];
}

export function DashboardMetrics({ kpi }: Props) {
  const metrics = [
    {
      title: "전체 유저",
      value: (kpi?.totalUsers.value ?? 0).toLocaleString(),
      change: 4.2,
      changeLabel: "지난 주 대비",
      icon: <Users className="h-5 w-5" />,
      href: "/members",
    },
    {
      title: "활성화 중인 질문",
      value: (kpi?.activeQuestions.value ?? 0).toLocaleString(),
      change: 0,
      changeLabel: "변동 없음",
      icon: <HelpCircle className="h-5 w-5" />,
      href: "/questions",
    },
    {
      title: "활성 공지사항",
      value: (kpi?.totalNotices.value ?? 0).toLocaleString(),
      change: 0,
      changeLabel: "변동 없음",
      icon: <Bell className="h-5 w-5" />,
      href: "/notices",
    },
    {
      title: "중단된 면접 (오늘)",
      value: (kpi?.pausedInterviews.value ?? 0).toLocaleString(),
      change: -12.5,
      changeLabel: "어제 대비",
      icon: <StopCircle className="h-5 w-5" />,
      href: "/interviews",
    },
    {
      title: "분석 중인 리포트",
      value: (kpi?.analyzingReports.value ?? 0).toLocaleString(),
      change: -66.7,
      changeLabel: "어제 대비",
      icon: <FileBarChart2 className="h-5 w-5" />,
      href: "/reports",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
      {metrics.map((metric, index) => (
        <MetricCard key={metric.title} {...metric} index={index} />
      ))}
    </div>
  );
}
