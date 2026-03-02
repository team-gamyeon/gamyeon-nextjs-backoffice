"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

const data = [
  { name: "완료", value: 68, color: "oklch(0.55 0.15 180)" },
  { name: "진행중", value: 15, color: "oklch(0.72 0.18 150)" },
  { name: "이탈", value: 17, color: "oklch(0.92 0.01 180)" },
];

export function CompletionRateCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">면접 완료율</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="relative">
              <ResponsiveContainer width={200} height={160}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {data.map((entry, index) => (
                      <Cell key={index} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, ""]}
                    contentStyle={{
                      fontSize: "12px",
                      borderRadius: "8px",
                      border: "1px solid oklch(0.91 0.01 180)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">68%</span>
                <span className="text-xs text-muted-foreground">완료율</span>
              </div>
            </div>
          </div>

          <div className="mt-2 space-y-2">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
