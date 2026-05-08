"use client";

import { useEffect } from "react";
import { useAnnouncementStore } from "@/store/useAnnouncementStore";
import { useAuthStore } from "@/store/useAuthStore";
import { AnnouncementCard } from "@/components/dashboard/announcements/AnnouncementCard";
import { AnnouncementForm } from "@/components/dashboard/announcements/AnnouncementForm";
import { Megaphone, Loader2, Sparkles, Pin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Can } from "@/components/auth/Can";
import { AnnouncementsSkeleton } from "@/components/dashboard/announcements/AnnouncementsSkeleton";

export default function AnnouncementsPage() {
  const { announcements, isLoading, fetchAnnouncements } = useAnnouncementStore();
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    if (user?.workspaceId) {
      fetchAnnouncements(user.workspaceId);
    }
  }, [user?.workspaceId, fetchAnnouncements]);

  if (isLoading && announcements.length === 0) {
    return <AnnouncementsSkeleton />;
  }

  // Sort: Pinned first, then by date
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center space-y-4 py-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-[32px] bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
            <Megaphone size={36} strokeWidth={2.5} />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-2xl bg-white shadow-xl flex items-center justify-center text-indigo-500 border border-slate-50">
             <Sparkles size={16} className="animate-pulse" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Announcements</h1>
          <p className="text-slate-400 font-bold text-lg">Synchronizing your workspace with real-time updates.</p>
        </div>
      </div>

      {/* Creation Feed */}
      <Can roles="admin">
        <div className="max-w-2xl mx-auto">
          <AnnouncementForm />
        </div>
      </Can>

      {/* Feed Divider */}
      <div className="flex items-center gap-6 py-4">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent flex-1" />
        <span className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-3">
          Latest Updates
        </span>
        <div className="h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent flex-1" />
      </div>

      {/* Feed Area */}
      <div className="space-y-10">
        {sortedAnnouncements.map((announcement, index) => (
          <div key={announcement.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <AnnouncementCard announcement={announcement} />
          </div>
        ))}
        
        {announcements.length === 0 && !isLoading && (
          <div className="text-center py-32 bg-slate-50/50 rounded-[60px] border-2 border-dashed border-slate-100 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-200 mb-6">
              <Megaphone size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Quiet for now</h3>
            <p className="text-slate-400 font-bold max-w-xs mx-auto mt-3 text-lg leading-relaxed">
              No updates have been shared yet. Use the form above to start the conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

