"use client";

import { useEffect, useState } from "react";
import { useGoalStore } from "@/store/useGoalStore";
import { useAuthStore } from "@/store/useAuthStore";
import { GoalCard } from "@/components/dashboard/goals/GoalCard";
import { GoalForm } from "@/components/dashboard/goals/GoalForm";
import { Button } from "@/components/ui/Button";
import { 
  Plus, 
  Target, 
  Search, 
  Filter, 
  LayoutGrid, 
  List,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/Dialog";
import { useSearchStore } from "@/store/useSearchStore";
import { Can } from "@/components/auth/Can";

export default function GoalsPage() {
  const { user } = useAuthStore();
  const { goals, isLoading, fetchGoals } = useGoalStore();
  const { query, setQuery } = useSearchStore();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (user?.workspaceId) {
      fetchGoals(user.workspaceId);
    }
  }, [fetchGoals, user?.workspaceId]);

  // Filter goals based on global search query
  const filteredGoals = goals.filter(goal => 
    goal.title.toLowerCase().includes(query.toLowerCase()) ||
    goal.description?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 border-b border-slate-100 pb-8 md:pb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
               <Target size={24} strokeWidth={2.5} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-500">Objectives</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-[1.1] md:leading-none mb-2 md:mb-3">
            Goals & Strategic Milestones
          </h1>
          <p className="text-slate-400 font-bold text-base md:text-lg max-w-xl">
            Define, track, and execute your long-term vision with precision.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Can roles="admin">
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-slate-900 hover:bg-black text-white rounded-[16px] md:rounded-[20px] px-6 md:px-8 h-12 md:h-14 shadow-xl md:shadow-2xl shadow-slate-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] font-black text-xs md:text-sm w-full md:w-auto"
            >
              <Plus size={18} className="mr-2 md:w-5 md:h-5" strokeWidth={3} />
              Set New Goal
            </Button>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="sm:max-w-[550px] rounded-[40px] p-0 overflow-hidden border-none shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
                  <h2 className="text-3xl font-black tracking-tight relative z-10">Set a New Goal</h2>
                  <p className="text-slate-400 font-bold mt-2 relative z-10">Define your next major objective.</p>
                </div>
                <div className="p-10 bg-white">
                  <GoalForm onSuccess={() => setIsDialogOpen(false)} />
                </div>
              </DialogContent>
            </Dialog>
          </Can>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6">
        <div className="relative w-full sm:w-[400px] group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
          <Input 
            placeholder="Search objectives..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-14 h-14 bg-white border-slate-100 rounded-[24px] text-[15px] font-bold shadow-sm focus:ring-4 focus:ring-indigo-500/5 transition-all" 
          />
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="bg-slate-50 p-1.5 rounded-[20px] flex gap-1.5 border border-slate-100">
            <button 
              className={cn(
                "h-10 px-4 rounded-[16px] transition-all duration-300 flex items-center gap-2 text-[12px] font-black uppercase tracking-wider", 
                view === 'grid' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
              onClick={() => setView('grid')}
            >
              <LayoutGrid size={16} strokeWidth={2.5} />
              Grid
            </button>
            <button 
              className={cn(
                "h-10 px-4 rounded-[16px] transition-all duration-300 flex items-center gap-2 text-[12px] font-black uppercase tracking-wider", 
                view === 'list' ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
              onClick={() => setView('list')}
            >
              <List size={16} strokeWidth={2.5} />
              List
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {isLoading && goals.length === 0 ? (
        <div className="h-[400px] flex flex-col items-center justify-center gap-6">
          <div className="w-16 h-16 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading Strategy...</p>
        </div>
      ) : (
        <div className={cn(
          "grid gap-6 md:gap-10",
          view === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {filteredGoals.map((goal, index) => (
            <div key={goal.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <GoalCard goal={goal} />
            </div>
          ))}
          
          {filteredGoals.length === 0 && (
            <div className="col-span-full h-[450px] flex flex-col items-center justify-center border-2 border-dashed rounded-[60px] bg-slate-50/30 border-slate-100">
              <div className="w-24 h-24 rounded-[32px] bg-white shadow-xl flex items-center justify-center mb-8 group hover:scale-110 transition-transform duration-500">
                <Target size={48} className="text-slate-200 group-hover:text-indigo-100 transition-colors" strokeWidth={1} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">Start with a Vision</h3>
              <p className="text-slate-400 font-bold text-lg max-w-sm text-center mt-3 leading-relaxed">
                You haven't set any strategic goals yet. Create your first objective to start tracking progress.
              </p>
              <Can roles="admin">
                <Button 
                  className="mt-10 rounded-[20px] bg-indigo-600 hover:bg-indigo-700 text-white px-10 h-16 shadow-2xl shadow-indigo-600/30 font-black text-lg transition-all hover:scale-105 active:scale-95"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus size={24} className="mr-3" strokeWidth={3} />
                  Launch First Goal
                </Button>
              </Can>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


