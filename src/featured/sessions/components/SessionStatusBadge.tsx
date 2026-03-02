import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import type { SessionStatus } from "@/featured/sessions/types";

const statusConfig: Record<SessionStatus, { label: string; className: string }> = {
  completed: {
    label: "완료",
    className:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
  },
  in_progress: {
    label: "진행중",
    className:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  },
  abandoned: {
    label: "이탈",
    className:
      "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20",
  },
};

interface SessionStatusBadgeProps {
  status: SessionStatus;
}

export function SessionStatusBadge({ status }: SessionStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
