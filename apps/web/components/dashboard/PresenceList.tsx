"use client";

import { useSocketStore } from "@/store/useSocketStore";
import { User, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export function PresenceList() {
  const { onlineUsers, isConnected } = useSocketStore();

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-1.5 pr-3 border-r border-slate-100">
        <Circle 
          size={8} 
          className={cn(
            "fill-current",
            isConnected ? "text-emerald-500" : "text-slate-300"
          )} 
        />
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {isConnected ? "Live" : "Offline"}
        </span>
      </div>

      <div className="flex -space-x-2 overflow-hidden">
        {onlineUsers.length > 0 ? (
          onlineUsers.map((user) => (
            <div 
              key={user.id}
              className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center border border-slate-200"
              title={user.name}
            >
              <User size={14} className="text-slate-400" />
            </div>
          ))
        ) : (
          <span className="text-[11px] text-slate-400 pl-2 italic">Waiting for others...</span>
        )}
      </div>
      
      {onlineUsers.length > 0 && (
        <span className="text-[11px] font-medium text-slate-500 pl-1">
          {onlineUsers.length} online
        </span>
      )}
    </div>
  );
}
