import {
  UserPlus,
  StopCircle,
  Bell,
  FileBarChart2,
  CheckCircle,
  Activity,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"] as const;

export const INTERVIEW_SEGMENT_MAP: Record<string, { name: string; color: string; order: number }> = {
  FINISHED:    { name: "완료",   color: "oklch(0.55 0.15 180)", order: 0 },
  IN_PROGRESS: { name: "진행중", color: "oklch(0.72 0.18 150)", order: 1 },
  PAUSED:      { name: "이탈",   color: "oklch(0.62 0.15 25)",  order: 2 },
};

export const REPORT_SEGMENT_MAP: Record<string, { name: string; color: string; order: number }> = {
  COMPLETED:   { name: "분석 완료", color: "oklch(0.55 0.15 180)", order: 0 },
  IN_PROGRESS: { name: "분석 중",   color: "oklch(0.72 0.18 150)", order: 1 },
  FAILED:      { name: "실패",      color: "oklch(0.62 0.15 25)",  order: 2 },
};

export const ACTIVITY_TYPE_CONFIG: Record<string, { icon: LucideIcon; color: string }> = {
  USER_JOINED:         { icon: UserPlus,      color: "text-primary bg-primary/10" },
  INTERVIEW_COMPLETED: { icon: CheckCircle,   color: "text-green-600 bg-green-50 dark:bg-green-500/10" },
  INTERVIEW_PAUSED:    { icon: StopCircle,    color: "text-amber-600 bg-amber-50 dark:bg-amber-500/10" },
  join:                { icon: UserPlus,      color: "text-primary bg-primary/10" },
  report_done:         { icon: CheckCircle,   color: "text-green-600 bg-green-50 dark:bg-green-500/10" },
  abandoned:           { icon: StopCircle,    color: "text-amber-600 bg-amber-50 dark:bg-amber-500/10" },
  notice:              { icon: Bell,          color: "text-primary bg-primary/10" },
  report_analyzing:    { icon: FileBarChart2, color: "text-primary bg-primary/10" },
  report:              { icon: FileBarChart2, color: "text-primary bg-primary/10" },
};

export const ACTIVITY_DEFAULT_CONFIG = {
  icon: Activity,
  color: "text-primary bg-primary/10",
} as const;
