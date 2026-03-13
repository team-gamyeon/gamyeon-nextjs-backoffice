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

// API 응답 타입
export type ApiUserStatus = "ACTIVE" | "WARNING" | "SUSPENDED";

export interface ApiUser {
  id: number;
  nickname: string;
  email: string;
  provider: string;
  status: ApiUserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  totalCount: number;
  filteredCount: number;
  page: number;
  limit: number;
  items: ApiUser[];
}
