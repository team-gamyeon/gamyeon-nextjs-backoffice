'use client'

import { useState, useEffect } from 'react'
import { Bell, Search, StopCircle, UserPlus, FileBarChart2 } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Avatar, AvatarFallback } from '@/shared/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { useAdminStore } from '@/featured/auth/store'
import { cn } from '@/shared/lib/utils'

const NOTIFICATIONS = [
  {
    id: 1,
    icon: FileBarChart2,
    message: '강도윤님의 백엔드 면접 리포트 분석이 완료되었습니다',
    time: '방금 전',
    unread: true,
    color: 'text-primary bg-primary/10',
  },
  {
    id: 2,
    icon: StopCircle,
    message: '윤하은님이 면접을 중단했습니다 (2/5 진행)',
    time: '18분 전',
    unread: true,
    color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10',
  },
  {
    id: 3,
    icon: UserPlus,
    message: '새 유저 한지호님이 가입했습니다',
    time: '1시간 전',
    unread: false,
    color: 'text-primary bg-primary/10',
  },
  {
    id: 4,
    icon: StopCircle,
    message: '박준혁님이 면접을 중단했습니다 (1/5 진행)',
    time: '3시간 전',
    unread: false,
    color: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10',
  },
]

export function AdminHeader() {
  const { admin, logout } = useAdminStore()
  const [readIds, setReadIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    useAdminStore.persist.rehydrate()
  }, [])

  const unreadCount = NOTIFICATIONS.filter((n) => n.unread && !readIds.has(n.id)).length

  const markAllRead = () => {
    setReadIds(new Set(NOTIFICATIONS.map((n) => n.id)))
  }

  return (
    <header className="border-border bg-background/95 relative flex h-16 items-center justify-between border-b px-4 backdrop-blur">
      <div className="flex-1" />

      <div className="absolute left-1/2 -translate-x-1/2">
        <div className="relative w-140">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="검색..."
            className="bg-muted/40 h-9 pl-9 text-sm ring-0 outline-none"
          />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-3">
        {/* Notification dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="hover:bg-accent relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-md outline-none"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="bg-primary text-primary-foreground absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-2 py-1.5">
              <DropdownMenuLabel className="p-0 text-sm font-semibold">알림</DropdownMenuLabel>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-primary cursor-pointer text-xs hover:underline"
                >
                  모두 읽음
                </button>
              )}
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-72 overflow-y-auto">
              {NOTIFICATIONS.map((notification) => {
                const Icon = notification.icon
                const isRead = readIds.has(notification.id) || !notification.unread
                return (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex cursor-pointer items-start gap-3 px-3 py-2.5"
                    onClick={() => setReadIds((prev) => new Set([...prev, notification.id]))}
                  >
                    <div
                      className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                        notification.color,
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          'text-xs leading-snug',
                          isRead ? 'text-muted-foreground' : 'font-medium',
                        )}
                      >
                        {notification.message}
                      </p>
                      <p className="text-muted-foreground/60 mt-0.5 text-[11px]">
                        {notification.time}
                      </p>
                    </div>
                    {!isRead && (
                      <span className="bg-primary mt-1 h-1.5 w-1.5 shrink-0 rounded-full" />
                    )}
                  </DropdownMenuItem>
                )
              })}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-9 cursor-pointer items-center gap-2 rounded-full px-2"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs outline-none">
                  관
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium" suppressHydrationWarning>
                {admin?.name ?? '관리자'}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <p className="text-muted-foreground text-xs">로그인 계정</p>
              <p className="truncate text-sm font-medium">{admin?.email ?? 'admin@gamyeon.kr'}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
