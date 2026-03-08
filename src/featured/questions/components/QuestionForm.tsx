"use client";

import { useState } from "react";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { Switch } from "@/shared/ui/switch";
import type { CommonQuestion } from "@/featured/questions/types";

interface QuestionFormProps {
  initial?: Partial<CommonQuestion>;
  onChange: (data: { content: string; isActive: boolean }) => void;
}

export function QuestionForm({ initial, onChange }: QuestionFormProps) {
  const [content, setContent] = useState(initial?.content ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

  const handleChange = (
    updates: Partial<{ content: string; isActive: boolean }>
  ) => {
    const next = {
      content: updates.content ?? content,
      isActive: updates.isActive ?? isActive,
    };
    if ("content" in updates) setContent(updates.content!);
    if ("isActive" in updates) setIsActive(updates.isActive!);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>질문 내용</Label>
        <Textarea
          placeholder="질문 내용을 입력하세요..."
          value={content}
          onChange={(e) => handleChange({ content: e.target.value })}
          className="resize-none min-h-24"
          rows={4}
        />
        <p className="text-xs text-muted-foreground text-right">
          {content.length}자
        </p>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3">
        <div>
          <p className="text-sm font-medium">질문 활성화</p>
          <p className="text-xs text-muted-foreground">
            비활성화 시 면접에서 사용되지 않습니다
          </p>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={(v) => handleChange({ isActive: v })}
        />
      </div>
    </div>
  );
}
