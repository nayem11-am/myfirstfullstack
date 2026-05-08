"use client";

import React, { useEffect, useState } from "react";
import { useSearchStore } from "@/store/useSearchStore";
import { useTaskStore } from "@/store/useTaskStore";
import { useGoalStore } from "@/store/useGoalStore";
import { 
  Dialog, 
  DialogContent, 
} from "@/components/ui/Dialog";
import { Search, FileText, Target, Command, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function SearchModal() {
  const { isOpen, setIsOpen, query, setQuery } = useSearchStore();
  const { tasks } = useTaskStore();
  const { goals } = useGoalStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, setIsOpen]);

  if (!mounted) return null;

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const filteredGoals = goals.filter(g => 
    g.title.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  const handleSelect = (href: string) => {
    router.push(href);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-white/90 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
          <Search size={22} className="text-indigo-500" />
          <input 
            autoFocus
            placeholder="Search tasks, goals, or commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-slate-800 placeholder:text-slate-400"
          />
          <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">
            <Command size={12} className="text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">Esc</span>
          </div>
        </div>

        <div className="max-h-[450px] overflow-y-auto p-3 scrollbar-hide">
          {query.length > 0 ? (
            <div className="space-y-6 p-2">
              {filteredTasks.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 flex items-center gap-2">
                    <FileText size={12} />
                    Tasks
                  </h3>
                  <div className="space-y-1">
                    {filteredTasks.map(task => (
                      <button
                        key={task.id}
                        onClick={() => handleSelect('/dashboard/tasks')}
                        className="w-full text-left px-3 py-3 rounded-2xl hover:bg-indigo-50 group transition-all flex items-center justify-between"
                      >
                        <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600">{task.title}</span>
                        <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-lg text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-500 transition-colors">Task</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredGoals.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 flex items-center gap-2">
                    <Target size={12} />
                    Goals
                  </h3>
                  <div className="space-y-1">
                    {filteredGoals.map(goal => (
                      <button
                        key={goal.id}
                        onClick={() => handleSelect('/dashboard/goals')}
                        className="w-full text-left px-3 py-3 rounded-2xl hover:bg-emerald-50 group transition-all flex items-center justify-between"
                      >
                        <span className="text-sm font-semibold text-slate-700 group-hover:text-emerald-600">{goal.title}</span>
                        <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-lg text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-500 transition-colors">Goal</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {filteredTasks.length === 0 && filteredGoals.length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                  <Search size={48} className="mb-4 opacity-10" />
                  <p className="text-sm font-medium">No results found for "{query}"</p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-500">
                <Command size={32} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Quick Search</h3>
                <p className="text-sm text-slate-500 mt-1">Start typing to find tasks, goals, or use shortcuts.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-4">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Shortcut</p>
                  <p className="text-xs font-bold text-slate-700">⌘ + K to open</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Action</p>
                  <p className="text-xs font-bold text-slate-700">Esc to close</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
