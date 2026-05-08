"use client";

import { Check, Clock } from "lucide-react";
import { Milestone } from "@/types/goal";
import { useGoalStore } from "@/store/useGoalStore";
import { cn } from "@/lib/utils";
import confetti from 'canvas-confetti';
import { toast } from 'sonner';


interface MilestoneListProps {
  goalId: string;
  milestones: Milestone[];
}

export function MilestoneList({ goalId, milestones }: MilestoneListProps) {
  const toggleMilestone = useGoalStore((state) => state.toggleMilestone);

  if (milestones.length === 0) {
    return (
      <div className="flex flex-col items-center py-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-100">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No milestones</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {milestones.map((milestone) => (
        <div 
          key={milestone.id}
          className={cn(
            "flex items-center justify-between group p-3 rounded-2xl transition-all duration-300 cursor-pointer border border-transparent",
            milestone.isCompleted ? "bg-emerald-50/30" : "hover:bg-slate-50 hover:border-slate-100"
          )}
          onClick={() => {
            const isBecomingCompleted = !milestone.isCompleted;
            toggleMilestone(goalId, milestone.id);
            
            if (isBecomingCompleted) {
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.7 },
                colors: ['#10b981', '#34d399', '#6ee7b7']
              });
              toast.success(`Milestone "${milestone.title}" completed!`);
            }
          }}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-500",
              milestone.isCompleted 
                ? "bg-emerald-500 text-white" 
                : "bg-slate-100 text-slate-300 group-hover:bg-white group-hover:shadow-sm"
            )}>
              {milestone.isCompleted ? (
                <Check size={14} strokeWidth={4} />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-current" />
              )}
            </div>
            <span className={cn(
              "text-[13px] font-bold transition-all duration-300",
              milestone.isCompleted ? "text-slate-400 line-through" : "text-slate-700"
            )}>
              {milestone.title}
            </span>
          </div>
          
          {milestone.dueDate && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/50 rounded-lg text-[10px] font-black text-slate-300 uppercase tracking-tight opacity-0 group-hover:opacity-100 transition-opacity">
              <Clock size={10} />
              <span>{new Date(milestone.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

