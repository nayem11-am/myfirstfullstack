"use client";

import * as React from "react";
import { useSocket } from "@/hooks/useSocket";

export default function DashboardClient({ user, children }: { user: any; children: React.ReactNode }) {
  // Call useSocket unconditionally (React Rule)
  useSocket(user?.workspaceId, user?.id, user?.fullName);

  return <>{children}</>;
}

