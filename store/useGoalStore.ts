import { create } from 'zustand';
import { Goal, GoalState } from '../types/goal';
import api from '../lib/api';
import { useAuthStore } from './useAuthStore';
import { socketService } from '../lib/socket';

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: [],
  isLoading: false,
  error: null,

  fetchGoals: async (workspaceId) => {
    if (!workspaceId) return;
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/goals/workspace/${workspaceId}`);
      const data = response.data;

      const mappedGoals: Goal[] = data.map((g: any) => ({
        id: g.id,
        workspaceId: g.workspaceId,
        title: g.title,
        description: g.description,
        status: g.status,
        progress: g.progress || 0,
        createdAt: g.createdAt,
        targetDate: g.dueDate,
        assigneeId: g.assigneeId || undefined,
        assignee: g.assignee ? {
          id: g.assignee.id,
          fullName: g.assignee.fullName,
          avatarUrl: g.assignee.avatarUrl,
        } : undefined,
        milestones: (g.milestones || []).map((m: any) => ({
          id: m.id,
          goalId: m.goalId,
          title: m.title,
          isCompleted: m.progress === 100,
          progress: m.progress,
        }))
      }));

      set({ goals: mappedGoals, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addGoal: async (goalData) => {
    set({ isLoading: true });
    try {
      const workspaceId = goalData.workspaceId || useAuthStore.getState().user?.workspaceId;
      if (!workspaceId) throw new Error('Workspace ID is required');

      await api.post(`/goals/workspace/${workspaceId}`, { ...goalData, workspaceId });
      await get().fetchGoals(workspaceId);
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  toggleMilestone: async (goalId, milestoneId) => {
    const goal = get().goals.find(g => g.id === goalId);
    if (!goal) return;

    const milestone = goal.milestones.find(m => m.id === milestoneId);
    if (!milestone) return;

    try {
      const newProgress = milestone.isCompleted ? 0 : 100;
      await api.patch(`/goals/milestone/${milestoneId}`, { progress: newProgress });
      
      // Refresh goals to get updated goal progress
      await get().fetchGoals(goal.workspaceId);
    } catch (err: any) {
      console.error(err);
    }
  },

  completeGoal: async (goalId) => {
    // This could be handled by updating status to COMPLETED
  },

  deleteGoal: async (goalId) => {
    const goal = get().goals.find(g => g.id === goalId);
    if (!goal) return;

    try {
      await api.delete(`/goals/${goalId}`);
      set((state) => ({
        goals: state.goals.filter((g) => g.id !== goalId),
      }));
    } catch (err: any) {
      console.error(err);
    }
  },
}));
