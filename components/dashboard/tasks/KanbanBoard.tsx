"use client";

import { useTaskStore } from "@/store/useTaskStore";
import { TaskCard } from "./TaskCard";
import { TaskStatus } from "@/types/task";
import { Plus, MoreHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'todo', label: 'To Do', color: 'bg-slate-500' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-amber-500' },
  { id: 'done', label: 'Done', color: 'bg-emerald-500' },
];

import { useModalStore } from "@/store/useModalStore";
import { useSearchStore } from "@/store/useSearchStore";
import { Can } from "@/components/auth/Can";
import { useAuthStore } from "@/store/useAuthStore";

import { 
  DndContext, 
  DragEndEvent, 
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';

function DroppableColumn({ 
  column, 
  columnTasks, 
  openModal, 
  query 
}: { 
  column: { id: TaskStatus; label: string; color: string }, 
  columnTasks: any[],
  openModal: any,
  query: string
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "Column",
      column,
    }
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "flex flex-col h-full rounded-[24px] md:rounded-[40px] p-4 md:p-6 border transition-all duration-300 relative overflow-hidden",
        isOver ? "bg-indigo-50/50 border-indigo-200 shadow-inner" : "bg-slate-50/40 border-slate-100/50"
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <div className={cn("w-3 h-3 rounded-full shadow-sm", column.color)} />
          <h3 className="font-black text-slate-900 text-[13px] uppercase tracking-[0.2em]">
             {column.label}
          </h3>
          <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg">
            {columnTasks.length}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Can roles="admin">
            {column.id === 'todo' && (
              <button 
                onClick={() => openModal('task', { defaultStatus: column.id })}
                className="h-9 w-9 bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all rounded-xl shadow-sm border border-slate-100 flex items-center justify-center"
              >
                <Plus size={18} strokeWidth={3} />
              </button>
            )}
          </Can>
          <button className="h-9 w-9 bg-transparent text-slate-300 hover:text-slate-600 transition-all rounded-xl flex items-center justify-center">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 space-y-6 overflow-y-auto scrollbar-hide min-h-[200px] pb-10">
        {columnTasks.map((task, index) => (
          <div key={task.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <TaskCard task={task} />
          </div>
        ))}
        
        {columnTasks.length === 0 && (
          <div className="h-40 border-2 border-dashed border-slate-100 rounded-[32px] flex flex-col items-center justify-center gap-3 bg-white/20">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-100">
               <Plus size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              {query ? "No matches" : `No ${column.label} tasks`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function KanbanBoard() {
  const { tasks, updateTaskStatus, isLoading } = useTaskStore();
  const openModal = useModalStore((state) => state.openModal);
  const { query } = useSearchStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before starting drag to prevent accidental drags on click
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    const task = active.data.current?.task;

    if (!task || task.status?.toLowerCase() === newStatus.toLowerCase()) return;

    updateTaskStatus(taskId, newStatus);

    if (newStatus === 'done') {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#10b981'],
        zIndex: 9999
      });
      toast.success("Task completed! Great job.");
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.title?.toLowerCase().includes(query.toLowerCase()) ||
    task.description?.toLowerCase().includes(query.toLowerCase())
  );


  if (isLoading && tasks.length === 0) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Synchronizing Board...</p>
      </div>
    );
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <div className="flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-8 h-full min-h-[700px] overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
        {COLUMNS.map((column) => {
          const columnTasks = filteredTasks.filter((t) => t.status?.toLowerCase() === column.id.toLowerCase());

          return (
            <div key={column.id} className="min-w-[300px] md:min-w-0">
              <DroppableColumn 
                column={column} 
                columnTasks={columnTasks} 
                openModal={openModal} 
                query={query} 
              />
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}

