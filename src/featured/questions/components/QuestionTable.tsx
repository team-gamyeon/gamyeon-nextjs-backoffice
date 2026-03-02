"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { QuestionDialog } from "./QuestionDialog";
import type { CommonQuestion, QuestionCategory } from "@/featured/questions/types";

const CATEGORY_COLORS: Record<string, string> = {
  자기소개: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  "지원 동기": "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
  "강점/약점": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  경험: "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
  기술: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20",
  행동: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-500/10 dark:text-pink-400 dark:border-pink-500/20",
  상황: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
};

interface QuestionTableProps {
  questions: CommonQuestion[];
  onUpdate: (id: string, data: Partial<CommonQuestion>) => void;
  onDelete: (id: string) => void;
}

export function QuestionTable({
  questions,
  onUpdate,
  onDelete,
}: QuestionTableProps) {
  const [editTarget, setEditTarget] = useState<CommonQuestion | null>(null);

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-border/60">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                카테고리
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                질문 내용
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                상태
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                사용 횟수
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                수정일
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 bg-background">
            {questions.map((question, i) => (
              <motion.tr
                key={question.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="group transition-colors hover:bg-muted/30"
              >
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={CATEGORY_COLORS[question.category] ?? ""}
                  >
                    {question.category}
                  </Badge>
                </td>
                <td className="max-w-md px-4 py-3">
                  <p className="line-clamp-2 leading-relaxed">{question.content}</p>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() =>
                      onUpdate(question.id, { isActive: !question.isActive })
                    }
                    className="flex items-center gap-1.5 text-sm transition-colors"
                  >
                    {question.isActive ? (
                      <>
                        <ToggleRight className="h-4 w-4 text-primary" />
                        <span className="text-primary font-medium">활성</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">비활성</span>
                      </>
                    )}
                  </button>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {question.usageCount.toLocaleString()}회
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {question.updatedAt}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setEditTarget(question)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(question.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {questions.length === 0 && (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            등록된 질문이 없습니다.
          </div>
        )}
      </div>

      {editTarget && (
        <QuestionDialog
          question={editTarget}
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          onSave={(data) => {
            onUpdate(editTarget.id, { ...data, updatedAt: "2026.02.27" });
            setEditTarget(null);
          }}
        />
      )}
    </>
  );
}
