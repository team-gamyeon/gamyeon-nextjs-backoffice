export interface DauDataPoint {
  date: string;
  dau: number;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
}

export interface CompletionStats {
  completed: number;
  inProgress: number;
  abandoned: number;
  total: number;
  completionRate: number;
}

export interface RecentActivity {
  id: string;
  type: "join" | "session_complete" | "sanction" | "report";
  message: string;
  time: string;
}

export interface DashboardSummary {
  dauData: DauDataPoint[];
  metrics: MetricCardData[];
  completionStats: CompletionStats;
  recentActivities: RecentActivity[];
}
