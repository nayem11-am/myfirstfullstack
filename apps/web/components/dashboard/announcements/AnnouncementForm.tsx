"use client";

import { useState } from "react";
import { useAnnouncementStore } from "@/store/useAnnouncementStore";
import { Button } from "@/components/ui/Button";
import { Megaphone, Pin, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function AnnouncementForm() {
  const [content, setContent] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const { addAnnouncement, isLoading } = useAnnouncementStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await addAnnouncement(content, isPinned);
      setContent("");
      setIsPinned(false);
      toast.success("Announcement posted!");
    } catch (err) {
      toast.error("Failed to post announcement");
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-2 focus-within:shadow-md transition-shadow"
    >
      <div className="p-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening in your workspace?"
          className="w-full min-h-[100px] bg-transparent border-none focus:ring-0 text-slate-700 placeholder:text-slate-400 resize-none text-[15px]"
        />
      </div>
      
      <div className="flex items-center justify-between p-2 pt-0">
        <div className="flex items-center gap-1 pl-2">
          <button
            type="button"
            onClick={() => setIsPinned(!isPinned)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-2xl text-[12px] font-bold transition-all",
              isPinned ? "text-indigo-600 bg-indigo-50" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            )}
          >
            <Pin size={14} className={cn(isPinned && "fill-current")} />
            Pin this
          </button>
        </div>

        <Button 
          type="submit" 
          disabled={!content.trim() || isLoading}
          isLoading={isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-6 h-10 shadow-lg shadow-indigo-600/20"
        >
          <Send size={16} className="mr-2" />
          Post
        </Button>
      </div>
    </form>
  );
}
