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

// API 응답 타입
export type QuestionStatus = "ACTIVE" | "INACTIVE" | "DELETED";

export interface ApiQuestion {
  id: string;
  content: string;
  status: QuestionStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface QuestionListResponse {
  totalCount: number;
  filteredCount: number;
  page: number;
  limit: number;
  items: ApiQuestion[];
}

export interface CreateQuestionRequest {
  content: string;
  status: QuestionStatus;
}

export interface CreateQuestionResponse {
  id: string;
  content: string;
  status: QuestionStatus;
}

export interface UpdateQuestionRequest {
  content?: string;
  status?: QuestionStatus;
}

export interface UpdateQuestionResponse {
  id: string;
  content: string;
  status: QuestionStatus;
}
