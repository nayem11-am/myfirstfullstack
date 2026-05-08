import * as React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { SearchPalette } from "@/components/dashboard/SearchPalette";
import { StoreInitializer } from "@/components/auth/StoreInitializer";
import { GlobalModals } from "@/components/dashboard/GlobalModals";
import { SearchModal } from "@/components/dashboard/SearchModal";
import DashboardClient from "./DashboardClient";

import { headers } from 'next/headers';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const currentPath = headerList.get('x-url') || '';
  
  if (currentPath.startsWith('/login') || currentPath.startsWith('/register')) {
    return <>{children}</>;
  }

  const user = await getServerSession();


  
  // 🛡️ Prevent Infinite Redirect Loop: 
  // Only redirect if we have NO user AND no refresh token.
  // If we have a refresh token, the middleware or client-side stores 
  // will attempt to restore the session.
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const hasRefreshToken = cookieStore.get('refreshToken')?.value;

  if (!user && !hasRefreshToken) {
    redirect("/login");
  }


  return (
    <DashboardClient user={user}>
      <SearchPalette />
      <div className="flex h-screen bg-slate-50/50 overflow-hidden font-sans">
        <StoreInitializer user={user} />
        <GlobalModals />
        <SearchModal />
        
        {/* 1. Fixed Sidebar */}
        <Sidebar />
        
        {/* 2. Main Layout Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* 3. Sticky Topbar */}
          <Topbar />
          
          {/* 4. Scrollable Content Area */}
          <main className="flex-1 overflow-y-auto scroll-smooth">
            <div className="p-4 md:p-12 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              {children}
            </div>
          </main>
        </div>
      </div>
    </DashboardClient>
  );
}
