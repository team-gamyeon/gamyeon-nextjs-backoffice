"use client";

import { motion } from "framer-motion";
import { Card } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { Badge } from "@/shared/ui/badge";

interface JobStat {
  jobCategory: string;
  totalSessions: number;
  avgScore: number;
  completionRate: number;
  topScore: number;
  lowScore: number;
  scoreDistribution: { label: string; count: number; color: string }[];
}

const MOCK_STATS: JobStat[] = [
  {
    jobCategory: "백엔드",
    totalSessions: 1240,
    avgScore: 78.4,
    completionRate: 91,
    topScore: 98,
    lowScore: 32,
    scoreDistribution: [
      { label: "A (90↑)", count: 280, color: "bg-green-500" },
      { label: "B (70-89)", count: 520, color: "bg-blue-500" },
      { label: "C (50-69)", count: 340, color: "bg-amber-500" },
      { label: "D (50↓)", count: 100, color: "bg-red-500" },
    ],
  },
  {
    jobCategory: "프론트엔드",
    totalSessions: 980,
    avgScore: 74.1,
    completionRate: 88,
    topScore: 96,
    lowScore: 28,
    scoreDistribution: [
      { label: "A (90↑)", count: 180, color: "bg-green-500" },
      { label: "B (70-89)", count: 420, color: "bg-blue-500" },
      { label: "C (50-69)", count: 290, color: "bg-amber-500" },
      { label: "D (50↓)", count: 90, color: "bg-red-500" },
    ],
  },
  {
    jobCategory: "PM",
    totalSessions: 620,
    avgScore: 81.2,
    completionRate: 94,
    topScore: 99,
    lowScore: 45,
    scoreDistribution: [
      { label: "A (90↑)", count: 210, color: "bg-green-500" },
      { label: "B (70-89)", count: 280, color: "bg-blue-500" },
      { label: "C (50-69)", count: 110, color: "bg-amber-500" },
      { label: "D (50↓)", count: 20, color: "bg-red-500" },
    ],
  },
  {
    jobCategory: "데이터 분석",
    totalSessions: 410,
    avgScore: 69.8,
    completionRate: 82,
    topScore: 94,
    lowScore: 22,
    scoreDistribution: [
      { label: "A (90↑)", count: 55, color: "bg-green-500" },
      { label: "B (70-89)", count: 160, color: "bg-blue-500" },
      { label: "C (50-69)", count: 140, color: "bg-amber-500" },
      { label: "D (50↓)", count: 55, color: "bg-red-500" },
    ],
  },
  {
    jobCategory: "디자이너",
    totalSessions: 320,
    avgScore: 72.5,
    completionRate: 85,
    topScore: 95,
    lowScore: 30,
    scoreDistribution: [
      { label: "A (90↑)", count: 48, color: "bg-green-500" },
      { label: "B (70-89)", count: 140, color: "bg-blue-500" },
      { label: "C (50-69)", count: 100, color: "bg-amber-500" },
      { label: "D (50↓)", count: 32, color: "bg-red-500" },
    ],
  },
  {
    jobCategory: "풀스택",
    totalSessions: 280,
    avgScore: 76.3,
    completionRate: 89,
    topScore: 97,
    lowScore: 35,
    scoreDistribution: [
      { label: "A (90↑)", count: 60, color: "bg-green-500" },
      { label: "B (70-89)", count: 130, color: "bg-blue-500" },
      { label: "C (50-69)", count: 75, color: "bg-amber-500" },
      { label: "D (50↓)", count: 15, color: "bg-red-500" },
    ],
  },
];

const totalSessions = MOCK_STATS.reduce((s, r) => s + r.totalSessions, 0);
const overallAvg = (MOCK_STATS.reduce((s, r) => s + r.avgScore * r.totalSessions, 0) / totalSessions).toFixed(1);
const bestCategory = MOCK_STATS.reduce((a, b) => a.avgScore > b.avgScore ? a : b);
const worstCategory = MOCK_STATS.reduce((a, b) => a.avgScore < b.avgScore ? a : b);

function ScoreBar({ stat }: { stat: JobStat }) {
  const maxScore = 100;
  return (
    <div className="flex h-3 w-full overflow-hidden rounded-full">
      {stat.scoreDistribution.map((d) => {
        const width = (d.count / stat.totalSessions) * 100;
        return (
          <div
            key={d.label}
            className={`${d.color} h-full transition-all`}
            style={{ width: `${width}%` }}
            title={`${d.label}: ${d.count}명`}
          />
        );
      })}
    </div>
  );
}

export function StatisticsClient() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { label: "총 면접 세션", value: totalSessions.toLocaleString(), sub: "전체 직군" },
          { label: "전체 평균 점수", value: `${overallAvg}점`, sub: "가중 평균" },
          { label: "최고 평균 직군", value: bestCategory.jobCategory, sub: `평균 ${bestCategory.avgScore}점` },
          { label: "최저 평균 직군", value: worstCategory.jobCategory, sub: `평균 ${worstCategory.avgScore}점` },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-bold">{s.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{s.sub}</p>
          </Card>
        ))}
      </div>

      {/* Score Legend */}
      <div className="flex items-center gap-4 rounded-lg border border-border/60 bg-muted/20 px-4 py-2.5">
        <span className="text-xs font-medium text-muted-foreground">점수 분포:</span>
        {[
          { label: "A (90점↑)", color: "bg-green-500" },
          { label: "B (70-89점)", color: "bg-blue-500" },
          { label: "C (50-69점)", color: "bg-amber-500" },
          { label: "D (50점↓)", color: "bg-red-500" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`h-2.5 w-2.5 rounded-full ${l.color}`} />
            <span className="text-xs text-muted-foreground">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Stats Table */}
      <div className="overflow-hidden rounded-lg border border-border/60">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">직군</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">총 세션</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">평균 점수</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">완료율</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">최고</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">최저</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">점수 분포</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 bg-background">
            {MOCK_STATS.sort((a, b) => b.avgScore - a.avgScore).map((stat, i) => (
              <motion.tr
                key={stat.jobCategory}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">#{i + 1}</span>
                    <span className="font-medium">{stat.jobCategory}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center font-medium">{stat.totalSessions.toLocaleString()}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`font-bold ${stat.avgScore >= 80 ? "text-green-600" : stat.avgScore >= 70 ? "text-blue-600" : "text-amber-600"}`}>
                    {stat.avgScore}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <Progress value={stat.completionRate} className="h-1.5 w-16" />
                    <span className="text-xs text-muted-foreground">{stat.completionRate}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-green-600 font-medium">{stat.topScore}</td>
                <td className="px-4 py-3 text-center text-destructive font-medium">{stat.lowScore}</td>
                <td className="px-4 py-3 w-48">
                  <ScoreBar stat={stat} />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
