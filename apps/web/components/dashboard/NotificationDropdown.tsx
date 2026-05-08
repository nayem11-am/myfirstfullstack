"use client";

import { useState, useRef, useEffect } from "react";
import { useNotificationStore, Notification } from "@/store/useNotificationStore";
import { Bell, Check, Trash2, Clock, Info, CheckCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/Button";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-emerald-500" size={16} />;
      case 'warning': return <AlertTriangle className="text-amber-500" size={16} />;
      default: return <Info className="text-indigo-500" size={16} />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute right-0 mt-3 w-[380px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-[100]"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900">Notifications</h3>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 px-2 text-[11px] text-indigo-600 font-bold uppercase tracking-wider hover:bg-indigo-50">
                  Mark all read
                </Button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
              {notifications.length > 0 ? (
                notifications.map((n) => (
                  <div 
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={cn(
                      "p-4 border-b border-slate-50 flex gap-4 cursor-pointer transition-colors",
                      !n.read ? "bg-indigo-50/20 hover:bg-indigo-50/40" : "hover:bg-slate-50"
                    )}
                  >
                    <div className="shrink-0 mt-1">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <p className={cn("text-sm leading-tight", !n.read ? "font-bold text-slate-900" : "text-slate-600")}>
                          {n.title}
                        </p>
                        {!n.read && <div className="w-2 h-2 bg-indigo-500 rounded-full shrink-0 mt-1.5" />}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{n.message}</p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 pt-1">
                        <Clock size={10} />
                        {formatDistanceToNow(new Date(n.timestamp))} ago
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Bell className="text-slate-200" size={24} />
                  </div>
                  <p className="text-sm font-medium text-slate-400">All caught up!</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 bg-slate-50/50 flex justify-center">
                <Button variant="ghost" size="sm" onClick={clearAll} className="w-full h-9 text-[11px] text-slate-400 font-bold uppercase tracking-widest hover:text-red-500">
                  <Trash2 size={12} className="mr-2" />
                  Clear all history
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
