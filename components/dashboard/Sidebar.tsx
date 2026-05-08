"use client";

import React from "react";
import { 
  LayoutDashboard, 
  Target, 
  CheckSquare, 
  Megaphone,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Search,
  Plus,
  Settings
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/useAuthStore";
import { Can } from "@/components/auth/Can";
import { useModalStore } from "@/store/useModalStore";
import { useSearchStore } from "@/store/useSearchStore";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Target, label: "Goals", href: "/dashboard/goals" },
  { icon: CheckSquare, label: "Tasks", href: "/dashboard/tasks" },
  { icon: Megaphone, label: "Announcements", href: "/dashboard/announcements" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];


import { useNotificationStore } from "@/store/useNotificationStore";

export function Sidebar({ isMobile, onSelect }: { isMobile?: boolean, onSelect?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const openModal = useModalStore((state) => state.openModal);
  const { unreadCount } = useNotificationStore();
  
  const [collapsed, setCollapsed] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  const actualCollapsed = isMobile ? false : collapsed;

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside 
      className={cn(
        "hidden md:flex flex-col bg-[#08090b] text-slate-400 transition-all duration-500 h-screen sticky top-0 z-30 overflow-hidden font-sans border-r border-white/5",
        isMobile && "flex w-full h-full border-none",
        actualCollapsed ? "w-[80px]" : "w-[260px]"
      )}
    >
      {/* 1. Header: Workspace / User Info */}
      <div className="p-6 flex items-center justify-between flex-shrink-0 mb-4">
        {!actualCollapsed && mounted && (
          <Link href="/dashboard/settings" onClick={onSelect} className="flex items-center gap-3 flex-1 px-1 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center text-white text-[14px] font-black shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300 overflow-hidden ring-2 ring-white/10 group-hover:ring-white/30">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
              ) : (
                user?.fullName?.charAt(0) || "W"
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <span className="font-bold text-[14px] text-white truncate leading-tight tracking-tight">
                {user?.fullName || "Workspace"}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                  {user?.role || "Member"}
                </span>
              </div>
            </div>
          </Link>
        )}

        
        {!isMobile && (
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "h-8 w-8 rounded-xl border border-white/5 bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center",
              actualCollapsed ? "mx-auto" : "ml-2"
            )}
          >
            {actualCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>

      {/* 2. Quick Action */}
      {!actualCollapsed && (
        <div className="px-4 mb-8">
          <Can roles="admin">
            <button 
              onClick={() => {
                openModal('task');
                onSelect?.();
              }}
              className="flex items-center justify-center gap-2 w-full h-11 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-[13px] font-bold text-slate-300 hover:bg-white/[0.07] hover:text-white transition-all shadow-sm"
            >
              <Plus size={16} className="text-indigo-400" />
              <span>Create Task</span>
            </button>
          </Can>
        </div>
      )}

      {/* 3. Main Navigation */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto scrollbar-hide">
        {!actualCollapsed && <p className="px-3 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Main Menu</p>}
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onSelect}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-bold transition-all duration-300 group relative",
                isActive 
                  ? "bg-white/[0.05] text-white shadow-sm" 
                  : "hover:bg-white/[0.03] hover:text-slate-200"
              )}
            >
              <item.icon size={18} className={cn(
                "transition-all duration-300",
                isActive ? "text-indigo-400 scale-110" : "text-slate-500 group-hover:text-slate-300"
              )} />
              {!actualCollapsed && <span>{item.label}</span>}
              
              {!actualCollapsed && item.label === "Announcements" && unreadCount > 0 && (
                <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-indigo-500 px-1.5 text-[10px] font-black text-white shadow-lg shadow-indigo-500/40">
                  {unreadCount}
                </span>
              )}

              {isActive && (
                <div className="absolute left-0 w-1 h-5 rounded-r-full bg-indigo-500 shadow-[4px_0_12px_rgba(99,102,241,0.6)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* 4. Footer */}
      <div className="p-4 mt-auto border-t border-white/5 bg-black/20">
        <button 
          onClick={() => logout(router)}
          className={cn(
            "flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-[13px] font-bold text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-300 group",
            actualCollapsed && "justify-center"
          )}
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
          {!actualCollapsed && <span>Sign out</span>}
        </button>
      </div>
    </aside>
  );
}

