import { BarChart3 } from "lucide-react";

export function AnalyticsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl shadow-sm border border-slate-50">
      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
        <BarChart3 size={32} />
      </div>
      <h3 className="text-lg font-bold text-slate-900">No data available</h3>
      <p className="text-slate-500 max-w-xs mt-2">
        We couldn't find any analytics data for this workspace yet. Start adding goals to see your progress!
      </p>
    </div>
  );
}
