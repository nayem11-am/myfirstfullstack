export interface AnalyticsData {
  totalGoals: number;
  completedThisWeek: number;
  overdueGoals: number;
  completionRate: number;
  chartData: ChartPoint[];
}

export interface ChartPoint {
  date: string;
  completed: number;
  active: number;
}

export interface AnalyticsState {
  data: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  fetchAnalytics: (workspaceId: string) => Promise<void>;
  exportData: () => void;
}
