import { create } from 'zustand';
import api from '../lib/api';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  status?: string;
}

interface Invitation {
  id: string;
  workspaceId: string;
  email: string;
  role: string;
  status: string;
  workspace: { name: string };
  invitedBy: { fullName: string };
}

interface TeamState {
  members: TeamMember[];
  myInvitations: Invitation[];
  isLoading: boolean;
  error: string | null;
  fetchMembers: (workspaceId: string) => Promise<void>;
  removeMember: (workspaceId: string, userId: string) => Promise<void>;
  searchUsers: (workspaceId: string, query: string) => Promise<any[]>;
  sendInvite: (workspaceId: string, email: string, role: string) => Promise<void>;
  fetchMyInvitations: () => Promise<void>;
  respondToInvitation: (invitationId: string, status: 'ACCEPTED' | 'DECLINED') => Promise<void>;
}

export const useTeamStore = create<TeamState>((set) => ({
  members: [],
  myInvitations: [],
  isLoading: false,
  error: null,

  fetchMembers: async (workspaceId) => {
    if (!workspaceId) return;
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/workspaces/${workspaceId}/members`);
      set({ members: response.data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  removeMember: async (workspaceId, userId) => {
    try {
      await api.delete(`/workspaces/${workspaceId}/members/${userId}`);
      set((state) => ({
        members: state.members.filter((m) => m.id !== userId)
      }));
    } catch (err: any) {
      console.error("Failed to remove member:", err);
      throw err;
    }
  },

  searchUsers: async (workspaceId, query) => {
    try {
      const response = await api.get(`/workspaces/${workspaceId}/users-to-invite?query=${query}`);
      return response.data;
    } catch (err) {
      console.error("Search error:", err);
      return [];
    }
  },

  sendInvite: async (workspaceId, email, role) => {
    try {
      await api.post(`/workspaces/${workspaceId}/invite`, { email, role });
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Failed to send invite");
    }
  },

  fetchMyInvitations: async () => {
    try {
      const response = await api.get('/workspaces/invitations/my');
      set({ myInvitations: response.data });
    } catch (err) {
      console.error("Fetch invites error:", err);
    }
  },

  respondToInvitation: async (invitationId, status) => {
    try {
      await api.post(`/workspaces/invitations/${invitationId}/respond`, { status });
      set((state) => ({
        myInvitations: state.myInvitations.filter(i => i.id !== invitationId)
      }));
    } catch (err: any) {
      throw new Error(err.response?.data?.error || "Response failed");
    }
  }
}));
