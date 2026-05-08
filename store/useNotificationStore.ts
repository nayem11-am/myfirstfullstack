import { create } from 'zustand';
import api from '../lib/api';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAll: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  isLoading: false,
  unreadCount: 0,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/notifications');
      const data = response.data;

      const mapped = (data || []).map((n: any) => ({
        id: n.id,
        type: n.type || 'info',
        title: n.title,
        message: n.message,
        timestamp: n.createdAt,
        read: n.read,
        link: n.link
      }));

      set({
        notifications: mapped as Notification[],
        unreadCount: mapped.filter((n: Notification) => !n.read).length,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  addNotification: async (notification) => {
    try {
      await api.post('/notifications', notification);
      get().fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  },

  markAsRead: async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      set((state) => {
        const updated = state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        );
        return { notifications: updated, unreadCount: updated.filter((n) => !n.read).length };
      });
    } catch (err) {
      console.error(err);
    }
  },

  markAllAsRead: async () => {
    try {
      await api.post('/notifications/read-all');
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch (err) {
      console.error(err);
    }
  },

  clearAll: async () => {
    try {
      await api.delete('/notifications');
      set({ notifications: [], unreadCount: 0 });
    } catch (err) {
      console.error(err);
    }
  },
}));
