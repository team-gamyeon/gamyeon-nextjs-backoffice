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
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

const dauData = [
  { date: "02/15", dau: 1240 },
  { date: "02/16", dau: 1380 },
  { date: "02/17", dau: 1190 },
  { date: "02/18", dau: 980 },
  { date: "02/19", dau: 920 },
  { date: "02/20", dau: 1540 },
  { date: "02/21", dau: 1680 },
  { date: "02/22", dau: 1820 },
  { date: "02/23", dau: 1960 },
  { date: "02/24", dau: 1740 },
  { date: "02/25", dau: 1530 },
  { date: "02/26", dau: 1890 },
  { date: "02/27", dau: 2104 },
];

export function DauChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="col-span-2"
    >
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">
              일간 활성 이용자 (DAU)
            </CardTitle>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              최근 13일
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={dauData}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="dauGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.55 0.15 180)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="oklch(0.55 0.15 180)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.01 180)" />
              <XAxis
                dataKey="date"
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
                formatter={(value: number) => [
                  `${value.toLocaleString()}명`,
                  "DAU",
                ]}
              />
              <Area
                type="monotone"
                dataKey="dau"
                stroke="oklch(0.55 0.15 180)"
                strokeWidth={2.5}
                fill="url(#dauGradient)"
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
