export type ReportStatus = "completed" | "analyzing" | "failed";

export interface AnalysisReport {
  id: string;
  sessionId: string;
  userNickname: string;
  jobCategory: string;
  status: ReportStatus;
  score?: number;
  summary?: string;
  strengths?: string[];
  improvements?: string[];
  createdAt: string;
  completedAt?: string;
}
