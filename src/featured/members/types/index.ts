export type MemberStatus = "active" | "warning" | "suspended";

export interface Member {
  id: string;
  nickname: string;
  email: string;
  passwordHash: string;
  status: MemberStatus;
  joinedAt: string;
  lastActiveAt: string;
  sessionCount: number;
  sanctionHistory: Sanction[];
}

export interface Sanction {
  id: string;
  type: "warning" | "suspended";
  reason: string;
  adminNote: string;
  createdAt: string;
  expiresAt?: string;
}

export interface MemberFiltersState {
  search: string;
  status: MemberStatus | "all";
  sortBy: "joinedAt" | "lastActiveAt" | "sessionCount";
  sortOrder: "asc" | "desc";
}
