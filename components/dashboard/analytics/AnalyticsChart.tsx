"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

import { ChartPoint } from "@/types/analytics";

interface AnalyticsChartProps {
  data: ChartPoint[];
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
      <CardHeader className="border-b border-slate-50/50 pb-8">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-slate-900">Goal Completion Trends</CardTitle>
            <CardDescription className="text-slate-400 font-medium">Weekly activity and throughput analysis</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              <TrendingUp size={12} />
              +24%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-10">
        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01}/>
                </linearGradient>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.05}/>
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f8fafc" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                dx={-10}
              />
              <Tooltip 
                cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</p>
                        {payload.map((entry: any, i: number) => (
                          <div key={i} className="flex items-center gap-3 py-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <p className="text-sm font-bold text-slate-700">
                              <span className="text-slate-400 font-medium mr-1">{entry.name}:</span>
                              {entry.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                height={50} 
                iconType="circle" 
                formatter={(value) => <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{value}</span>}
              />
              <Area 
                type="monotone" 
                dataKey="completed" 
                stroke="#6366f1" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorCompleted)" 
                name="Completed"
                animationDuration={2000}
              />
              <Area 
                type="monotone" 
                dataKey="active" 
                stroke="#94a3b8" 
                strokeWidth={2}
                strokeDasharray="6 6"
                fillOpacity={1} 
                fill="url(#colorActive)" 
                name="Active"
                animationDuration={2500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

