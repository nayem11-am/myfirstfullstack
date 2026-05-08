import { create } from 'zustand';
import { Announcement, AnnouncementState, ReactionType } from '../types/announcement';
import api from '../lib/api';
import { useAuthStore } from './useAuthStore';

export const useAnnouncementStore = create<AnnouncementState>((set, get) => ({
  announcements: [],
  isLoading: false,
  error: null,

  fetchAnnouncements: async (workspaceId) => {
    if (!workspaceId) return;
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/announcements/workspace/${workspaceId}`);
      const data = response.data;
      const user = useAuthStore.getState().user;

      const mapped = data.map((a: any) => {
        // Calculate reaction counts
        const reactionsCount = { like: 0, love: 0, fire: 0 };
        const userReactions: ReactionType[] = [];

        a.reactions?.forEach((r: any) => {
          const emoji = r.emoji as ReactionType;
          if (reactionsCount[emoji] !== undefined) {
            reactionsCount[emoji]++;
          }
          if (r.userId === user?.id) {
            userReactions.push(emoji);
          }
        });

        return {
          id: a.id,
          workspaceId: a.workspaceId,
          author: { 
            name: a.author?.fullName || 'System Administrator', 
            role: 'admin' 
          },
          content: a.content,
          isPinned: a.isPinned,
          createdAt: a.createdAt,
          reactions: reactionsCount,
          userReactions: userReactions,
          comments: (a.comments || []).map((c: any) => ({
            id: c.id,
            author: { name: c.author?.fullName || 'User', role: 'member' },
            content: c.content,
            createdAt: c.createdAt
          }))
        };
      });

      set({ announcements: mapped as Announcement[], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  addAnnouncement: async (content, isPinned = false) => {
    set({ isLoading: true });
    try {
      const user = useAuthStore.getState().user;
      if (!user?.workspaceId) return;

      await api.post(`/announcements/workspace/${user.workspaceId}`, { content, isPinned });
      await get().fetchAnnouncements(user.workspaceId);
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  toggleReaction: async (id, reaction: ReactionType) => {
    const user = useAuthStore.getState().user;
    if (!user?.workspaceId) return;

    try {
      await api.post(`/announcements/${id}/reaction`, { emoji: reaction });
      await get().fetchAnnouncements(user.workspaceId);
    } catch (err: any) {
      console.error(err);
    }
  },

  pinAnnouncement: async (id) => {
    const user = useAuthStore.getState().user;
    if (!user?.workspaceId) return;

    try {
      await api.patch(`/announcements/${id}`, { isPinned: true });
      await get().fetchAnnouncements(user.workspaceId);
    } catch (err) {
      console.error(err);
    }
  },

  deleteAnnouncement: async (id) => {
    try {
      await api.delete(`/announcements/${id}`);
      set((state) => ({ 
        announcements: state.announcements.filter(a => a.id !== id) 
      }));
    } catch (err) {
      console.error(err);
    }
  },

  addComment: async (announcementId, content) => {
    const user = useAuthStore.getState().user;
    if (!user?.workspaceId) return;

    try {
      await api.post(`/announcements/${announcementId}/comment`, { content });
      await get().fetchAnnouncements(user.workspaceId);
    } catch (err: any) {
      console.error(err);
    }
  },
}));
