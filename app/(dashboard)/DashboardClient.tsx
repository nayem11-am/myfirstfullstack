"use client";

import * as React from "react";
import { useSocket } from "@/hooks/useSocket";
import { useModalStore } from "@/store/useModalStore";
import { MobileSidebar } from "@/components/dashboard/MobileSidebar";

export default function DashboardClient({ user, children }: { user: any; children: React.ReactNode }) {
  const { isMobileSidebarOpen, setMobileSidebarOpen } = useModalStore();
  
  // Call useSocket unconditionally (React Rule)
  useSocket(user?.workspaceId, user?.id, user?.fullName);

  return (
    <>
      {children}
      <MobileSidebar isOpen={isMobileSidebarOpen} setIsOpen={setMobileSidebarOpen} />
    </>
  );
}

