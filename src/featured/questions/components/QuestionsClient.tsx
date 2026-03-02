"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { QuestionTable } from "./QuestionTable";
import { QuestionDialog } from "./QuestionDialog";
import type { CommonQuestion, QuestionCategory } from "@/featured/questions/types";

const INITIAL_QUESTIONS: CommonQuestion[] = [
  {
    id: "1",
    content: "간단한 자기소개를 해주세요.",
    category: "자기소개",
    isActive: true,
    usageCount: 8420,
    createdAt: "2025.10.01",
    updatedAt: "2026.01.15",
  },
  {
    id: "2",
    content: "본인의 가장 큰 강점과 그것을 발휘했던 경험을 말씀해주세요.",
    category: "강점/약점",
    isActive: true,
    usageCount: 7210,
    createdAt: "2025.10.01",
    updatedAt: "2026.01.15",
  },
  {
    id: "3",
    content: "저희 회사에 지원한 동기가 무엇인가요?",
    category: "지원 동기",
    isActive: true,
    usageCount: 6890,
    createdAt: "2025.10.01",
    updatedAt: "2025.12.20",
  },
  {
    id: "4",
    content: "팀 프로젝트에서 갈등이 발생했을 때 어떻게 해결했나요?",
    category: "경험",
    isActive: true,
    usageCount: 5640,
    createdAt: "2025.10.15",
    updatedAt: "2025.12.20",
  },
  {
    id: "5",
    content: "본인의 단점을 말씀해주시고, 이를 어떻게 개선하고 있나요?",
    category: "강점/약점",
    isActive: true,
    usageCount: 5320,
    createdAt: "2025.10.15",
    updatedAt: "2025.12.20",
  },
  {
    id: "6",
    content: "5년 후 자신의 모습을 어떻게 그리고 있나요?",
    category: "지원 동기",
    isActive: false,
    usageCount: 3140,
    createdAt: "2025.11.01",
    updatedAt: "2026.02.01",
  },
  {
    id: "7",
    content: "최근에 배운 기술이나 트렌드 중 가장 인상 깊었던 것은 무엇인가요?",
    category: "기술",
    isActive: true,
    usageCount: 2880,
    createdAt: "2025.11.10",
    updatedAt: "2025.12.01",
  },
  {
    id: "8",
    content: "마감 기한이 촉박한 상황에서 어떻게 업무를 처리하나요?",
    category: "상황",
    isActive: true,
    usageCount: 2650,
    createdAt: "2025.11.20",
    updatedAt: "2025.12.10",
  },
  {
    id: "9",
    content: "이전 직장(또는 프로젝트)에서 가장 어려웠던 순간과 극복 방법을 말씀해주세요.",
    category: "행동",
    isActive: true,
    usageCount: 2210,
    createdAt: "2025.12.01",
    updatedAt: "2026.01.05",
  },
];

const CATEGORIES: Array<QuestionCategory | "전체"> = [
  "전체",
  "자기소개",
  "지원 동기",
  "강점/약점",
  "경험",
  "기술",
  "행동",
  "상황",
];

export function QuestionsClient() {
  const [questions, setQuestions] = useState<CommonQuestion[]>(INITIAL_QUESTIONS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<QuestionCategory | "전체">("전체");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filtered = useMemo(() => {
    return questions
      .filter((q) => {
        if (search && !q.content.toLowerCase().includes(search.toLowerCase()))
          return false;
        if (category !== "전체" && q.category !== category) return false;
        if (activeTab === "active" && !q.isActive) return false;
        if (activeTab === "inactive" && q.isActive) return false;
        return true;
      })
      .sort((a, b) => b.usageCount - a.usageCount);
  }, [questions, search, category, activeTab]);

  const handleUpdate = (id: string, data: Partial<CommonQuestion>) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...data } : q))
    );
  };

  const handleDelete = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleAdd = (data: {
    content: string;
    category: QuestionCategory;
    isActive: boolean;
  }) => {
    const newQuestion: CommonQuestion = {
      id: String(Date.now()),
      ...data,
      usageCount: 0,
      createdAt: "2026.02.27",
      updatedAt: "2026.02.27",
    };
    setQuestions((prev) => [newQuestion, ...prev]);
  };

  const activeCount = questions.filter((q) => q.isActive).length;
  const inactiveCount = questions.filter((q) => !q.isActive).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Stats */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-foreground">
          전체{" "}
          <span className="font-semibold text-foreground">{questions.length}</span>
          개
        </span>
        <span className="text-muted-foreground">
          활성{" "}
          <span className="font-semibold text-primary">{activeCount}</span>개
        </span>
        <span className="text-muted-foreground">
          비활성{" "}
          <span className="font-semibold text-foreground">{inactiveCount}</span>
          개
        </span>
      </div>

      {/* Tabs + Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        >
          <TabsList className="h-9">
            <TabsTrigger value="all" className="text-xs">
              전체
            </TabsTrigger>
            <TabsTrigger value="active" className="text-xs">
              활성
            </TabsTrigger>
            <TabsTrigger value="inactive" className="text-xs">
              비활성
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="질문 내용 검색..."
            className="pl-9 h-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select
          value={category}
          onValueChange={(v) =>
            setCategory(v as QuestionCategory | "전체")
          }
        >
          <SelectTrigger className="h-9 w-36">
            <Filter className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          size="sm"
          className="h-9 gap-1.5"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          질문 추가
        </Button>
      </div>

      <QuestionTable
        questions={filtered}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />

      <QuestionDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleAdd}
      />
    </motion.div>
  );
}
