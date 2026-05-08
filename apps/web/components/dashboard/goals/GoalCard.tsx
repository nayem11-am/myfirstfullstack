"use client";

import { Goal } from "@/types/goal";
import { 
  Card, 
  CardContent, 
  CardHeader 
} from "@/components/ui/Card";
import { MilestoneList } from "./MilestoneList";
import { 
  Calendar, 
  Flag, 
  MoreVertical, 
  Target,
  CheckCircle2,
  Trash2,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Can } from "@/components/auth/Can";
import { useState, useRef, useEffect } from "react";
import { useGoalStore } from "@/store/useGoalStore";
import { toast } from "sonner";

interface GoalCardProps {
  goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { completeGoal, deleteGoal } = useGoalStore();

  const priorityColors: Record<string, string> = {
    low: "bg-slate-100 text-slate-500",
    medium: "bg-indigo-50 text-indigo-600",
    high: "bg-rose-50 text-rose-600",
  };

  const priorityKey = goal.priority?.toLowerCase() || 'medium';


  const isCompleted = goal.progress === 100 || 
    goal.status === 'completed' || 
    goal.status === 'COMPLETED';


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleComplete = async () => {
    await completeGoal(goal.id);
    toast.success("Goal marked as completed!");
    setShowMenu(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this goal?")) {
      await deleteGoal(goal.id);
      toast.success("Goal deleted!");
    }
    setShowMenu(false);
  };

  return (
    <Card className={cn(
      "bg-white rounded-[24px] md:rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 overflow-visible group",
      isCompleted && "bg-emerald-50/20 border-emerald-100"
    )}>
      <CardHeader className="p-5 md:p-8 pb-0 md:pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <div className={cn(
              "w-12 h-12 md:w-14 md:h-14 rounded-[18px] md:rounded-[22px] flex items-center justify-center transition-all duration-500 shadow-sm border group-hover:scale-110 shrink-0",
              isCompleted 
                ? "bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/20" 
                : "bg-indigo-50 text-indigo-600 border-indigo-100"
            )}>
              {isCompleted ? <Check size={28} strokeWidth={3} /> : <Target size={28} strokeWidth={2.5} />}
            </div>
            <div className="flex-1 min-w-0 pr-2 md:pr-4">
              <h3 className="text-base md:text-lg font-black text-slate-900 leading-tight tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-1">
                {goal.title}
              </h3>

              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg",
                  priorityColors[priorityKey] || priorityColors.medium
                )}>
                  {goal.priority || 'Medium'}
                </span>

                {isCompleted && (
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-lg">Done</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="h-10 w-10 rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-all flex items-center justify-center group-hover:bg-white border border-transparent group-hover:border-slate-100"
            >
              <MoreVertical size={20} />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-[24px] shadow-2xl border border-slate-100 z-[100] p-2 animate-in fade-in zoom-in-95 duration-200">
                {!isCompleted && (
                  <button 
                    onClick={handleComplete}
                    className="w-full text-left px-4 py-3 text-sm text-emerald-600 hover:bg-emerald-50 rounded-xl flex items-center gap-3 transition-colors font-bold"
                  >
                    <CheckCircle2 size={18} /> Mark as Complete
                  </button>
                )}
                <Can roles="admin">
                  <button 
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-3 text-sm text-rose-500 hover:bg-rose-50 rounded-xl flex items-center gap-3 transition-colors font-bold"
                  >
                    <Trash2 size={18} /> Delete Goal
                  </button>
                </Can>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-5 md:p-8">
        <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed mb-6 md:mb-8 line-clamp-2">
          {goal.description || "No description provided for this objective."}
        </p>

        {/* Progress Section */}
        <div className="space-y-3 mb-8">
          <div className="flex justify-between items-end">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Strategy Progress</span>
            <span className={cn(
              "text-lg font-black tabular-nums tracking-tighter",
              isCompleted ? "text-emerald-500" : "text-indigo-600"
            )}>{goal.progress}%</span>
          </div>
          <div className="w-full h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50 p-0.5">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-1000 ease-out relative",
                isCompleted 
                  ? "bg-gradient-to-r from-emerald-400 to-emerald-600" 
                  : "bg-gradient-to-r from-indigo-400 to-indigo-600 shadow-[0_0_12px_rgba(99,102,241,0.4)]"
              )}
              style={{ width: `${goal.progress}%` }}
            >
               {!isCompleted && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
            </div>
          </div>
        </div>

        {/* Info Grid */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100/50">
              <Calendar size={14} className="text-slate-400" />
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">
                {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : "No Date"}
              </span>
            </div>
            {/* Assignee Avatar */}
            {goal.assignee ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[9px] font-black text-white">
                  {goal.assignee.fullName?.charAt(0).toUpperCase()}
                </div>
                <span className="text-[11px] font-bold text-indigo-600 max-w-[80px] truncate">
                  {goal.assignee.fullName?.split(' ')[0]}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center">
                  <span className="text-[8px] text-slate-400">?</span>
                </div>
                <span className="text-[11px] font-bold text-slate-400">Unassigned</span>
              </div>
            )}
          </div>

        {/* Milestones Divider */}
        <div className="border-t border-slate-50 pt-8">
          <div className="flex items-center justify-between mb-4">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Key Milestones</p>
             <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg">
                {goal.milestones.filter(m => m.isCompleted).length}/{goal.milestones.length}
             </span>
          </div>
          <MilestoneList goalId={goal.id} milestones={goal.milestones} />
        </div>
      </CardContent>
    </Card>
  );
}

