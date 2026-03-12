"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Sector } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import type { DashboardSummary } from "@/featured/dashboard/types";
import { REPORT_SEGMENT_MAP } from "@/featured/dashboard/constants";
import { useDonutChart } from "@/featured/dashboard/hooks/useDonutChart";

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

interface Props {
  reportAnalysis?: DashboardSummary["reportAnalysis"];
}

export function ReportAnalysisCard({ reportAnalysis }: Props) {
  const data = (reportAnalysis?.segments ?? [])
    .filter((s) => REPORT_SEGMENT_MAP[s.label])
    .map((s) => ({
      name: REPORT_SEGMENT_MAP[s.label].name,
      value: s.count,
      color: REPORT_SEGMENT_MAP[s.label].color,
      order: REPORT_SEGMENT_MAP[s.label].order,
    }))
    .sort((a, b) => a.order - b.order);

  const completionRate = reportAnalysis?.completionRate ?? 0;

  const { setActiveIndex, active } = useDonutChart(data);

  const pieData = data.length > 0 ? data : [{ name: "", value: 1, color: "oklch(0.9 0 0)", order: 0 }];

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
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={54}
                    outerRadius={80}
                    paddingAngle={data.length > 0 ? 3 : 0}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    activeShape={renderActiveShape}
                    onMouseEnter={(_, index) => data.length > 0 && setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {pieData.map((entry, index) => (
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
                    {active ? `${active.value}건` : `${completionRate}%`}
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
