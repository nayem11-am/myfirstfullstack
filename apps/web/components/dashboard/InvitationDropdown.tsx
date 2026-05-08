"use client";

import { useState, useEffect, useRef } from "react";
import { Mail, Check, X, Loader2, BellRing } from "lucide-react";
import { useTeamStore } from "@/store/useTeamStore";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function InvitationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { myInvitations, fetchMyInvitations, respondToInvitation } = useTeamStore();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchMyInvitations();
    // Poll for invitations every 30 seconds
    const interval = setInterval(fetchMyInvitations, 30000);
    return () => clearInterval(interval);
  }, [fetchMyInvitations]);

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

  const handleResponse = async (id: string, status: 'ACCEPTED' | 'DECLINED') => {
    setIsProcessing(id);
    try {
      await respondToInvitation(id, status);
      toast.success(`Invitation ${status.toLowerCase()}ed!`);
      if (status === 'ACCEPTED') {
        window.location.reload(); // Reload to update workspace memberships
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-11 w-11 rounded-2xl flex items-center justify-center transition-all relative border border-transparent",
          isOpen ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
        )}
      >
        <Mail size={22} strokeWidth={2.5} />
        {myInvitations.length > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center animate-bounce">
            {myInvitations.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-[360px] bg-white/95 backdrop-blur-xl border border-slate-100 rounded-[32px] shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-6 border-b border-slate-50">
            <h3 className="text-lg font-black text-slate-900">Workspace Invites</h3>
            <p className="text-xs text-slate-400 font-bold">Manage your pending invitations</p>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {myInvitations.length > 0 ? (
              <div className="p-4 space-y-3">
                {myInvitations.map((invite) => (
                  <div key={invite.id} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                         <Mail size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-800 leading-tight">
                          {invite.invitedBy.fullName} invited you to join <span className="text-indigo-600">{invite.workspace.name}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 font-bold">Role: {invite.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        onClick={() => handleResponse(invite.id, 'ACCEPTED')}
                        disabled={!!isProcessing}
                        className="flex-1 h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black gap-2 shadow-lg shadow-indigo-600/20"
                      >
                        {isProcessing === invite.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} strokeWidth={3} />}
                        Accept
                      </Button>
                      <Button 
                        onClick={() => handleResponse(invite.id, 'DECLINED')}
                        disabled={!!isProcessing}
                        variant="outline"
                        className="flex-1 h-9 border-slate-200 text-slate-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 rounded-xl text-xs font-black gap-2"
                      >
                        <X size={14} strokeWidth={3} />
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 px-6 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-slate-200 mb-4 border border-slate-100/50">
                  <Mail size={32} strokeWidth={1.5} />
                </div>
                <p className="text-sm font-bold text-slate-500">No pending invitations</p>
                <p className="text-xs text-slate-400 mt-1">You're all caught up!</p>
              </div>
            )}
          </div>

          {myInvitations.length > 0 && (
            <div className="p-4 bg-slate-50/50 border-t border-slate-50 text-center">
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">SaaS Workspace Management</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
