"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Sector } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

const data = [
  { name: "분석 완료", value: 6, color: "oklch(0.55 0.15 180)" },
  { name: "분석 중", value: 1, color: "oklch(0.72 0.18 150)" },
  { name: "실패", value: 1, color: "oklch(0.62 0.15 25)" },
];

const total = data.reduce((sum, d) => sum + d.value, 0);
const completedPct = Math.round((data[0].value / total) * 100);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 5}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
    />
  );
};

export function ReportAnalysisCard() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const active = activeIndex !== null ? data[activeIndex] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="flex"
      suppressHydrationWarning
    >
      <Card className="border-border/60 h-full w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">리포트 분석율</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div>
              <PieChart width={200} height={180} onMouseLeave={() => setActiveIndex(null)}>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={54}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    activeShape={renderActiveShape}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={entry.color}
                        strokeWidth={0}
                        opacity={active && active.name !== entry.name ? 0.4 : 1}
                        style={{ transition: "opacity 0.2s" }}
                      />
                    ))}
                  </Pie>
                  <text
                    x={100}
                    y={84}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      fill: active ? active.color : "currentColor",
                      transition: "fill 0.15s",
                    }}
                  >
                    {active
                      ? `${Math.round((active.value / total) * 100)}%`
                      : `${completedPct}%`}
                  </text>
                  <text
                    x={100}
                    y={103}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: "0.75rem", fill: "currentColor", opacity: 0.5 }}
                  >
                    {active ? active.name : "완료율"}
                  </text>
              </PieChart>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {data.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}건</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
