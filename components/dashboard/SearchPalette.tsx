"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Search, 
  FileText, 
  Target, 
  CheckSquare, 
  Megaphone, 
  Command,
  PlusCircle,
  X,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";
import { useTaskStore } from "@/store/useTaskStore";
import { useGoalStore } from "@/store/useGoalStore";
import { useAnnouncementStore } from "@/store/useAnnouncementStore";
import { useModalStore } from "@/store/useModalStore";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function SearchPalette() {
  const { isOpen, setIsOpen, query, setQuery } = useSearchStore();
  const { tasks } = useTaskStore();
  const { goals } = useGoalStore();
  const { announcements } = useAnnouncementStore();
  const router = useRouter();
  const paletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, setIsOpen]);

  const commands = [
    { id: 'new-task', title: 'Create New Task', icon: PlusCircle, action: () => { useModalStore.getState().openModal('task'); setIsOpen(false); }, color: 'text-indigo-500' },
    { id: 'new-goal', title: 'Set New Goal', icon: Target, action: () => { useModalStore.getState().openModal('goal'); setIsOpen(false); }, color: 'text-emerald-500' },
    { id: 'go-settings', title: 'Open Settings', icon: Command, action: () => { router.push('/dashboard/settings'); setIsOpen(false); }, color: 'text-slate-500' },
    { id: 'logout', title: 'Sign Out', icon: X, action: () => { useAuthStore.getState().logout(); setIsOpen(false); }, color: 'text-rose-500' },
  ];

  if (!isOpen) return null;

  const isCommandMode = query.startsWith('>');
  const searchquery = isCommandMode ? query.slice(1).trim() : query;

  const filteredCommands = commands.filter(c => 
    c.title.toLowerCase().includes(searchquery.toLowerCase())
  );

  const filteredTasks = isCommandMode ? [] : tasks.filter(t => t.title.toLowerCase().includes(searchquery.toLowerCase())).slice(0, 3);
  const filteredGoals = isCommandMode ? [] : goals.filter(g => (g.title || "").toLowerCase().includes(searchquery.toLowerCase())).slice(0, 3);
  const filteredAnnouncements = isCommandMode ? [] : announcements.filter(a => (a.title || "").toLowerCase().includes(searchquery.toLowerCase())).slice(0, 3);

  const hasResults = filteredCommands.length > 0 || filteredTasks.length > 0 || filteredGoals.length > 0 || filteredAnnouncements.length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" />
      
      <div 
        ref={paletteRef}
        className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[70vh]"
      >
        {/* Search Input Area */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
          <Search className="text-indigo-500" size={24} strokeWidth={3} />
          <input 
            autoFocus
            placeholder={isCommandMode ? "Type a command..." : "Search anything or type '>' for commands..."} 
            className="flex-1 bg-transparent border-none outline-none text-xl font-bold text-slate-900 placeholder:text-slate-300"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <kbd className="h-6 px-2 rounded-lg bg-white border border-slate-200 text-[10px] font-black text-slate-400 shadow-sm flex items-center justify-center">ESC</kbd>
            <button 
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-400 transition-colors"
            >
              <X size={18} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
          {!query && (
            <div className="py-12 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-4">
                 <Command size={32} strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-black text-slate-900">Global Search</h3>
              <p className="text-slate-400 font-bold text-sm max-w-xs mt-2">
                Type something to search across your entire workspace instantly.
              </p>
            </div>
          )}

          {query && !hasResults && (
            <div className="py-12 flex flex-col items-center text-center">
               <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
                 <Search size={32} strokeWidth={2.5} />
              </div>
              <h3 className="text-lg font-black text-slate-900">No results found</h3>
              <p className="text-slate-400 font-bold text-sm mt-1">
                We couldn't find anything matching "{query}"
              </p>
            </div>
          )}

          {/* Commands Section */}
          {filteredCommands.length > 0 && (
            <div>
              <p className="px-3 mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Command size={12} />
                Actions & Commands
              </p>
              <div className="space-y-1">
                {filteredCommands.map(cmd => (
                  <button 
                    key={cmd.id}
                    onClick={cmd.action}
                    className="w-full text-left p-4 rounded-2xl hover:bg-indigo-50 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn("w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center transition-all group-hover:scale-110", cmd.color)}>
                        <cmd.icon size={18} strokeWidth={3} />
                      </div>
                      <span className="font-bold text-slate-700 group-hover:text-indigo-600">{cmd.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Run Command</span>
                       <ChevronRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Section */}
          {filteredTasks.length > 0 && (
            <div>
              <p className="px-3 mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <CheckSquare size={12} />
                Tasks
              </p>
              <div className="space-y-1">
                {filteredTasks.map(task => (
                  <button 
                    key={task.id}
                    onClick={() => {
                      router.push('/dashboard/tasks');
                      setIsOpen(false);
                    }}
                    className="w-full text-left p-4 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:border-indigo-100 transition-all">
                        <FileText size={18} />
                      </div>
                      <span className="font-bold text-slate-700 group-hover:text-slate-900">{task.title}</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Goals Section */}
          {filteredGoals.length > 0 && (
            <div>
              <p className="px-3 mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Target size={12} />
                Strategic Goals
              </p>
              <div className="space-y-1">
                {filteredGoals.map(goal => (
                  <button 
                    key={goal.id}
                    onClick={() => {
                      router.push('/dashboard/goals');
                      setIsOpen(false);
                    }}
                    className="w-full text-left p-4 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:border-indigo-100 transition-all">
                        <Target size={18} />
                      </div>
                      <span className="font-bold text-slate-700 group-hover:text-slate-900">{goal.title}</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Announcements Section */}
          {filteredAnnouncements.length > 0 && (
            <div>
              <p className="px-3 mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                <Megaphone size={12} />
                Announcements
              </p>
              <div className="space-y-1">
                {filteredAnnouncements.map(announcement => (
                  <button 
                    key={announcement.id}
                    onClick={() => {
                      router.push('/dashboard/announcements');
                      setIsOpen(false);
                    }}
                    className="w-full text-left p-4 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:border-indigo-100 transition-all">
                        <Megaphone size={18} />
                      </div>
                      <span className="font-bold text-slate-700 group-hover:text-slate-900 line-clamp-1">{announcement.title}</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                 <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 shadow-sm">↵</kbd>
                 to select
              </div>
              <div className="flex items-center gap-1.5">
                 <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 shadow-sm">↑↓</kbd>
                 to navigate
              </div>
           </div>
           <div className="flex items-center gap-1.5 text-[10px] font-black text-indigo-500 uppercase tracking-widest">
              <Command size={12} strokeWidth={3} />
              Workspace Search
           </div>
        </div>
      </div>
    </div>
  );
}
