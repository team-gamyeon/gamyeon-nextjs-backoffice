"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AlertOctagon, Eye, XCircle, ShieldCheck } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

type Severity = "low" | "medium" | "high";
type AnomalyStatus = "pending" | "reviewing" | "dismissed";
type AnomalyType =
  | "rapid_completion"
  | "repeated_answer"
  | "no_audio"
  | "multiple_restarts"
  | "abnormal_score_gap";

interface AnomalyRecord {
  id: string;
  sessionId: string;
  nickname: string;
  jobCategory: string;
  type: AnomalyType;
  severity: Severity;
  detail: string;
  detectedAt: string;
  status: AnomalyStatus;
}

const MOCK_DATA: AnomalyRecord[] = [
  { id: "a001", sessionId: "4855", nickname: "테스트계정1", jobCategory: "백엔드", type: "rapid_completion", severity: "high", detail: "평균 완료 시간(28분)의 13% 수준인 3분 42초만에 완료", detectedAt: "2026.02.27 11:20", status: "pending" },
  { id: "a002", sessionId: "4822", nickname: "박준혁", jobCategory: "풀스택", type: "repeated_answer", severity: "medium", detail: "3개 질문에서 거의 동일한 답변 패턴 감지 (유사도 92%)", detectedAt: "2026.02.26 15:45", status: "reviewing" },
  { id: "a003", sessionId: "4810", nickname: "이름없음", jobCategory: "PM", type: "no_audio", severity: "high", detail: "5개 질문 중 4개 답변에서 오디오 미감지", detectedAt: "2026.02.25 10:30", status: "pending" },
  { id: "a004", sessionId: "4790", nickname: "임서준", jobCategory: "데이터 분석", type: "multiple_restarts", severity: "low", detail: "세션 재시작 4회 감지 (평균: 0.8회)", detectedAt: "2026.02.24 16:10", status: "dismissed" },
  { id: "a005", sessionId: "4780", nickname: "테스트계정2", jobCategory: "프론트엔드", type: "rapid_completion", severity: "high", detail: "평균 완료 시간의 8% 수준인 2분 10초만에 완료", detectedAt: "2026.02.24 09:05", status: "pending" },
  { id: "a006", sessionId: "4750", nickname: "윤하은", jobCategory: "디자이너", type: "abnormal_score_gap", severity: "medium", detail: "자기평가 점수와 AI 평가 점수 간 격차 38점 (임계치: 25점)", detectedAt: "2026.02.23 14:22", status: "reviewing" },
  { id: "a007", sessionId: "4720", nickname: "테스트계정3", jobCategory: "백엔드", type: "repeated_answer", severity: "low", detail: "2개 질문에서 유사 답변 감지 (유사도 78%)", detectedAt: "2026.02.22 20:00", status: "dismissed" },
];

const severityConfig: Record<Severity, { label: string; className: string; dotColor: string }> = {
  high: { label: "심각", className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400", dotColor: "bg-red-500" },
  medium: { label: "주의", className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400", dotColor: "bg-amber-500" },
  low: { label: "낮음", className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400", dotColor: "bg-blue-400" },
};

const statusConfig: Record<AnomalyStatus, { label: string; className: string }> = {
  pending: { label: "대기 중", className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400" },
  reviewing: { label: "검토 중", className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400" },
  dismissed: { label: "무시됨", className: "bg-muted text-muted-foreground" },
};

const typeLabel: Record<AnomalyType, string> = {
  rapid_completion: "빠른 완료",
  repeated_answer: "반복 답변",
  no_audio: "오디오 미감지",
  multiple_restarts: "반복 재시작",
  abnormal_score_gap: "점수 이상",
};

export function AnomalyClient() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AnomalyStatus | "all">("all");

  const filtered = useMemo(() => {
    return MOCK_DATA.filter((r) => {
      const matchSearch = !search || r.nickname.includes(search) || r.sessionId.includes(search);
      const matchSeverity = severityFilter === "all" || r.severity === severityFilter;
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchSearch && matchSeverity && matchStatus;
    });
  }, [search, severityFilter, statusFilter]);

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
          { label: "전체 이상 감지", value: MOCK_DATA.length, color: "" },
          { label: "심각", value: MOCK_DATA.filter(r => r.severity === "high").length, color: "text-destructive" },
          { label: "검토 중", value: MOCK_DATA.filter(r => r.status === "reviewing").length, color: "text-blue-600" },
          { label: "무시됨", value: MOCK_DATA.filter(r => r.status === "dismissed").length, color: "text-muted-foreground" },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.color}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="닉네임 또는 세션 ID 검색..."
          className="h-9 w-64 bg-muted/40 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as Severity | "all")}>
          <SelectTrigger className="h-9 w-32 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 심각도</SelectItem>
            <SelectItem value="high">심각</SelectItem>
            <SelectItem value="medium">주의</SelectItem>
            <SelectItem value="low">낮음</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AnomalyStatus | "all")}>
          <SelectTrigger className="h-9 w-32 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 상태</SelectItem>
            <SelectItem value="pending">대기 중</SelectItem>
            <SelectItem value="reviewing">검토 중</SelectItem>
            <SelectItem value="dismissed">무시됨</SelectItem>
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
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">심각도</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">세션 ID</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">사용자</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">직군</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">이상 유형</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">감지 상세</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">상태</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">감지 시각</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 bg-background">
            {filtered.map((r) => {
              const sv = severityConfig[r.severity];
              const st = statusConfig[r.status];
              return (
                <tr key={r.id} className="group transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={`h-2 w-2 rounded-full ${sv.dotColor}`} />
                      <Badge variant="outline" className={`text-xs ${sv.className}`}>{sv.label}</Badge>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">#{r.sessionId}</td>
                  <td className="px-4 py-3 font-medium">{r.nickname}</td>
                  <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{r.jobCategory}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground">{typeLabel[r.type]}</td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="truncate text-xs text-muted-foreground">{r.detail}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-xs ${st.className}`}>{st.label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{r.detectedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="상세 보기">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      {r.status === "pending" && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-600" title="검토 시작">
                          <ShieldCheck className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {r.status !== "dismissed" && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" title="무시">
                          <XCircle className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex h-32 items-center justify-center gap-2 text-sm text-muted-foreground">
            <AlertOctagon className="h-4 w-4" />
            이상 감지 내역이 없습니다.
          </div>
        )}
      </div>
    </motion.div>
  );
}
