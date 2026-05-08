"use client";

import { Task } from "@/types/task";
import { 
  Calendar, 
  Flag, 
  MoreVertical, 
  User,
  Clock,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useTaskStore } from "@/store/useTaskStore";
import { useModalStore } from "@/store/useModalStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Can } from "@/components/auth/Can";

interface TaskCardProps {
  task: Task;
}

import { useDraggable } from '@dnd-kit/core';

export function TaskCard({ task }: TaskCardProps) {
  const updateTaskStatus = useTaskStore((state) => state.updateTaskStatus);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const userRole = useAuthStore((state) => state.user?.role);
  // Admin can always drag to manage, members can also drag their assigned tasks
  const isDraggable = true; 


  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: !isDraggable,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const priorityColors: Record<string, string> = {
    low: "text-slate-400 bg-slate-50 border-slate-100",
    medium: "text-indigo-600 bg-indigo-50 border-indigo-100",
    high: "text-amber-600 bg-amber-50 border-amber-100",
    urgent: "text-rose-600 bg-rose-50 border-rose-100",
  };

  const priorityKey = task.priority?.toLowerCase() || 'medium';

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm transition-all duration-500 group relative overflow-hidden",
        isDraggable ? "cursor-grab active:cursor-grabbing hover:shadow-xl hover:shadow-indigo-500/10" : "cursor-default",
        isDragging && "opacity-50 z-50 scale-105 shadow-2xl rotate-2"
      )}
    >
      {/* Decorative accent */}
      <div className={cn(
        "absolute top-0 left-0 w-full h-1 opacity-20",
        priorityKey === 'urgent' ? "bg-rose-500" : "bg-indigo-500"
      )} />

      <div className="flex items-start justify-between mb-5">
        <div className={cn(
          "text-[10px] px-3 py-1 rounded-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 border shadow-sm transition-transform group-hover:scale-105 duration-500",
          priorityColors[priorityKey] || priorityColors.medium
        )}>
          <div className="w-1 h-1 rounded-full bg-current animate-pulse" />
          {task.priority}
        </div>

        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Can roles="admin">
            <button 
              onClick={() => useModalStore.getState().openModal('task', { task })}
              className="h-8 w-8 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center border border-transparent hover:border-indigo-100"
            >
              <MoreVertical size={14} />
            </button>
            <button 
              onClick={() => confirm("Delete task?") && deleteTask(task.id)}
              className="h-8 w-8 rounded-xl bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center border border-transparent hover:border-rose-100"
            >
              <Trash2 size={14} />
            </button>
          </Can>
        </div>
      </div>

      <h4 className="text-[15px] md:text-[16px] font-black text-slate-900 mb-2 leading-snug tracking-tight group-hover:text-indigo-600 transition-colors duration-300">
        {task.title}
      </h4>
      
      {task.description && (
        <p className="text-[13px] font-bold text-slate-400 line-clamp-2 mb-6 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
        <div className="flex items-center gap-3">
          <div className="relative group/assignee">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-indigo-500/20 ring-2 ring-white transition-transform group-hover/assignee:scale-110">
              {task.assignee?.name?.charAt(0) || "U"}
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] font-black text-slate-900 truncate max-w-[100px]">
              {task.assignee?.name || "Unassigned"}
            </span>
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">Assignee</span>
          </div>
        </div>

        {task.dueDate && (
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-400 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100/50">
              <Clock size={12} className="text-slate-300" strokeWidth={3} />
              <span className="tabular-nums uppercase tracking-tight">
                 {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

