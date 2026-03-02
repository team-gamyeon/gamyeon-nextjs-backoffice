"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Progress } from "@/shared/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

interface SttRecord {
  sessionId: string;
  nickname: string;
  jobCategory: string;
  totalWords: number;
  errorWords: number;
  errorRate: number; // 0-100
  errorTypes: string[];
  date: string;
}

const MOCK_DATA: SttRecord[] = [
  { sessionId: "4899", nickname: "강도윤", jobCategory: "백엔드", totalWords: 1240, errorWords: 12, errorRate: 1.0, errorTypes: ["발음 불명확"], date: "2026.02.27" },
  { sessionId: "4897", nickname: "윤하은", jobCategory: "디자이너", totalWords: 680, errorWords: 95, errorRate: 14.0, errorTypes: ["배경 소음", "발음 불명확"], date: "2026.02.26" },
  { sessionId: "4895", nickname: "박준혁", jobCategory: "풀스택", totalWords: 320, errorWords: 88, errorRate: 27.5, errorTypes: ["마이크 품질", "배경 소음", "발음 불명확"], date: "2026.02.24" },
  { sessionId: "4890", nickname: "김민준", jobCategory: "프론트엔드", totalWords: 1560, errorWords: 8, errorRate: 0.5, errorTypes: [], date: "2026.02.23" },
  { sessionId: "4885", nickname: "이서연", jobCategory: "백엔드", totalWords: 1820, errorWords: 5, errorRate: 0.3, errorTypes: [], date: "2026.02.22" },
  { sessionId: "4880", nickname: "최유진", jobCategory: "PM", totalWords: 1340, errorWords: 67, errorRate: 5.0, errorTypes: ["배경 소음"], date: "2026.02.21" },
  { sessionId: "4875", nickname: "임서준", jobCategory: "데이터 분석", totalWords: 950, errorWords: 190, errorRate: 20.0, errorTypes: ["마이크 품질", "발음 불명확"], date: "2026.02.20" },
  { sessionId: "4870", nickname: "정다현", jobCategory: "풀스택", totalWords: 410, errorWords: 3, errorRate: 0.7, errorTypes: [], date: "2026.02.19" },
  { sessionId: "4865", nickname: "강도윤", jobCategory: "백엔드", totalWords: 1100, errorWords: 44, errorRate: 4.0, errorTypes: ["배경 소음"], date: "2026.02.18" },
  { sessionId: "4860", nickname: "테스트계정4", jobCategory: "프론트엔드", totalWords: 180, errorWords: 126, errorRate: 70.0, errorTypes: ["마이크 품질", "배경 소음", "발음 불명확", "언어 감지 불가"], date: "2026.02.17" },
];

function errorRateBadge(rate: number) {
  if (rate === 0) return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">완벽</Badge>;
  if (rate < 5) return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">양호</Badge>;
  if (rate < 15) return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">주의</Badge>;
  return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">심각</Badge>;
}

function errorRateColor(rate: number) {
  if (rate < 5) return "text-green-600";
  if (rate < 15) return "text-amber-600";
  return "text-destructive";
}

// Daily trend (mock)
const DAILY_TREND = [
  { date: "02.21", avgRate: 3.8 },
  { date: "02.22", avgRate: 2.1 },
  { date: "02.23", avgRate: 1.4 },
  { date: "02.24", avgRate: 4.6 },
  { date: "02.25", avgRate: 5.2 },
  { date: "02.26", avgRate: 7.8 },
  { date: "02.27", avgRate: 2.3 },
];
const maxRate = Math.max(...DAILY_TREND.map((d) => d.avgRate));

export function SttMonitoringClient() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("all");

  const filtered = useMemo(() => {
    return MOCK_DATA.filter((r) => {
      const matchSearch = !search || r.nickname.includes(search) || r.sessionId.includes(search);
      const matchLevel =
        levelFilter === "all" ||
        (levelFilter === "good" && r.errorRate < 5) ||
        (levelFilter === "caution" && r.errorRate >= 5 && r.errorRate < 15) ||
        (levelFilter === "critical" && r.errorRate >= 15);
      return matchSearch && matchLevel;
    });
  }, [search, levelFilter]);

  const overallRate = (MOCK_DATA.reduce((s, r) => s + r.errorRate, 0) / MOCK_DATA.length).toFixed(1);
  const criticalCount = MOCK_DATA.filter((r) => r.errorRate >= 15).length;
  const perfectCount = MOCK_DATA.filter((r) => r.errorRate === 0).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { label: "평균 오류율", value: `${overallRate}%`, sub: "전체 세션" },
          { label: "모니터링 세션", value: MOCK_DATA.length, sub: "최근 7일" },
          { label: "심각 (15%↑)", value: criticalCount, sub: "즉시 조치 필요", color: "text-destructive" },
          { label: "완벽 (오류 없음)", value: perfectCount, sub: "전체의 " + Math.round(perfectCount / MOCK_DATA.length * 100) + "%", color: "text-green-600" },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.color ?? ""}`}>{s.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{s.sub}</p>
          </Card>
        ))}
      </div>

      {/* Daily Trend */}
      <Card className="p-4">
        <p className="mb-4 text-sm font-semibold">일별 평균 STT 오류율 추이</p>
        <div className="flex items-end gap-3 h-24">
          {DAILY_TREND.map((d) => {
            const height = (d.avgRate / maxRate) * 100;
            const color = d.avgRate < 5 ? "bg-green-500" : d.avgRate < 15 ? "bg-amber-500" : "bg-red-500";
            return (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs text-muted-foreground">{d.avgRate}%</span>
                <div className="flex w-full flex-col justify-end" style={{ height: "64px" }}>
                  <div
                    className={`w-full rounded-t-sm transition-all ${color}`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{d.date}</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="닉네임 또는 세션 ID 검색..."
          className="h-9 w-64 bg-muted/40 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="h-9 w-36 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체</SelectItem>
            <SelectItem value="good">양호 (5% 미만)</SelectItem>
            <SelectItem value="caution">주의 (5-15%)</SelectItem>
            <SelectItem value="critical">심각 (15%↑)</SelectItem>
          </SelectContent>
        </Select>
        <p className="ml-auto text-sm text-muted-foreground">
          총 <span className="font-semibold text-foreground">{filtered.length}</span>건
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border/60">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">세션 ID</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">사용자</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">직군</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">총 단어 수</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">오류 단어</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">오류율</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">오류 유형</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">날짜</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 bg-background">
            {filtered.map((r) => (
              <tr key={r.sessionId} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">#{r.sessionId}</td>
                <td className="px-4 py-3 font-medium">{r.nickname}</td>
                <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{r.jobCategory}</Badge></td>
                <td className="px-4 py-3 text-center">{r.totalWords.toLocaleString()}</td>
                <td className="px-4 py-3 text-center font-medium">{r.errorWords}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20">
                      <Progress value={Math.min(r.errorRate, 100)} className="h-1.5" />
                    </div>
                    <span className={`text-xs font-semibold ${errorRateColor(r.errorRate)}`}>
                      {r.errorRate.toFixed(1)}%
                    </span>
                    {errorRateBadge(r.errorRate)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {r.errorTypes.length === 0 ? (
                    <span className="text-xs text-muted-foreground">—</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {r.errorTypes.map((t) => (
                        <span key={t} className="rounded-sm bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex h-32 items-center justify-center gap-2 text-sm text-muted-foreground">
            <MicOff className="h-4 w-4" />
            조건에 맞는 데이터가 없습니다.
          </div>
        )}
      </div>
    </motion.div>
  );
}
