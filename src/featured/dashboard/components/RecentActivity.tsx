'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import type { ActivityItem } from '@/featured/dashboard/types'
import { ACTIVITY_TYPE_CONFIG, ACTIVITY_DEFAULT_CONFIG } from '@/featured/dashboard/constants'
import { timeAgo } from '@/shared/lib/utils/timeAgo'

interface Props {
  items: ActivityItem[]
}

export function RecentActivity({ items }: Props) {
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
        <CardContent>
          {items.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">최근 활동이 없습니다.</p>
          ) : (
            <div className="max-h-67 space-y-3 overflow-y-auto pr-1">
              {items.map((activity, i) => {
                const { icon: Icon, color } =
                  ACTIVITY_TYPE_CONFIG[activity.type] ?? ACTIVITY_DEFAULT_CONFIG
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    className="flex items-start gap-3"
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-snug">{activity.message}</p>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        {timeAgo(activity.createdAt)}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
