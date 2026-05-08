export type ReactionType = 'like' | 'love' | 'fire';

export interface AnnouncementComment {
  id: string;
  author: {
    name: string;
    role: string;
  };
  content: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  workspaceId: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  content: string;
  isPinned: boolean;
  createdAt: string;
  reactions: {
    like: number;
    love: number;
    fire: number;
  };
  userReactions: ReactionType[]; 
  comments?: AnnouncementComment[];
}

export interface AnnouncementState {
  announcements: Announcement[];
  isLoading: boolean;
  error: string | null;
  fetchAnnouncements: (workspaceId: string) => Promise<void>;
  addAnnouncement: (content: string, isPinned?: boolean) => Promise<void>;
  toggleReaction: (id: string, reaction: ReactionType) => Promise<void>;
  pinAnnouncement: (id: string) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  addComment: (announcementId: string, content: string) => Promise<void>;
}
