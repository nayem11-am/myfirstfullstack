export function AnalyticsSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-slate-100 rounded-2xl" />
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="h-[450px] bg-slate-100 rounded-2xl w-full" />
    </div>
  );
}
