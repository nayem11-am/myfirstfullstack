"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTaskStore } from "@/store/useTaskStore";
import { useTeamStore } from "@/store/useTeamStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { Plus, Layout, Calendar, User as UserIcon } from "lucide-react";
import { TaskStatus, TaskPriority, Task } from "@/types/task";

const taskSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export function TaskForm({ 
  onSuccess,
  defaultStatus = "todo",
  task 
}: { 
  onSuccess: () => void;
  defaultStatus?: TaskStatus;
  task?: Task;
}) {
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const isLoading = useTaskStore((state) => state.isLoading);
  const { members, fetchMembers } = useTeamStore();
  const user = useAuthStore((state) => state.user);

  // Always load fresh members when modal opens
  const hasFetched = useRef(false);
  useEffect(() => {
    if (user?.workspaceId) {
      fetchMembers(user.workspaceId);
      hasFetched.current = true;
    }
  }, [user?.workspaceId]);  // eslint-disable-line

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: task ? {
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate || "",
      assigneeId: task.assigneeId || "",
    } : {
      status: defaultStatus as any,
      priority: "medium",
    },
  });

  const onSubmit = async (data: TaskFormValues) => {
    const workspaceId = user?.workspaceId;
    if (!workspaceId) {
      toast.error("No workspace found. Please refresh and try again.");
      return;
    }
    try {
      if (task) {
        await updateTask(task.id, { ...data, workspaceId });
        toast.success("Task updated successfully!");
      } else {
        await addTask({ ...data, workspaceId });
        toast.success("Task created successfully!");
      }
      reset();
      onSuccess();
    } catch (err) {
      toast.error(task ? "Failed to update task" : "Failed to create task");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Task Title</label>
        <div className="relative">
          <Layout className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input 
            {...register("title")} 
            placeholder="e.g. Design Login UI" 
            className="pl-10 h-11 rounded-xl border-slate-200"
            error={errors.title?.message}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Assignee</label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <select 
            {...register("assigneeId")}
            className="w-full h-11 pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">Select a member...</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} {member.id === useAuthStore.getState().user?.id ? "(Me)" : ""}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Description</label>
        <Input 
          {...register("description")} 
          placeholder="Add more details..." 
          className="h-11 rounded-xl border-slate-200"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Status</label>
          <select 
            {...register("status")}
            disabled={!task}
            className="w-full h-11 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100 disabled:text-slate-400"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Priority</label>
          <select 
            {...register("priority")}
            className="w-full h-11 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Due Date</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input 
            {...register("dueDate")} 
            type="date" 
            className="pl-10 h-11 rounded-xl border-slate-200"
          />
        </div>
      </div>

      <Button type="submit" className="w-full mt-4 h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-white font-bold shadow-lg shadow-indigo-600/20" isLoading={isLoading}>
        <Plus size={18} className="mr-2" />
        {task ? 'Update Task' : 'Create Task'}
      </Button>
    </form>
  );
}
