"use client";

import { useState } from "react";

import { 
  CheckCircle2, 
  PlusCircle, 
  Megaphone, 
  Target, 
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTaskStore } from "@/store/useTaskStore";
import { useGoalStore } from "@/store/useGoalStore";
import { useAnnouncementStore } from "@/store/useAnnouncementStore";
import { formatDistanceToNow } from "date-fns";
import { Task } from "@/types/task";
import { Announcement } from "@/types/announcement";
import { Goal } from "@/types/goal";

export function ActivityFeed() {
  const { tasks } = useTaskStore();
  const { goals } = useGoalStore();
  const { announcements } = useAnnouncementStore();

  const [clearedDate, setClearedDate] = useState<Date | null>(null);

  // Combine and format real activities
  const activities = [
    ...(tasks as Task[]).slice(0, 5).map(task => ({
      id: `task-${task.id}`,
      type: task.status === 'done' ? 'task_completed' : 'task_created',
      user: task.assignee?.name || 'A team member',
      title: `${task.status === 'done' ? 'completed' : 'created'} "${task.title}"`,
      time: task.createdAt,
      color: task.status === 'done' ? 'text-emerald-500 bg-emerald-50' : 'text-slate-500 bg-slate-50',
      icon: task.status === 'done' ? CheckCircle2 : PlusCircle
    })),
    ...(goals as Goal[]).slice(0, 3).map(goal => ({
      id: `goal-${goal.id}`,
      type: 'goal_reached',
      user: 'Team',
      title: `set new target: "${goal.title}"`,
      time: goal.createdAt,
      color: 'text-amber-500 bg-amber-50',
      icon: Target
    })),
    ...(announcements as Announcement[]).slice(0, 3).map(ann => ({
      id: `ann-${ann.id}`,
      type: 'announcement',
      user: ann.author?.name || 'Admin',
      title: `posted: "${ann.title}"`,
      time: ann.createdAt,
      color: 'text-indigo-500 bg-indigo-50',
      icon: Megaphone
    }))
  ]
  .filter(activity => !clearedDate || new Date(activity.time) > clearedDate)
  .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
  .slice(0, 6);

  return (
    <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900">Live Feed</h3>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Real-time workspace pulses</p>
        </div>
        <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
           <Clock size={20} strokeWidth={2.5} />
        </div>
      </div>

      <div className="space-y-8 relative flex-1">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-slate-100" />

        {activities.map((activity) => (
          <div key={activity.id} className="relative flex items-start gap-5 group animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className={cn(
              "relative z-10 w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm border border-white transition-transform group-hover:scale-110 duration-500",
              activity.color
            )}>
              <activity.icon size={18} strokeWidth={2.5} />
            </div>
            
            <div className="flex-1 pt-0.5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-bold text-slate-800 leading-snug">
                  <span className="text-indigo-600 font-black">{activity.user}</span> 
                  <span className="text-slate-500 font-medium ml-1">{activity.title}</span>
                </p>
              </div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1.5">
                {formatDistanceToNow(new Date(activity.time), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-300 font-bold text-sm italic">No recent activity detected</p>
          </div>
        )}
      </div>

      <button 
        onClick={() => setClearedDate(new Date())}
        className="mt-10 w-full h-14 rounded-2xl border border-slate-100 bg-slate-50/50 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all font-black text-[10px] uppercase tracking-[0.2em]"
      >
        Clear Activity Feed
      </button>
    </div>
  );
}
