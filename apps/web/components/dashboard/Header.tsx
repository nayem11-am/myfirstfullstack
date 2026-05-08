"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function Header() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="h-16 border-b bg-white/50 backdrop-blur-md dark:bg-slate-900/50 sticky top-0 z-10 px-8 flex items-center justify-between">
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Search something..." 
          className="pl-10 bg-slate-100/50 border-none focus-visible:ring-1 focus-visible:ring-indigo-500"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} className="text-slate-600" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
        </Button>
        
        <div className="flex items-center gap-3 pl-4 border-l">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{user?.fullName}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
            {user?.fullName?.charAt(0) || <User size={18} />}
          </div>
        </div>
      </div>
    </header>
  );
}
