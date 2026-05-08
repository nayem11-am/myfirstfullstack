"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Search, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { NotificationDropdown } from "@/components/dashboard/NotificationDropdown";
import { InvitationDropdown } from "@/components/dashboard/InvitationDropdown";
import { useSearchStore } from "@/store/useSearchStore";
import { useModalStore } from "@/store/useModalStore";

export function Topbar() {
  const pathname = usePathname();
  const { query, setQuery } = useSearchStore();
  const setMobileSidebarOpen = useModalStore((state) => state.setMobileSidebarOpen);

  // Derive page title from pathname
  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "Dashboard";
    const lastSegment = segments[segments.length - 1];
    if (lastSegment === 'dashboard') return "Overview";
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  return (
    <header className="h-20 border-b border-slate-100 bg-white/80 backdrop-blur-xl sticky top-0 z-40 px-6 md:px-10 flex items-center justify-between transition-all duration-500">
      <div className="flex items-center gap-6">
        {/* Mobile Menu Trigger */}
        <button 
          onClick={() => setMobileSidebarOpen(true)}
          className="md:hidden h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all border border-slate-100"
        >
          <Menu size={20} />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:block h-6 w-1 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
          <h1 className="text-xl font-black text-slate-900 tracking-tight hidden sm:block">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      <div className="flex-1 max-w-lg mx-12 hidden lg:block">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
          <Input 
            placeholder="Search resources, commands..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-11 bg-slate-50 border-transparent rounded-2xl text-[14px] font-bold placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
             <kbd className="h-5 px-1.5 rounded bg-white border border-slate-200 text-[10px] font-black text-slate-400 shadow-sm">⌘</kbd>
             <kbd className="h-5 px-1.5 rounded bg-white border border-slate-200 text-[10px] font-black text-slate-400 shadow-sm">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <InvitationDropdown />
        <NotificationDropdown />
      </div>

    </header>
  );
}
