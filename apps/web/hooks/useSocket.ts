"use client";

import { useEffect } from "react";
import { socketService } from "@/lib/socket";
import { useSocketStore } from "@/store/useSocketStore";
import { useGoalStore } from "@/store/useGoalStore";
import { useTaskStore } from "@/store/useTaskStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useAnnouncementStore } from "@/store/useAnnouncementStore";
import { useAnalyticsStore } from "@/store/useAnalyticsStore";
import { toast } from "sonner";

export function useSocket(workspaceId: string, userId: string, userName?: string) {

  useEffect(() => {
    if (!workspaceId || !userId) return;

    // Use stable actions from state without triggering effect re-runs
    const actions = {
      setConnected: useSocketStore.getState().setConnected,
      setOnlineUsers: useSocketStore.getState().setOnlineUsers,
      addNotification: useNotificationStore.getState().addNotification,
      fetchGoals: useGoalStore.getState().fetchGoals,
      fetchTasks: useTaskStore.getState().fetchTasks,
      fetchAnnouncements: useAnnouncementStore.getState().fetchAnnouncements,
      fetchAnalytics: useAnalyticsStore.getState().fetchAnalytics,
    };

    socketService.connect(workspaceId, userId, userName);

    socketService.on("connect", () => {
      actions.setConnected(true);
      console.log("⚡ Real-time system active:", workspaceId);
    });

    socketService.on("disconnect", () => {
      actions.setConnected(false);
    });

    // 🌐 Workspace Presence Updates
    socketService.on("workspace:presence", (users) => {
      actions.setOnlineUsers(users);
    });

    // 🔄 Real-time Content Sync (Scoped by Backend)
    socketService.on("content:updated", (data) => {
      const { type, action, title, userName: actorName } = data;
      
      // Re-fetch data based on update type
      if (type === 'goal') {
        actions.fetchGoals(workspaceId);
        actions.fetchAnalytics(workspaceId);
      }
      if (type === 'task') {
        actions.fetchTasks(workspaceId);
        actions.fetchAnalytics(workspaceId);
      }
      if (type === 'announcement') actions.fetchAnnouncements(workspaceId);

      // Notify the user
      actions.addNotification({
        type: 'info',
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} ${action}`,
        message: `${actorName} ${action} ${title}`
      });
      
      toast.info(`${type.charAt(0).toUpperCase() + type.slice(1)} Update`, {
        description: `${actorName} ${action} ${title}`
      });
    });

    return () => {
      socketService.off("connect");
      socketService.off("disconnect");
      socketService.off("workspace:presence");
      socketService.off("content:updated");
      socketService.disconnect();
    };
  }, [workspaceId, userId, userName]); // Only depend on core IDs
}

