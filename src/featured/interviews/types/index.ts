export type SessionStatus = "completed" | "in_progress" | "abandoned";

export interface InterviewSession {
  id: string;
  userId: string;
  userNickname: string;
  interviewTitle: string;
  status: SessionStatus;
  questionCount: number;
  answeredCount: number;
  score?: number;
  durationSec: number;
  startedAt: string;
  endedAt?: string;
}

export interface SessionFiltersState {
  search: string;
  status: SessionStatus | "all";
  jobCategory: string;
  sortBy: "startedAt" | "score" | "durationSec";
  sortOrder: "asc" | "desc";
}
