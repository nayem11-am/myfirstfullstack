import { create } from 'zustand';
import { AnalyticsState } from '../types/analytics';
import api from '../lib/api';

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  data: null,
  isLoading: false,
  error: null,

  fetchAnalytics: async (workspaceId?: string) => {
    if (!workspaceId) {
      return;
    }
    
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/analytics/workspace/${workspaceId}`);
      set({ data: response.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  exportData: () => {
    const { data } = get();
    if (!data) return;

    const headers = ['Date', 'Completed', 'Active'];
    const rows = data.chartData.map((point) => [point.date, point.completed, point.active]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `analytics-export-${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
}));
