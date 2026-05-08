import { create } from 'zustand';
import { Task, TaskState, TaskStatus } from '../types/task';
import api from '../lib/api';
import { socketService } from '../lib/socket';

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async (workspaceId) => {
    if (!workspaceId) return;
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/tasks/workspace/${workspaceId}`);
      const data = response.data;

      const mappedTasks: Task[] = data.map((t: any) => ({
        id: t.id,
        workspaceId: t.workspaceId,
        goalId: t.goalId,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        dueDate: t.dueDate,
        createdAt: t.createdAt,
        assigneeId: t.assigneeId,
        assignee: t.assignee ? { 
          name: t.assignee.fullName, 
          avatar: t.assignee.avatarUrl 
        } : { name: 'Unassigned' },
      }));

      set({ tasks: mappedTasks, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      const { tasks } = get();
      
      const response = await api.post(`/tasks/workspace/${taskData.workspaceId}`, taskData);
      const data = response.data;

      const newTask: Task = {
        id: data.id,
        workspaceId: data.workspaceId,
        goalId: data.goalId,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate,
        createdAt: data.createdAt,
        assignee: data.assignee ? { 
          name: data.assignee.fullName, 
          avatar: data.assignee.avatarUrl 
        } : { name: 'Unassigned' }
      };

      set({ 
        tasks: [newTask, ...tasks],
        isLoading: false 
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateTaskStatus: async (taskId, status: TaskStatus) => {
    try {
      await api.patch(`/tasks/${taskId}`, { status });
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
      }));
    } catch (err: any) {
      console.error(err);
    }
  },

  updateTask: async (taskId: string, updates: any) => {
    try {
      const response = await api.patch(`/tasks/${taskId}`, updates);
      const data = response.data;

      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, ...data } : t)),
      }));
    } catch (err: any) {
      console.error("Update Task Error:", err);
    }
  },

  deleteTask: async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      set((state) => ({ tasks: state.tasks.filter((t) => t.id !== taskId) }));
    } catch (err: any) {
      console.error(err);
    }
  },
}));
