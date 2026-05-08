"use client";

import { useEffect, useState } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { useAuthStore } from "@/store/useAuthStore";
import { KanbanBoard } from "@/components/dashboard/tasks/KanbanBoard";
import { TaskForm } from "@/components/dashboard/tasks/TaskForm";
import { Button } from "@/components/ui/Button";
import { 
  Plus, 
  Layout, 
  Search, 
  Filter, 
  Settings2,
  Users
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { TasksSkeleton } from "@/components/dashboard/tasks/TasksSkeleton";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/Dialog";
import { Can } from "@/components/auth/Can";

import { useModalStore } from "@/store/useModalStore";
import { useSearchStore } from "@/store/useSearchStore";

export default function TasksPage() {
  const { user } = useAuthStore();
  const { fetchTasks, isLoading } = useTaskStore();
  const openModal = useModalStore((state) => state.openModal);
  const { query, setQuery } = useSearchStore();

  useEffect(() => {
    if (user?.workspaceId) {
      fetchTasks(user.workspaceId);
    }
  }, [fetchTasks, user?.workspaceId]);

  if (isLoading) {
    return <TasksSkeleton />;
  }

  return (
    <div className="space-y-12 pb-24 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-10 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
               <Layout size={24} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-500">Workspace</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">
            Task Board
          </h1>
          <p className="text-slate-400 font-bold text-lg max-w-xl">
            Streamline your team's execution with our interactive kanban.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Can roles="admin">
            <button 
              onClick={() => openModal('team')}
              className="h-14 px-6 rounded-[20px] bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all font-black text-sm flex items-center gap-2"
            >
              <Users size={20} strokeWidth={2.5} />
              Team
            </button>
            
            <Button 
              onClick={() => openModal('task')}
              className="bg-slate-900 hover:bg-black text-white rounded-[20px] px-8 h-14 shadow-2xl shadow-slate-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] font-black text-sm"
            >
              <Plus size={20} className="mr-2" strokeWidth={3} />
              New Task
            </Button>
          </Can>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 shrink-0">
        <div className="relative w-full sm:w-[400px] group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
          <Input 
            placeholder="Search tasks..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-14 h-14 bg-white border-slate-100 rounded-[24px] text-[15px] font-bold shadow-sm focus:ring-4 focus:ring-indigo-500/5 transition-all" 
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="h-12 px-5 rounded-[18px] bg-white border border-slate-100 text-slate-500 hover:text-indigo-600 hover:border-indigo-100 transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <Filter size={16} strokeWidth={2.5} />
            Filter
          </button>
          <button className="h-12 w-12 rounded-[18px] bg-white border border-slate-100 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center">
            <Settings2 size={20} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Kanban Board Area */}
      <div className="flex-1 min-h-0">
        <KanbanBoard />
      </div>
    </div>
  );
}

