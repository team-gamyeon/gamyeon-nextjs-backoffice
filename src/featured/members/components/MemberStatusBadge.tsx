import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import type { MemberStatus } from "@/featured/members/types";

const statusConfig: Record<
  MemberStatus,
  { label: string; className: string }
> = {
  active: {
    label: "정상",
    className:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
  },
  warning: {
    label: "경고",
    className:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
  suspended: {
    label: "정지",
    className:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  },
};

interface MemberStatusBadgeProps {
  status: MemberStatus;
}

export function MemberStatusBadge({ status }: MemberStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
