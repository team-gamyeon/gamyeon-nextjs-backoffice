"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import type { DashboardSummary } from "@/featured/dashboard/types";
import { DAY_LABELS } from "@/featured/dashboard/constants";
import { useSignupTrend } from "@/featured/dashboard/hooks/useSignupTrend";

interface Props {
  signupTrend?: DashboardSummary["signupTrend"];
}

export function DauChart({ signupTrend }: Props) {
  const { weekOffset, setWeekOffset, weekData, weekLabel, minOffset, maxOffset } =
    useSignupTrend(signupTrend);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex w-full"
      suppressHydrationWarning
    >
      <Card className="border-border/60 h-full w-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">신규 가입 추이</CardTitle>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => setWeekOffset((w) => w - 1)}
                disabled={weekOffset <= minOffset}
                className="hover:bg-accent flex h-6 w-6 cursor-pointer items-center justify-center rounded-md disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-muted-foreground min-w-37 text-center text-xs" suppressHydrationWarning>
                {weekLabel}
              </span>
              <button
                type="button"
                onClick={() => setWeekOffset((w) => w + 1)}
                disabled={weekOffset >= maxOffset}
                className="hover:bg-accent flex h-6 w-6 cursor-pointer items-center justify-center rounded-md disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={weekData}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="signupGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.55 0.15 180)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="oklch(0.55 0.15 180)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.01 180)" />
              <XAxis
                dataKey="date"
                tickFormatter={(_, index) => DAY_LABELS[index]}
                tick={{ fontSize: 11, fill: "oklch(0.55 0.02 180)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "oklch(0.55 0.02 180)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid oklch(0.91 0.01 180)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ fontWeight: 600 }}
                labelFormatter={(label) => {
                  const item = weekData.find((d) => d.date === label);
                  return item ? `${item.day} (${item.date})` : label;
                }}
                formatter={(value: number) => [`${value.toLocaleString()}명`, "신규 가입"]}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="oklch(0.55 0.15 180)"
                strokeWidth={2.5}
                fill="url(#signupGradient)"
                dot={false}
                activeDot={{ r: 5, fill: "oklch(0.55 0.15 180)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
}
