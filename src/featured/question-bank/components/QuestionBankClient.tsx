"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, RefreshCw, Database } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Card } from "@/shared/ui/card";

type EmbeddingStatus = "embedded" | "pending" | "failed";

interface QuestionBankItem {
  id: string;
  content: string;
  category: string;
  jobType: string;
  embeddingStatus: EmbeddingStatus;
  usageCount: number;
  createdAt: string;
}

const MOCK_DATA: QuestionBankItem[] = [
  { id: "qb001", content: "본인의 강점과 약점을 구체적인 경험을 들어 설명해 주세요.", category: "강점/약점", jobType: "공통", embeddingStatus: "embedded", usageCount: 1240, createdAt: "2026.01.10" },
  { id: "qb002", content: "React의 렌더링 최적화 방법에 대해 설명해 주세요.", category: "기술", jobType: "프론트엔드", embeddingStatus: "embedded", usageCount: 820, createdAt: "2026.01.15" },
  { id: "qb003", content: "데이터베이스 인덱스의 원리와 활용 방법을 설명해 주세요.", category: "기술", jobType: "백엔드", embeddingStatus: "embedded", usageCount: 654, createdAt: "2026.01.18" },
  { id: "qb004", content: "프로젝트에서 갈등이 발생했을 때 어떻게 해결했는지 사례를 들어 주세요.", category: "경험", jobType: "공통", embeddingStatus: "embedded", usageCount: 980, createdAt: "2026.01.20" },
  { id: "qb005", content: "머신러닝 모델의 과적합을 방지하는 방법을 설명해 주세요.", category: "기술", jobType: "데이터 분석", embeddingStatus: "pending", usageCount: 0, createdAt: "2026.02.20" },
  { id: "qb006", content: "PM으로서 우선순위 결정 시 어떤 프레임워크를 사용하나요?", category: "경험", jobType: "PM", embeddingStatus: "pending", usageCount: 0, createdAt: "2026.02.22" },
  { id: "qb007", content: "UX 리서치 결과를 디자인에 반영한 경험을 말씀해 주세요.", category: "경험", jobType: "디자이너", embeddingStatus: "failed", usageCount: 0, createdAt: "2026.02.24" },
  { id: "qb008", content: "대규모 트래픽 처리 경험이 있다면 어떤 방식을 사용했나요?", category: "기술", jobType: "백엔드", embeddingStatus: "embedded", usageCount: 430, createdAt: "2026.02.01" },
  { id: "qb009", content: "지원 동기와 입사 후 목표를 말씀해 주세요.", category: "지원 동기", jobType: "공통", embeddingStatus: "embedded", usageCount: 1560, createdAt: "2026.01.05" },
  { id: "qb010", content: "CI/CD 파이프라인 구축 경험을 설명해 주세요.", category: "기술", jobType: "풀스택", embeddingStatus: "pending", usageCount: 0, createdAt: "2026.02.25" },
];

const embeddingConfig: Record<EmbeddingStatus, { label: string; className: string }> = {
  embedded: { label: "임베딩 완료", className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20" },
  pending: { label: "대기 중", className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20" },
  failed: { label: "실패", className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" },
};

const statCards = [
  { label: "전체 질문", value: "10", icon: Database, color: "text-primary" },
  { label: "임베딩 완료", value: "5", icon: Database, color: "text-green-600" },
  { label: "대기 중", value: "3", icon: RefreshCw, color: "text-amber-600" },
  { label: "실패", value: "1", icon: Trash2, color: "text-destructive" },
];

export function QuestionBankClient() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EmbeddingStatus | "all">("all");
  const [jobFilter, setJobFilter] = useState("전체");

  const filtered = useMemo(() => {
    return MOCK_DATA.filter((q) => {
      const matchSearch = !search || q.content.includes(search) || q.category.includes(search);
      const matchStatus = statusFilter === "all" || q.embeddingStatus === statusFilter;
      const matchJob = jobFilter === "전체" || q.jobType === jobFilter;
      return matchSearch && matchStatus && matchJob;
    });
  }, [search, statusFilter, jobFilter]);

  const jobTypes = ["전체", "공통", "프론트엔드", "백엔드", "풀스택", "PM", "디자이너", "데이터 분석"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { label: "전체 질문", value: MOCK_DATA.length },
          { label: "임베딩 완료", value: MOCK_DATA.filter(q => q.embeddingStatus === "embedded").length, color: "text-green-600" },
          { label: "대기 중", value: MOCK_DATA.filter(q => q.embeddingStatus === "pending").length, color: "text-amber-600" },
          { label: "실패", value: MOCK_DATA.filter(q => q.embeddingStatus === "failed").length, color: "text-destructive" },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className={`mt-1 text-2xl font-bold ${s.color ?? ""}`}>{s.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="질문 내용 또는 카테고리 검색..."
          className="h-9 w-72 bg-muted/40 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as EmbeddingStatus | "all")}>
          <SelectTrigger className="h-9 w-36 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 상태</SelectItem>
            <SelectItem value="embedded">임베딩 완료</SelectItem>
            <SelectItem value="pending">대기 중</SelectItem>
            <SelectItem value="failed">실패</SelectItem>
          </SelectContent>
        </Select>
        <Select value={jobFilter} onValueChange={setJobFilter}>
          <SelectTrigger className="h-9 w-36 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {jobTypes.map((j) => <SelectItem key={j} value={j}>{j}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" />
            재임베딩
          </Button>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            질문 추가
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border/60">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">질문 내용</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">카테고리</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">직군</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">임베딩 상태</th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">사용 횟수</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">등록일</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 bg-background">
            {filtered.map((q) => {
              const eb = embeddingConfig[q.embeddingStatus];
              return (
                <tr key={q.id} className="group transition-colors hover:bg-muted/30">
                  <td className="max-w-xs px-4 py-3">
                    <p className="truncate font-medium">{q.content}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{q.category}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">{q.jobType}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={eb.className}>{eb.label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center font-medium">{q.usageCount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-muted-foreground">{q.createdAt}</td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </motion.div>
  );
}
