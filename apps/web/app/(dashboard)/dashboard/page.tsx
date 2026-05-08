"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useAnalyticsStore } from "@/store/useAnalyticsStore";
import { useTaskStore } from "@/store/useTaskStore";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/Card";
import { 
  TrendingUp, 
  Plus,
  Clock,
  Calendar,
  CheckSquare,
  ChevronRight
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { AnalyticsStats } from "@/components/dashboard/analytics/AnalyticsStats";
import { AnalyticsChart } from "@/components/dashboard/analytics/AnalyticsChart";
import { AnalyticsEmptyState } from "@/components/dashboard/analytics/AnalyticsEmptyState";
import { ExportButton } from "@/components/dashboard/analytics/ExportButton";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Can } from "@/components/auth/Can";


import { useRouter } from "next/navigation";
import { useModalStore } from "@/store/useModalStore";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data, isLoading: isAnalyticsLoading, fetchAnalytics } = useAnalyticsStore();
  const { tasks, isLoading: isTasksLoading, fetchTasks } = useTaskStore();
  const openModal = useModalStore((state) => state.openModal);
  const router = useRouter();

  const workspaceId = user?.workspaceId;

  useEffect(() => {
    if (workspaceId) {
      useAnalyticsStore.getState().fetchAnalytics(workspaceId);
      useTaskStore.getState().fetchTasks(workspaceId);
    }
  }, [workspaceId]);

  const upcomingTasks = tasks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const isLoading = isAnalyticsLoading || isTasksLoading;

  if (isLoading && (!data || tasks.length === 0)) {
    return <DashboardSkeleton />;
  }

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'DONE':
      case 'COMPLETED':
        return 'bg-emerald-500';
      case 'IN_PROGRESS':
        return 'bg-indigo-500';
      case 'IN_REVIEW':
        return 'bg-amber-500';
      case 'TODO':
        return 'bg-slate-400';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <div className="space-y-8 md:space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 border-b border-slate-100 pb-8 md:pb-10">
        <div>
          <div className="flex items-center gap-2.5 mb-3 md:mb-4">
            <div className="flex h-5 items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 border border-emerald-100/50">
               <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
               </span>
               Live
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Overview</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] md:leading-[0.9] mb-3 md:mb-4">
            {getTimeGreeting()}, {user?.fullName?.split(' ')[0] || "User"}
          </h2>
          <p className="text-slate-400 font-bold text-base md:text-lg max-w-xl leading-relaxed">
            Here's what's happening with your projects today.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ExportButton />
          <Can roles="admin">
            <Button 
              onClick={() => openModal('goal')}
              className="bg-slate-900 hover:bg-black text-white rounded-[16px] md:rounded-[20px] px-6 md:px-8 h-12 md:h-14 shadow-xl md:shadow-2xl shadow-slate-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] font-black text-xs md:text-sm w-full md:w-auto"
            >
              <Plus size={18} className="mr-2 md:w-5 md:h-5" strokeWidth={3} />
              Set New Goal
            </Button>
          </Can>
        </div>
      </div>


      {data ? (
        <>
          {/* Stats Grid */}
          <AnalyticsStats data={data} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Chart Section - Full Width */}
            <div className="lg:col-span-12">
              <AnalyticsChart data={data.chartData} />
            </div>

            {/* Upcoming Tasks - Left Side */}
            <div className="lg:col-span-8">
              <Card className="border-none shadow-sm bg-white rounded-[32px] h-full flex flex-col hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-black text-slate-900">Recent Tasks</CardTitle>
                      <CardDescription className="text-slate-400 font-bold">Latest activity in your workspace</CardDescription>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                      <Calendar size={24} strokeWidth={2.5} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    {upcomingTasks.length > 0 ? (
                      upcomingTasks.map(task => (
                        <TaskItem 
                          key={task.id}
                          title={task.title} 
                          time={task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No deadline"} 
                          status={task.status} 
                          statusColor={getStatusColor(task.status)} 
                        />
                      ))
                    ) : (
                      <div className="col-span-full py-16 flex flex-col items-center justify-center bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100">
                        <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-200 mb-4">
                          <CheckSquare size={32} strokeWidth={1.5} />
                        </div>
                        <p className="text-lg text-slate-400 font-bold">No tasks found</p>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => router.push('/dashboard/tasks')}
                    className="w-full mt-10 border-slate-100 bg-slate-50/50 text-slate-900 hover:bg-slate-900 hover:text-white rounded-[20px] h-14 transition-all duration-300 font-black text-xs uppercase tracking-widest group"
                  >
                     Explore Full Task Board
                     <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Activity Feed - Right Side */}
            <div className="lg:col-span-4">
              <ActivityFeed />
            </div>
          </div>
        </>
      ) : (
        <AnalyticsEmptyState />
      )}
    </div>
  );
}

interface TaskItemProps {
  title: string;
  time: string;
  status: string;
  statusColor: string;
}

function TaskItem({ title, time, status, statusColor }: TaskItemProps) {
  return (
    <div className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-3 rounded-2xl transition-all duration-300">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:border-indigo-100 group-hover:text-indigo-500 transition-all duration-500 shadow-sm">
            <Clock size={20} />
          </div>
          <div className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${statusColor}`} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{title}</p>
          <div className="flex items-center gap-2 mt-0.5">
             <div className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter text-white ${statusColor}`}>
               {status?.replace('_', ' ')}
             </div>
             <p className="text-[11px] font-bold text-slate-300 uppercase tracking-tight">{time}</p>
          </div>
        </div>
      </div>
      <div className="h-6 w-1 rounded-full bg-slate-100 group-hover:bg-indigo-200 transition-colors" />
    </div>
  );
}

