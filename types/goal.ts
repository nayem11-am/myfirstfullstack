export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  isCompleted: boolean;
  progress: number;
  dueDate?: string;
}

export interface Goal {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  status: 'on_track' | 'at_risk' | 'off_track' | 'completed' | 'IN_PROGRESS' | 'COMPLETED' | 'AT_RISK' | 'ON_HOLD';
  priority?: 'low' | 'medium' | 'high';
  progress: number; // 0-100
  milestones: Milestone[];
  createdAt: string;
  targetDate: string;
  assigneeId?: string;
  assignee?: {
    id: string;
    fullName: string;
    avatarUrl?: string;
  };
}

export interface GoalState {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  fetchGoals: (workspaceId: string) => Promise<void>;
  addGoal: (goalData: Partial<Goal>) => Promise<void>;
  toggleMilestone: (goalId: string, milestoneId: string) => Promise<void>;
  completeGoal: (goalId: string) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
}
