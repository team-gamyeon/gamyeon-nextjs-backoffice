'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  HelpCircle,
  Megaphone,
  Video,
  FileBarChart2,
  ChevronsLeft,
  LogOut,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useAdminStore } from '@/featured/auth/store'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip'

const navItems = [
  { href: '/dashboard', label: '대시보드', icon: LayoutDashboard },
  { href: '/members', label: '유저 관리', icon: Users },
  { href: '/questions', label: '공통 질문 관리', icon: HelpCircle },
  { href: '/notices', label: '공지사항 관리', icon: Megaphone },
  { href: '/interviews', label: '면접 관리', icon: Video },
  { href: '/reports', label: '리포트 관리', icon: FileBarChart2 },
]

interface AdminSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()
  const { logout } = useAdminStore()

  return (
    <TooltipProvider delayDuration={200}>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="border-sidebar-border bg-sidebar relative flex h-screen shrink-0 flex-col border-r"
        suppressHydrationWarning
      >
        <button
          type="button"
          onClick={onToggle}
          className="bg-primary text-primary-foreground hover:bg-primary-hover absolute top-5.5 -right-3.5 z-10 flex h-7 w-7 items-center justify-center rounded-full shadow-md transition-colors duration-200"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            suppressHydrationWarning
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </motion.div>
        </button>

        {/* Logo */}
        <div className="border-sidebar-border overflow-hidden border-b">
          <div className="flex h-16 items-center px-3">
            <Link href="/dashboard" className="flex min-w-0 items-center">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                <Image
                  src="/images/Gamyeon_Logo.svg"
                  alt="Gamyeon Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                />
              </div>

              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{
                      opacity: 1,
                      width: 'auto',
                      transition: {
                        duration: 0.15,
                        delay: 0,
                        ease: 'easeOut',
                      },
                    }}
                    exit={{
                      opacity: 0,
                      width: 0,
                      transition: { duration: 0.08, ease: 'easeIn' },
                    }}
                    className="text-sidebar-primary overflow-hidden text-sm font-bold whitespace-nowrap"
                    suppressHydrationWarning
                  >
                    amyeon <span>Backoffice</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

            const linkEl = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex h-10 items-center gap-3 rounded-md px-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0 transition-colors',
                    isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground/60',
                  )}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{
                        opacity: 1,
                        width: 'auto',
                        transition: {
                          duration: 0.2,
                          delay: 0.1,
                          ease: 'easeOut',
                        },
                      }}
                      exit={{
                        opacity: 0,
                        width: 0,
                        transition: { duration: 0.08, ease: 'easeIn' },
                      }}
                      className="overflow-hidden whitespace-nowrap"
                      suppressHydrationWarning
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && !collapsed && (
                  <motion.div
                    layoutId="active-indicator"
                    className="bg-sidebar-primary ml-auto h-1.5 w-1.5 shrink-0 rounded-full"
                    suppressHydrationWarning
                  />
                )}
              </Link>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return linkEl
          })}
        </nav>

        {/* Logout */}
        <div className="border-sidebar-border border-t px-2 py-3">
          {collapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={logout}
                  className="text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-destructive flex h-10 w-full items-center gap-3 rounded-md px-2 text-sm font-medium transition-colors"
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
              className="text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-destructive flex h-10 w-full items-center gap-3 rounded-md px-2 text-sm font-medium transition-colors"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{
                      opacity: 1,
                      width: 'auto',
                      transition: {
                        duration: 0.15,
                        delay: 0,
                        ease: 'easeOut',
                      },
                    }}
                    exit={{
                      opacity: 0,
                      width: 0,
                      transition: { duration: 0.08, ease: 'easeIn' },
                    }}
                    className="overflow-hidden whitespace-nowrap"
                    suppressHydrationWarning
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
  )
}
