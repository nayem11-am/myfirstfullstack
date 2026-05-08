"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGoalStore } from "@/store/useGoalStore";
import { useTeamStore } from "@/store/useTeamStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";
import { Plus, Target, Calendar, User as UserIcon, X } from "lucide-react";

const goalSchema = z.object({
  title: z.string().min(3, "Title is too short"),
  description: z.string().optional(),
  targetDate: z.string().min(1, "Target date is required"),
  priority: z.enum(["low", "medium", "high"]),
  assigneeId: z.string().optional(),
});

type GoalFormValues = z.infer<typeof goalSchema>;

export function GoalForm({ onSuccess }: { onSuccess: () => void }) {
  const addGoal = useGoalStore((state) => state.addGoal);
  const isLoading = useGoalStore((state) => state.isLoading);
  const { members, fetchMembers } = useTeamStore();
  const user = useAuthStore((state) => state.user);
  const [milestones, setMilestones] = useState<string[]>([""]);

  // Load workspace members when form opens
  useEffect(() => {
    if (user?.workspaceId) {
      fetchMembers(user.workspaceId);
    }
  }, [user?.workspaceId]); // eslint-disable-line

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      priority: "medium",
    },
  });

  const addMilestone = () => setMilestones((prev) => [...prev, ""]);
  const removeMilestone = (i: number) =>
    setMilestones((prev) => prev.filter((_, idx) => idx !== i));
  const updateMilestone = (i: number, val: string) =>
    setMilestones((prev) => prev.map((m, idx) => (idx === i ? val : m)));

  const onSubmit = async (data: GoalFormValues) => {
    const workspaceId = user?.workspaceId;
    if (!workspaceId) {
      toast.error("No workspace found. Please refresh and try again.");
      return;
    }
    try {
      const filteredMilestones = milestones
        .map((m) => m.trim())
        .filter(Boolean)
        .map((title) => ({ title }));

      await addGoal({
        ...data,
        workspaceId,
        dueDate: data.targetDate,
        milestones: filteredMilestones,
      } as any);

      toast.success("Goal created successfully!");
      reset();
      setMilestones([""]);
      onSuccess();
    } catch (err) {
      toast.error("Failed to create goal");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Goal Title</label>
        <div className="relative">
          <Target className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            {...register("title")}
            placeholder="e.g. Launch Mobile App"
            className="pl-10 h-11 rounded-xl border-slate-200"
            error={errors.title?.message}
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Description</label>
        <Input
          {...register("description")}
          placeholder="Briefly describe your goal"
          className="h-11 rounded-xl border-slate-200"
        />
      </div>

      {/* Assignee */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">Assign To</label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <select
            {...register("assigneeId")}
            className="w-full h-11 pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="">Select a member (optional)...</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}{" "}
                {member.id === user?.id ? "(Me)" : ""}
                {" "}— {member.role}
              </option>
            ))}
          </select>
        </div>
        {members.length === 0 && (
          <p className="text-xs text-amber-500 font-medium">
            ⚠ No members found. Make sure members are added to the workspace first.
          </p>
        )}
      </div>

      {/* Date & Priority */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Target Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              {...register("targetDate")}
              type="date"
              className="pl-10 h-11 rounded-xl border-slate-200"
              error={errors.targetDate?.message}
            />
          </div>
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
          </select>
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700">Milestones</label>
          <button
            type="button"
            onClick={addMilestone}
            className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
          >
            <Plus size={12} /> Add
          </button>
        </div>
        <div className="space-y-2">
          {milestones.map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input
                value={m}
                onChange={(e) => updateMilestone(i, e.target.value)}
                placeholder={`Milestone ${i + 1}`}
                className="h-10 rounded-xl border-slate-200 flex-1"
              />
              {milestones.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeMilestone(i)}
                  className="text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full mt-4 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20"
        isLoading={isLoading}
      >
        <Plus size={18} className="mr-2" />
        Create Goal
      </Button>
    </form>
  );
}
