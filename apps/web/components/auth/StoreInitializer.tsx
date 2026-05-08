"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useTaskStore } from "@/store/useTaskStore";
import { useGoalStore } from "@/store/useGoalStore";
import { useAnnouncementStore } from "@/store/useAnnouncementStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { socketService } from "@/lib/socket";
import { User } from "@/types/auth";

export function StoreInitializer({ user: initialUser }: { user: User | null }) {
  const storeUser = useAuthStore((state) => state.user);
  const workspaceId = storeUser?.workspaceId || "";

  // 1. Hydrate auth store from server session
  useEffect(() => {
    const currentState = useAuthStore.getState();
    if (initialUser) {
      // Always sync critical session data (like role and workspaceId) from the secure server session
      useAuthStore.setState((state) => ({ 
        user: state.user?.id === initialUser.id ? { ...state.user, ...initialUser } : initialUser, 
        isAuthenticated: true 
      }));
    }
  }, [initialUser]);

  const initializedRef = useRef<string | null>(null);

  // 2. Fetch all initial data
  useEffect(() => {
    if (!workspaceId || initializedRef.current === workspaceId) return;

    console.log("🚀 StoreInitializer: Initializing stores with ID:", workspaceId);
    useTaskStore.getState().fetchTasks(workspaceId);
    useGoalStore.getState().fetchGoals(workspaceId);
    useAnnouncementStore.getState().fetchAnnouncements(workspaceId);
    useNotificationStore.getState().fetchNotifications();
    
    initializedRef.current = workspaceId;
  }, [workspaceId]);

  return null;
}

