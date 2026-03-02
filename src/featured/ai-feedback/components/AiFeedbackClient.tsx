"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
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

interface FeedbackRecord {
  sessionId: string;
  nickname: string;
  jobCategory: string;
  avgScore: number;
  feedbackQuality: number; // 1-5
  completeness: number; // 0-100
  relevance: number; // 0-100
  reviewedAt: string;
}

const MOCK_DATA: FeedbackRecord[] = [
  { sessionId: "4901", nickname: "최유진", jobCategory: "PM", avgScore: 88, feedbackQuality: 5, completeness: 96, relevance: 94, reviewedAt: "2026.02.27" },
  { sessionId: "4900", nickname: "김민준", jobCategory: "프론트엔드", avgScore: 74, feedbackQuality: 4, completeness: 88, relevance: 85, reviewedAt: "2026.02.27" },
  { sessionId: "4898", nickname: "이서연", jobCategory: "백엔드", avgScore: 92, feedbackQuality: 5, completeness: 98, relevance: 97, reviewedAt: "2026.02.26" },
  { sessionId: "4896", nickname: "임서준", jobCategory: "데이터 분석", avgScore: 61, feedbackQuality: 3, completeness: 72, relevance: 68, reviewedAt: "2026.02.25" },
  { sessionId: "4894", nickname: "최유진", jobCategory: "PM", avgScore: 79, feedbackQuality: 4, completeness: 84, relevance: 80, reviewedAt: "2026.02.24" },
  { sessionId: "4892", nickname: "강도윤", jobCategory: "백엔드", avgScore: 85, feedbackQuality: 4, completeness: 90, relevance: 88, reviewedAt: "2026.02.23" },
  { sessionId: "4890", nickname: "윤하은", jobCategory: "디자이너", avgScore: 55, feedbackQuality: 2, completeness: 61, relevance: 58, reviewedAt: "2026.02.22" },
  { sessionId: "4888", nickname: "박준혁", jobCategory: "풀스택", avgScore: 70, feedbackQuality: 3, completeness: 75, relevance: 72, reviewedAt: "2026.02.21" },
];

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i <= value ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
        />
      ))}
    </div>
  );
}

function qualityBadge(q: number) {
  if (q >= 5) return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">우수</Badge>;
  if (q >= 4) return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">양호</Badge>;
  if (q >= 3) return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">보통</Badge>;
  return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">개선 필요</Badge>;
}

export function AiFeedbackClient() {
  const [search, setSearch] = useState("");
  const [qualityFilter, setQualityFilter] = useState("all");

  const filtered = useMemo(() => {
    return MOCK_DATA.filter((r) => {
      const matchSearch = !search || r.nickname.includes(search) || r.sessionId.includes(search);
      const matchQuality =
        qualityFilter === "all" ||
        (qualityFilter === "high" && r.feedbackQuality >= 4) ||
        (qualityFilter === "mid" && r.feedbackQuality === 3) ||
        (qualityFilter === "low" && r.feedbackQuality <= 2);
      return matchSearch && matchQuality;
    });
  }, [search, qualityFilter]);

  const avgQuality = (MOCK_DATA.reduce((s, r) => s + r.feedbackQuality, 0) / MOCK_DATA.length).toFixed(1);
  const highQualityPct = Math.round((MOCK_DATA.filter(r => r.feedbackQuality >= 4).length / MOCK_DATA.length) * 100);

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
          { label: "평균 품질 점수", value: `${avgQuality} / 5`, sub: "전체 세션" },
          { label: "총 검토 건수", value: MOCK_DATA.length, sub: "이번 주" },
          { label: "우수 피드백 비율", value: `${highQualityPct}%`, sub: "품질 4점 이상" },
          { label: "개선 필요", value: MOCK_DATA.filter(r => r.feedbackQuality <= 2).length, sub: "품질 2점 이하" },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-bold">{s.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{s.sub}</p>
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
        <Select value={qualityFilter} onValueChange={setQualityFilter}>
          <SelectTrigger className="h-9 w-36 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 품질</SelectItem>
            <SelectItem value="high">우수 (4-5점)</SelectItem>
            <SelectItem value="mid">보통 (3점)</SelectItem>
            <SelectItem value="low">개선 필요 (1-2점)</SelectItem>
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
              <th className="px-4 py-3 text-center font-medium text-muted-foreground">면접 점수</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">피드백 품질</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">완성도</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">관련성</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">검토일</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 bg-background">
            {filtered.map((r) => (
              <tr key={r.sessionId} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">#{r.sessionId}</td>
                <td className="px-4 py-3 font-medium">{r.nickname}</td>
                <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{r.jobCategory}</Badge></td>
                <td className="px-4 py-3 text-center font-semibold">{r.avgScore}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <StarRating value={r.feedbackQuality} />
                    {qualityBadge(r.feedbackQuality)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Progress value={r.completeness} className="h-1.5 w-20" />
                    <span className="text-xs text-muted-foreground">{r.completeness}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Progress value={r.relevance} className="h-1.5 w-20" />
                    <span className="text-xs text-muted-foreground">{r.relevance}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{r.reviewedAt}</td>
              </tr>
            ))}
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
