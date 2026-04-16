'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu'
import { routeApi } from '@/shared/lib/api/routeApi'
import { ACTIVITY_TYPE_CONFIG, ACTIVITY_DEFAULT_CONFIG } from '@/featured/dashboard/constants'
import { timeAgo } from '@/shared/lib/utils/timeAgo'
import type { ActivityItem, DashboardSummary } from '@/featured/dashboard/types'

const MAX_COUNT = 4

export function NotificationDropdown() {
  const [items, setItems] = useState<ActivityItem[]>([])

  useEffect(() => {
    routeApi
      .get<DashboardSummary>('/api/dashboard/summary')
      .then((data) => {
        setItems(data?.recentActivities?.items?.slice(0, MAX_COUNT) ?? [])
      })
      .catch(() => {})
  }, [])

  // TODO: 백엔드에서 isRead 필드 지원 시 읽음/안읽음 UI 활성화
  // - 전용 알림 API: GET /api/v1/notifications
  // - 읽음 처리 API: PATCH /api/v1/notifications/read-all
  // const unreadCount = items.filter((item) => !item.isRead).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="hover:bg-accent relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-md outline-none"
        >
          <Bell className="h-5 w-5" />
          {/* {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold">
              {unreadCount}
            </span>
          )} */}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0 text-sm font-semibold">최근 활동</DropdownMenuLabel>
          {/* {unreadCount > 0 && (
            <button type="button" onClick={markAllRead} className="text-primary cursor-pointer text-xs hover:underline">
              모두 읽음
            </button>
          )} */}
        </div>
        <DropdownMenuSeparator />
        <div className="overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center text-xs">최근 활동이 없습니다.</p>
          ) : (
            items.map((item, i) => {
              const { icon: Icon, color } = ACTIVITY_TYPE_CONFIG[item.type] ?? ACTIVITY_DEFAULT_CONFIG
              return (
                <DropdownMenuItem
                  key={i}
                  className="flex cursor-pointer items-start gap-3 px-3 py-2.5"
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${color}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs leading-snug">{item.message}</p>
                    <p className="text-muted-foreground/60 mt-0.5 text-[11px]">
                      {timeAgo(item.createdAt)}
                    </p>
                  </div>
                  {/* {!item.isRead && (
                    <span className="bg-primary mt-1 h-1.5 w-1.5 shrink-0 rounded-full" />
                  )} */}
                </DropdownMenuItem>
              )
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
