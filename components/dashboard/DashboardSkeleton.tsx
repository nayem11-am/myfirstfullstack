"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-12 pb-24">
      {/* Welcome Section Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-10">
        <div className="space-y-4">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-12 w-64 md:w-96 rounded-2xl" />
          <Skeleton className="h-6 w-48 md:w-80 rounded-xl" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-32 rounded-2xl" />
          <Skeleton className="h-14 w-40 rounded-[20px]" />
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100">
            <div className="flex flex-col gap-4">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-3 w-32 mt-2" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Chart Section Skeleton */}
        <div className="lg:col-span-12">
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 h-[400px] flex flex-col">
            <Skeleton className="h-6 w-48 mb-8" />
            <Skeleton className="flex-1 w-full rounded-2xl" />
          </div>
        </div>

        {/* Tasks Section Skeleton */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 h-full">
            <div className="flex justify-between items-center mb-8">
              <Skeleton className="h-8 w-40" />
              <Skeleton className="h-10 w-10 rounded-2xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed Skeleton */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 h-full">
             <div className="flex justify-between items-center mb-8">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-10 w-10 rounded-2xl" />
            </div>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4 items-start">
                  <Skeleton className="h-10 w-10 rounded-2xl shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
