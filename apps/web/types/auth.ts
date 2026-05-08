export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  mobile?: string;
  workspaceId?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: (router?: any) => Promise<void>;
  setUser: (user: User | null) => void;
  fetchProfile: () => Promise<void>;
  clearError: () => void;
}
