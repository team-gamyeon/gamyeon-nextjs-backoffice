"use client";

import { motion } from "framer-motion";
import { UserPlus, StopCircle, Bell, FileBarChart2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

const activities = [
  {
    id: "1",
    type: "join",
    message: "새 유저 한지호님이 가입했습니다",
    time: "방금 전",
    icon: UserPlus,
    color: "text-primary bg-primary/10",
  },
  {
    id: "2",
    type: "report_done",
    message: "최유진님의 PM 면접 리포트 분석이 완료되었습니다",
    time: "5분 전",
    icon: CheckCircle,
    color: "text-green-600 bg-green-50 dark:bg-green-500/10",
  },
  {
    id: "3",
    type: "abandoned",
    message: "윤하은님이 면접을 중단했습니다 (2/5 진행)",
    time: "18분 전",
    icon: StopCircle,
    color: "text-amber-600 bg-amber-50 dark:bg-amber-500/10",
  },
  {
    id: "4",
    type: "notice",
    message: "공지사항 '서비스 이용약관 개정 안내'가 등록되었습니다",
    time: "1시간 전",
    icon: Bell,
    color: "text-primary bg-primary/10",
  },
  {
    id: "5",
    type: "report_analyzing",
    message: "강도윤님의 백엔드 면접 리포트 분석이 시작되었습니다",
    time: "2시간 전",
    icon: FileBarChart2,
    color: "text-primary bg-primary/10",
  },
];

export function RecentActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      suppressHydrationWarning
    >
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">최근 활동</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activities.map((activity, i) => {
            const Icon = activity.icon;
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
                className="flex items-start gap-3"
              >
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${activity.color}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug">{activity.message}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
