"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Eye, CheckCircle, Archive, Plus } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";

type PromptStatus = "active" | "draft" | "archived";
type PromptType = "system" | "evaluation" | "feedback";

interface PromptVersion {
  id: string;
  name: string;
  version: string;
  type: PromptType;
  status: PromptStatus;
  content: string;
  updatedAt: string;
  updatedBy: string;
}

const MOCK_DATA: PromptVersion[] = [
  { id: "p001", name: "면접 시스템 프롬프트", version: "v3.2.1", type: "system", status: "active", content: "당신은 전문적인 면접관입니다. 지원자의 답변을 꼼꼼히 듣고 후속 질문을 통해 깊이 있는 답변을 이끌어 내세요. 답변의 구체성, 논리적 흐름, 실무 경험의 연관성을 중심으로 평가합니다...", updatedAt: "2026.02.20", updatedBy: "admin" },
  { id: "p002", name: "면접 시스템 프롬프트", version: "v3.2.0", type: "system", status: "archived", content: "당신은 전문적인 면접관입니다. 지원자의 답변을 평가하고 적절한 후속 질문을 제공하세요...", updatedAt: "2026.02.01", updatedBy: "admin" },
  { id: "p003", name: "평가 기준 프롬프트", version: "v2.1.0", type: "evaluation", status: "active", content: "다음 기준으로 지원자의 답변을 0-100점으로 평가하세요:\n1. 내용의 구체성 (30점)\n2. 논리적 흐름 (25점)\n3. 직무 연관성 (25점)\n4. 커뮤니케이션 능력 (20점)...", updatedAt: "2026.02.15", updatedBy: "admin" },
  { id: "p004", name: "피드백 생성 프롬프트", version: "v1.5.2", type: "feedback", status: "active", content: "면접 결과를 바탕으로 지원자에게 건설적인 피드백을 제공하세요. 잘한 점 2가지와 개선할 점 2가지를 명확하게 설명하고...", updatedAt: "2026.02.18", updatedBy: "admin" },
  { id: "p005", name: "피드백 생성 프롬프트", version: "v1.5.1", type: "feedback", status: "archived", content: "면접 결과를 바탕으로 지원자에게 피드백을 제공하세요...", updatedAt: "2026.01.30", updatedBy: "admin" },
  { id: "p006", name: "평가 기준 프롬프트", version: "v2.2.0", type: "evaluation", status: "draft", content: "개선된 평가 기준으로 답변을 평가합니다. (초안)", updatedAt: "2026.02.26", updatedBy: "admin" },
];

const statusConfig: Record<PromptStatus, { label: string; className: string }> = {
  active: { label: "활성", className: "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400" },
  draft: { label: "초안", className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400" },
  archived: { label: "보관됨", className: "bg-muted text-muted-foreground" },
};

const typeConfig: Record<PromptType, { label: string; className: string }> = {
  system: { label: "시스템", className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400" },
  evaluation: { label: "평가", className: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400" },
  feedback: { label: "피드백", className: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400" },
};

export function PromptsClient() {
  const [viewTarget, setViewTarget] = useState<PromptVersion | null>(null);

  const activePrompts = MOCK_DATA.filter((prompt) => prompt.status === "active");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Active versions */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">현재 활성 버전</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {activePrompts.map((prompt) => {
            const promptType = typeConfig[prompt.type];
            return (
              <Card key={prompt.id} className="p-4 border-l-4 border-l-primary">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{prompt.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{prompt.version}</p>
                  </div>
                  <Badge variant="outline" className={`shrink-0 text-xs ${promptType.className}`}>{promptType.label}</Badge>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{prompt.content}</p>
                <p className="mt-2 text-xs text-muted-foreground">수정: {prompt.updatedAt}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">전체 버전 이력</h3>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          새 버전 작성
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border/60">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">프롬프트명</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">버전</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">유형</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">상태</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">수정일</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">수정자</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 bg-background">
            {MOCK_DATA.map((prompt) => {
              const promptStatus = statusConfig[prompt.status];
              const promptType = typeConfig[prompt.type];
              return (
                <tr key={prompt.id} className="group transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{prompt.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <GitBranch className="h-3.5 w-3.5" />
                      {prompt.version}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-xs ${promptType.className}`}>{promptType.label}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`text-xs ${promptStatus.className}`}>{promptStatus.label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{prompt.updatedAt}</td>
                  <td className="px-4 py-3 text-muted-foreground">{prompt.updatedBy}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewTarget(prompt)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      {prompt.status === "draft" && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600">
                          <CheckCircle className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {prompt.status === "active" && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                          <Archive className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* View Dialog */}
      {viewTarget && (
        <Dialog open={!!viewTarget} onOpenChange={() => setViewTarget(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                {viewTarget.name} · {viewTarget.version}
              </DialogTitle>
            </DialogHeader>
            <div className="rounded-md bg-muted/50 p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{viewTarget.content}</p>
            </div>
            <p className="text-xs text-muted-foreground">마지막 수정: {viewTarget.updatedAt} by {viewTarget.updatedBy}</p>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
}
