"use client";

import { User, Mail, Shield, ShieldCheck, Search, Loader2, Trash2, Send, Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTeamStore } from "@/store/useTeamStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function TeamModal() {
  const { members, isLoading, fetchMembers, searchUsers, sendInvite } = useTeamStore();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isInviting, setIsInviting] = useState<string | null>(null);

  useEffect(() => {
    if (user?.workspaceId) {
      fetchMembers(user.workspaceId);
    }
  }, [user?.workspaceId, fetchMembers]);

  const handleSearch = async (val: string) => {
    setSearchQuery(val);
    if (val.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const results = await searchUsers(user?.workspaceId!, val);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleInvite = async (email: string) => {
    if (!user?.workspaceId) return;
    setIsInviting(email);
    try {
      await sendInvite(user.workspaceId, email, 'MEMBER');
      toast.success(`Invitation sent to ${email}`);
      setSearchResults(prev => prev.filter(r => r.email !== email));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsInviting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search & Invite Section */}
      <div className="space-y-4">
        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Invite New Members</label>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
          <Input 
            placeholder="Search users by name or email..." 
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-12 h-14 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-indigo-100 transition-all font-bold"
          />
        </div>

        {/* Search Results Dropdown-like List */}
        {searchResults.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
            {searchResults.map((result) => (
              <div key={result.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                    {result.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{result.fullName}</p>
                    <p className="text-[11px] text-slate-400">{result.email}</p>
                  </div>
                </div>
                <Button 
                  size="sm"
                  onClick={() => handleInvite(result.email)}
                  disabled={isInviting === result.email}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 h-9 font-bold flex items-center gap-2"
                >
                  {isInviting === result.email ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  Invite
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current Members Section */}
      <div className="space-y-4">
        <label className="text-xs font-black uppercase tracking-widest text-slate-400">Workspace Team ({members.length})</label>
        <div className="space-y-3">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                    {member.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{member.name}</p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Mail size={10} />
                    {member.email}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                  member.role?.toUpperCase() === 'ADMIN' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  {member.role?.toUpperCase() === 'ADMIN' ? <ShieldCheck size={12} /> : <Shield size={12} />}
                  {member.role}
                </div>
                
                {user?.role?.toUpperCase() === 'ADMIN' && member.id !== user.id ? (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      if (confirm(`Are you sure you want to remove ${member.name}?`)) {
                        useTeamStore.getState().removeMember(user.workspaceId!, member.id);
                      }
                    }}
                    className="h-8 w-8 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 size={16} />
                  </Button>
                ) : (
                  <div className="w-8" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
