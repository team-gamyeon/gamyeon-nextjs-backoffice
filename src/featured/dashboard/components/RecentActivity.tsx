"use client";

import { motion } from "framer-motion";
import { UserPlus, CheckCircle, AlertTriangle, Flag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

const activities = [
  {
    id: "1",
    type: "join",
    message: "새 회원 김민준님이 가입했습니다",
    time: "방금 전",
    icon: UserPlus,
    color: "text-primary bg-primary/10",
  },
  {
    id: "2",
    type: "session_complete",
    message: "이서연님이 백엔드 개발자 면접을 완료했습니다",
    time: "3분 전",
    icon: CheckCircle,
    color: "text-green-600 bg-green-50 dark:bg-green-500/10",
  },
  {
    id: "3",
    type: "sanction",
    message: "박준혁님에게 경고 처분이 내려졌습니다",
    time: "12분 전",
    icon: AlertTriangle,
    color: "text-amber-600 bg-amber-50 dark:bg-amber-500/10",
  },
  {
    id: "4",
    type: "session_complete",
    message: "최유진님이 PM 면접을 완료했습니다",
    time: "28분 전",
    icon: CheckCircle,
    color: "text-green-600 bg-green-50 dark:bg-green-500/10",
  },
  {
    id: "5",
    type: "report",
    message: "이상 세션이 감지되었습니다 (session_id: 4821)",
    time: "1시간 전",
    icon: Flag,
    color: "text-destructive bg-destructive/10",
  },
];

export function RecentActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
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
