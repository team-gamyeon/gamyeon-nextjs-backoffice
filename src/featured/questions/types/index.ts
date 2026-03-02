export type QuestionCategory =
  | "자기소개"
  | "지원 동기"
  | "강점/약점"
  | "경험"
  | "기술"
  | "행동"
  | "상황";

export interface CommonQuestion {
  id: string;
  content: string;
  category: QuestionCategory;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionFiltersState {
  search: string;
  category: QuestionCategory | "전체";
  isActive: "all" | "active" | "inactive";
}
