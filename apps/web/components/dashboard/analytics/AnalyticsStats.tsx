"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { TrendingUp, CheckCircle2, AlertCircle, Percent } from "lucide-react";
import { AnalyticsData } from "@/types/analytics";
import { cn } from "@/lib/utils";

interface AnalyticsStatsProps {
  data: AnalyticsData;
}

export function AnalyticsStats({ data }: AnalyticsStatsProps) {
  const stats = [
    {
      title: "Total Goals",
      value: data.totalGoals,
      description: "Active across all projects",
      icon: TrendingUp,
      color: "indigo",
      gradient: "from-indigo-500/10 to-transparent",
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Completed This Week",
      value: data.completedThisWeek,
      description: "Velocity +12% from last week",
      icon: CheckCircle2,
      color: "emerald",
      gradient: "from-emerald-500/10 to-transparent",
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Overdue Goals",
      value: data.overdueGoals,
      description: "Action required on 2 items",
      icon: AlertCircle,
      color: "rose",
      gradient: "from-rose-500/10 to-transparent",
      iconColor: "text-rose-600",
      bgColor: "bg-rose-50",
    },
    {
      title: "Completion Rate",
      value: `${data.completionRate}%`,
      description: "Team efficiency score",
      icon: Percent,
      color: "amber",
      gradient: "from-amber-500/10 to-transparent",
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <Card 
          key={i} 
          className="group border-none shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 bg-white rounded-3xl transition-all duration-500 overflow-hidden relative"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
          
          <CardContent className="p-6 relative z-10">
            <div className="flex flex-col gap-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.bgColor} flex items-center justify-center ${stat.iconColor} group-hover:scale-110 transition-transform duration-500 ease-out shadow-sm`}>
                <stat.icon size={22} strokeWidth={2.5} />
              </div>
              
              <div>
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">{stat.title}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black text-slate-900 tabular-nums tracking-tight">{stat.value}</h3>
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-slate-200" />
                  <p className="text-xs font-medium text-slate-500">{stat.description}</p>
                </div>
              </div>
            </div>
          </CardContent>
          
          {/* Subtle bottom accent line */}
          <div className={cn(
            "absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 opacity-30",
            stat.color === 'indigo' ? "bg-indigo-500" :
            stat.color === 'emerald' ? "bg-emerald-500" :
            stat.color === 'rose' ? "bg-rose-500" :
            "bg-amber-500"
          )} />
        </Card>
      ))}
    </div>
  );
}

