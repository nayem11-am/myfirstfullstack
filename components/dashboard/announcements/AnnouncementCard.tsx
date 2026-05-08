"use client";

import { Announcement, ReactionType } from "@/types/announcement";
import { useAnnouncementStore } from "@/store/useAnnouncementStore";
import { 
  Pin, 
  MoreHorizontal, 
  ThumbsUp, 
  Heart, 
  Flame,
  Clock,
  User,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Can } from "@/components/auth/Can";
import { toast } from "sonner";

interface AnnouncementCardProps {
  announcement: Announcement;
}

import { MessageSquare, Send } from "lucide-react";
import { useState } from "react";

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const { toggleReaction, pinAnnouncement, deleteAnnouncement, addComment } = useAnnouncementStore();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const reactionIcons = {
    like: { icon: ThumbsUp, color: "text-indigo-500", bg: "bg-indigo-50", label: "Like" },
    love: { icon: Heart, color: "text-rose-500", bg: "bg-rose-50", label: "Love" },
    fire: { icon: Flame, color: "text-amber-500", bg: "bg-amber-50", label: "Fire" },
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      await deleteAnnouncement(announcement.id);
      toast.success("Announcement deleted");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    await addComment(announcement.id, commentText);
    setCommentText("");
  };

  return (
    <div className={cn(
      "bg-white rounded-[24px] md:rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 overflow-hidden group",
      announcement.isPinned && "border-indigo-100 bg-indigo-50/10"
    )}>
      {/* Pinned Indicator */}
      {announcement.isPinned && (
        <div className="bg-indigo-600 px-6 py-2.5 flex items-center justify-between text-[10px] font-black text-white uppercase tracking-[0.2em]">
          <div className="flex items-center gap-2">
            <Pin size={12} className="fill-current" />
            Pinned Announcement
          </div>
          <span className="opacity-60">Important Update</span>
        </div>
      )}
      
      <div className="p-6 md:p-10">
        {/* Author Header */}
        <div className="flex items-start justify-between mb-6 md:mb-8">
          <div className="flex items-center gap-5">
            <div className="relative group/avatar">
              <div className="w-14 h-14 rounded-[22px] bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center border border-indigo-100 shadow-sm group-hover/avatar:scale-105 transition-all duration-500">
                <User size={28} className="text-indigo-300" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-[3px] border-white shadow-sm" />
            </div>
            <div>
              <h4 className="text-[17px] font-black text-slate-900 leading-tight mb-1 tracking-tight group-hover:text-indigo-600 transition-colors">
                {announcement.author.name}
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg">
                  {announcement.author.role}
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="text-[12px] font-bold text-slate-400">
                  {formatDistanceToNow(new Date(announcement.createdAt))} ago
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Can roles="admin">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleDelete}
                className="h-10 w-10 rounded-2xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </Button>
            </Can>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl text-slate-300 hover:text-slate-600 hover:bg-slate-50 transition-all">
              <MoreHorizontal size={20} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="text-slate-700 text-[16px] md:text-[18px] leading-[1.6] mb-8 md:mb-10 whitespace-pre-wrap font-medium tracking-tight">
          {announcement.content}
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 md:pt-8 border-t border-slate-50">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            {(['like', 'love', 'fire'] as ReactionType[]).map((type) => {
              const config = reactionIcons[type];
              const isActive = announcement.userReactions.includes(type);
              const count = announcement.reactions[type];

              return (
                <button
                  key={type}
                  onClick={() => {
                    toggleReaction(announcement.id, type);
                    toast.success(`Reacted with ${type}!`, { icon: <config.icon size={16} className={config.color} /> });
                  }}
                  className={cn(
                    "flex items-center gap-1.5 md:gap-2.5 px-3 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[13px] md:text-[14px] font-black transition-all duration-300 active:scale-90",
                    isActive 
                      ? `${config.color} ${config.bg} shadow-[0_4px_12px_rgba(99,102,241,0.1)] scale-[1.05] ring-2 ring-indigo-100` 
                      : "text-slate-400 bg-slate-50/50 hover:bg-slate-100 hover:text-slate-600 hover:scale-[1.02]"
                  )}
                >
                  <config.icon size={18} className={cn(isActive && "fill-current animate-in zoom-in duration-300")} strokeWidth={isActive ? 3 : 2} />
                  {count > 0 && <span className="tabular-nums">{count}</span>}
                </button>
              );
            })}

            <div className="w-px h-6 bg-slate-100 mx-1" />

            <button 
              onClick={() => setShowComments(!showComments)}
              className={cn(
                "flex items-center gap-1.5 md:gap-2.5 px-3 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[13px] md:text-[14px] font-black transition-all",
                showComments ? "text-indigo-600 bg-indigo-50" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
              )}
            >
              <MessageSquare size={18} strokeWidth={2.5} />
              {announcement.comments?.length || 0}
            </button>
          </div>

          <Can roles="admin">
            <button 
              onClick={() => pinAnnouncement(announcement.id)}
              className={cn(
                "flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.1em] transition-all",
                announcement.isPinned 
                  ? "text-indigo-600 bg-indigo-50" 
                  : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
              )}
            >
              <Pin size={16} className={cn(announcement.isPinned && "fill-current")} />
              {announcement.isPinned ? "Unpin" : "Pin"}
            </button>
          </Can>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-8 pt-8 border-t border-slate-50 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            {announcement.comments?.map((comment) => (
              <div key={comment.id} className="flex gap-4 group/comment">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 shrink-0 group-hover/comment:bg-indigo-50 group-hover/comment:text-indigo-300 transition-colors">
                  <User size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[14px] font-black text-slate-900">{comment.author.name}</span>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-lg">
                      {comment.author.role}
                    </span>
                    <span className="text-[11px] font-bold text-slate-300 ml-auto">
                      {formatDistanceToNow(new Date(comment.createdAt))}
                    </span>
                  </div>
                  <p className="text-[14px] text-slate-600 leading-relaxed font-medium">{comment.content}</p>
                </div>
              </div>
            ))}

            <form onSubmit={handleAddComment} className="flex gap-3 pt-2">
              <input 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                className="flex-1 h-14 px-6 rounded-2xl bg-slate-50 border-transparent text-[14px] font-bold placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-200 outline-none transition-all"
              />
              <Button type="submit" size="icon" className="h-14 w-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20">
                <Send size={20} />
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

