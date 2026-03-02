"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  PlayCircle,
  HelpCircle,
  BrainCircuit,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Database,
  Star,
  GitBranch,
  BarChart2,
  AlertOctagon,
  Mic,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useAdminStore } from "@/featured/auth/store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";

const navGroups = [
  {
    label: "운영",
    items: [
      { href: "/dashboard", label: "대시보드", icon: LayoutDashboard },
      { href: "/members", label: "회원 관리", icon: Users },
      { href: "/sessions", label: "면접 세션 관리", icon: PlayCircle },
      { href: "/questions", label: "공통 질문 관리", icon: HelpCircle },
    ],
  },
  {
    label: "AI 관리",
    items: [
      { href: "/question-bank", label: "질문 뱅크 관리", icon: Database },
      { href: "/ai-feedback", label: "AI 피드백 품질", icon: Star },
      { href: "/prompts", label: "프롬프트 버전 관리", icon: GitBranch },
    ],
  },
  {
    label: "모니터링",
    items: [
      { href: "/statistics", label: "직군별 통계", icon: BarChart2 },
      { href: "/anomaly", label: "이상 세션 감지", icon: AlertOctagon },
      { href: "/stt-monitoring", label: "STT 오류율", icon: Mic },
    ],
  },
];

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAdminStore();

  return (
    <TooltipProvider delayDuration={200}>
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative flex h-screen shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar"
      >
        {/* Logo */}
        <div className="border-b border-sidebar-border">
          <div
            className={cn(
              "flex h-16 items-center px-2",
              collapsed ? "justify-center" : "justify-between",
            )}
          >
            <Link
              href="/dashboard"
              className={cn(
                "flex min-w-0 items-center gap-3",
                collapsed ? "justify-center" : "",
              )}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary">
                <BrainCircuit className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden whitespace-nowrap text-sm font-bold text-sidebar-foreground"
                  >
                    Gamyeon Dashboard
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {!collapsed && (
              <button
                type="button"
                onClick={onToggle}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                aria-label="Collapse sidebar"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
            )}
          </div>

          {collapsed && (
            <div className="px-2 pb-2">
              <button
                type="button"
                onClick={onToggle}
                className="mx-auto flex h-8 w-8 items-center justify-center rounded-md text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                aria-label="Expand sidebar"
              >
                <ChevronsRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Nav Groups */}
        <nav className="flex-1 space-y-4 overflow-y-auto px-2 py-4">
          {navGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              <AnimatePresence>
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40"
                  >
                    {group.label}
                  </motion.p>
                )}
              </AnimatePresence>

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");

                const linkEl = (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex h-10 items-center gap-3 rounded-md px-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0 transition-colors",
                        isActive
                          ? "text-sidebar-primary"
                          : "text-sidebar-foreground/60",
                      )}
                    />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && !collapsed && (
                      <motion.div
                        layoutId="active-indicator"
                        className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-sidebar-primary"
                      />
                    )}
                  </Link>
                );

                if (collapsed) {
                  return (
                    <Tooltip key={item.href}>
                      <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                      <TooltipContent side="right" sideOffset={8}>
                        {item.label}
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return linkEl;
              })}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-sidebar-border px-2 py-3">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={logout}
                  className="flex h-10 w-full items-center gap-3 rounded-md px-2 text-sm font-medium text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent/60 hover:text-destructive"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                로그아웃
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={logout}
              className="flex h-10 w-full items-center gap-3 rounded-md px-2 text-sm font-medium text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent/60 hover:text-destructive"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    로그아웃
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
