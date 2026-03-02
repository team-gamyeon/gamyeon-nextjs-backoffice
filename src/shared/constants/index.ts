export const ADMIN_COOKIE_NAME = "admin_token";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "대시보드", icon: "LayoutDashboard" },
  { href: "/members", label: "회원 관리", icon: "Users" },
  { href: "/sessions", label: "면접 세션", icon: "PlayCircle" },
  { href: "/questions", label: "공통 질문", icon: "HelpCircle" },
] as const;

export const MEMBER_STATUS = {
  ACTIVE: "active",
  WARNING: "warning",
  SUSPENDED: "suspended",
} as const;

export const SESSION_STATUS = {
  COMPLETED: "completed",
  IN_PROGRESS: "in_progress",
  ABANDONED: "abandoned",
} as const;

export const QUESTION_CATEGORY = {
  INTRO: "자기소개",
  MOTIVATION: "지원 동기",
  STRENGTH: "강점/약점",
  EXPERIENCE: "경험",
  TECHNICAL: "기술",
  BEHAVIOR: "행동",
  SITUATIONAL: "상황",
} as const;
