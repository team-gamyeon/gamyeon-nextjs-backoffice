"use client";

import { useState } from "react";
import { AlertTriangle, ShieldOff, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import type { Member } from "@/featured/members/types";

const WARNING_REASONS = [
  "부적절한 언어 사용",
  "스팸성 반복 사용",
  "시스템 남용 의심",
  "기타",
];

const SUSPEND_REASONS = [
  "반복적인 약관 위반",
  "비정상적인 사용 패턴",
  "허위 정보 등록",
  "기타",
];

interface SanctionDialogProps {
  member: Member;
  type: "warning" | "suspended" | "release";
  open: boolean;
  onClose: () => void;
}

export function SanctionDialog({
  member,
  type,
  open,
  onClose,
}: SanctionDialogProps) {
  const [reason, setReason] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmitting(false);
    onClose();
  };

  const config = {
    warning: {
      title: "경고 처분",
      description: `${member.nickname}님에게 경고를 부여합니다.`,
      icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
      iconBg: "bg-amber-50 dark:bg-amber-500/10",
      reasons: WARNING_REASONS,
      submitLabel: "경고 처분",
      submitClass:
        "bg-amber-500 text-white hover:bg-amber-600",
    },
    suspended: {
      title: "정지 처분",
      description: `${member.nickname}님의 계정을 정지합니다.`,
      icon: <ShieldOff className="h-5 w-5 text-destructive" />,
      iconBg: "bg-destructive/10",
      reasons: SUSPEND_REASONS,
      submitLabel: "정지 처분",
      submitClass: "bg-destructive text-white hover:bg-destructive/90",
    },
    release: {
      title: "제재 해제",
      description: `${member.nickname}님의 제재를 해제합니다.`,
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      iconBg: "bg-green-50 dark:bg-green-500/10",
      reasons: ["제재 기간 만료", "소명 인정", "오류 수정", "기타"],
      submitLabel: "제재 해제",
      submitClass: "bg-green-600 text-white hover:bg-green-700",
    },
  }[type];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className={`rounded-lg p-1.5 ${config.iconBg}`}>
              {config.icon}
            </span>
            {config.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{config.description}</p>

          <div className="space-y-1.5">
            <Label>사유 선택</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="사유를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {config.reasons.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>
              관리자 메모{" "}
              <span className="text-muted-foreground font-normal">(선택)</span>
            </Label>
            <Textarea
              placeholder="추가 메모를 입력하세요..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            취소
          </Button>
          <Button
            className={config.submitClass}
            onClick={handleSubmit}
            disabled={!reason || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                처리 중...
              </span>
            ) : (
              config.submitLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
