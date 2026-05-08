import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface OnlineUser {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'busy';
}

interface SocketStore {
  onlineUsers: OnlineUser[];
  notifications: Notification[];
  isConnected: boolean;
  setConnected: (status: boolean) => void;
  setOnlineUsers: (users: OnlineUser[]) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
}

export const useSocketStore = create<SocketStore>((set) => ({
  onlineUsers: [],
  notifications: [],
  isConnected: false,
  
  setConnected: (status) => set({ isConnected: status }),
  
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  
  addNotification: (notification) => set((state) => ({
    notifications: [
      {
        ...notification,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        read: false,
      },
      ...state.notifications
    ]
  })),

  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),

  clearNotifications: () => set({ notifications: [] }),
}));
