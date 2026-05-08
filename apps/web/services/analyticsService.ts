import { AnalyticsData } from '../types/analytics';

export const analyticsService = {
  getWorkspaceAnalytics: async (workspaceId: string): Promise<AnalyticsData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Mock data generation
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const chartData = days.map(day => ({
      date: day,
      completed: Math.floor(Math.random() * 10) + 2,
      active: Math.floor(Math.random() * 15) + 5,
    }));

    return {
      totalGoals: 24,
      completedThisWeek: 18,
      overdueGoals: 3,
      completionRate: 75,
      chartData
    };
  }
};
