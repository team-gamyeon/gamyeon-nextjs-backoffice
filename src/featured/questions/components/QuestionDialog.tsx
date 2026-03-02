"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { QuestionForm } from "./QuestionForm";
import type { CommonQuestion, QuestionCategory } from "@/featured/questions/types";

interface QuestionDialogProps {
  question?: CommonQuestion;
  open: boolean;
  onClose: () => void;
  onSave: (data: { content: string; category: QuestionCategory; isActive: boolean }) => void;
}

export function QuestionDialog({
  question,
  open,
  onClose,
  onSave,
}: QuestionDialogProps) {
  const [formData, setFormData] = useState<{
    content: string;
    category: QuestionCategory;
    isActive: boolean;
  }>({
    content: question?.content ?? "",
    category: question?.category ?? "자기소개",
    isActive: question?.isActive ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    onSave(formData);
    setIsSubmitting(false);
    onClose();
  };

  const isEdit = !!question;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "질문 수정" : "새 질문 추가"}</DialogTitle>
        </DialogHeader>

        <QuestionForm initial={question} onChange={setFormData} />

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            취소
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.content.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                저장 중...
              </span>
            ) : isEdit ? (
              "수정 저장"
            ) : (
              "질문 추가"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
