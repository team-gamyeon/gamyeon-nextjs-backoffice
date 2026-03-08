"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { QuestionDialog } from "./QuestionDialog";
import type { CommonQuestion } from "@/featured/questions/types";

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
                질문 내용
              </th>
              <th className="w-28 px-4 py-3 text-left font-medium text-muted-foreground">
                상태
              </th>
              <th className="w-32 px-4 py-3 text-left font-medium text-muted-foreground">
                생성일시
              </th>
              <th className="w-32 px-4 py-3 text-left font-medium text-muted-foreground">
                수정일
              </th>
              <th className="w-20 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 bg-background">
            <AnimatePresence initial={false}>
            {questions.map((question) => (
              <motion.tr
                key={question.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="group transition-colors hover:bg-muted/30"
              >
                <td className="max-w-md px-4 py-3">
                  <p className="line-clamp-2 leading-relaxed">{question.content}</p>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() =>
                      onUpdate(question.id, { isActive: !question.isActive })
                    }
                    className={cn(
                      "cursor-pointer inline-flex h-7 w-20 items-center justify-center rounded-full text-xs font-medium transition-colors",
                      question.isActive
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "bg-muted text-muted-foreground hover:bg-muted/60",
                    )}
                  >
                    {question.isActive ? "활성" : "비활성"}
                  </button>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {question.createdAt}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {question.updatedAt}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      onClick={() => setEditTarget(question)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onDelete(question.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
            </AnimatePresence>
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
            onUpdate(editTarget.id, { ...data, updatedAt: "2026.03.07" });
            setEditTarget(null);
          }}
        />
      )}
    </>
  );
}
