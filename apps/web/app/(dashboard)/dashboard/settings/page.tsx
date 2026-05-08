"use client";

import { useState, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { 
  User, 
  Mail, 
  Shield, 
  Camera, 
  Loader2, 
  Check, 
  AlertCircle,
  Key
} from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile`, 
        { fullName },
        { withCredentials: true }
      );
      if (user) {
        setUser({ ...user, ...response.data.user });
      }
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }
    
    setIsUpdatingPassword(true);
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/password`,
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    setIsUploading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/avatar`,
        formData,
        { 
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      
      if (user) {
        setUser({ ...user, avatarUrl: response.data.avatar });
      }
      toast.success("Profile picture updated");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="border-b border-slate-100 pb-8 md:pb-10">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2 md:mb-3">Settings</h1>
        <p className="text-slate-400 font-bold text-base md:text-lg">Manage your personal profile and account security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Column: Avatar & Quick Info */}
        <div className="space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="relative group mb-6">
              <div className="w-32 h-32 rounded-[40px] overflow-hidden ring-4 ring-slate-50 group-hover:ring-indigo-100 transition-all duration-500 shadow-xl">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-black text-white">
                    {user?.fullName?.charAt(0)}
                  </div>
                )}
                
                {isUploading && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center rounded-[40px]">
                    <Loader2 className="text-white animate-spin" size={32} />
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
              >
                <Camera size={18} strokeWidth={2.5} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>

            <h2 className="text-2xl font-black text-slate-900 leading-tight">{user?.fullName}</h2>
            <p className="text-slate-400 font-bold text-sm mt-1">{user?.email}</p>
            
            <div className="mt-6 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <Shield size={12} strokeWidth={3} />
              {user?.role} Access
            </div>
          </div>

          <div className="bg-slate-900 p-6 md:p-8 rounded-[24px] md:rounded-[40px] text-white overflow-hidden relative group">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-colors" />
             <div className="relative z-10">
               <h3 className="text-lg font-black mb-2">Change Password</h3>
               <p className="text-slate-400 text-sm font-bold leading-relaxed mb-6">
                 Ensure your account remains secure by using a strong password.
               </p>
               
               <form onSubmit={handleUpdatePassword} className="space-y-4">
                 <Input 
                   type="password"
                   placeholder="Current Password"
                   value={currentPassword}
                   onChange={(e) => setCurrentPassword(e.target.value)}
                   required
                   className="bg-white/10 border-transparent text-white placeholder:text-slate-500 rounded-xl h-12"
                 />
                 <Input 
                   type="password"
                   placeholder="New Password"
                   value={newPassword}
                   onChange={(e) => setNewPassword(e.target.value)}
                   required
                   minLength={6}
                   className="bg-white/10 border-transparent text-white placeholder:text-slate-500 rounded-xl h-12"
                 />
                 <Input 
                   type="password"
                   placeholder="Confirm New Password"
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                   required
                   minLength={6}
                   className="bg-white/10 border-transparent text-white placeholder:text-slate-500 rounded-xl h-12"
                 />
                 <Button 
                   type="submit"
                   disabled={isUpdatingPassword || !currentPassword || !newPassword || !confirmPassword}
                   className="mt-2 w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-black h-12 transition-all disabled:opacity-50"
                 >
                   {isUpdatingPassword ? <Loader2 className="animate-spin mr-2" size={16} /> : <Key size={16} className="mr-2" strokeWidth={3} />}
                   Update Password
                 </Button>
               </form>
             </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[40px] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
               <User className="text-indigo-500" strokeWidth={2.5} />
               Public Information
            </h3>
            
            <form onSubmit={handleUpdateProfile} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                  <Input 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name" 
                    className="pl-14 h-16 bg-slate-50 border-transparent rounded-[24px] text-[15px] font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/5 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3 opacity-60">
                <label className="text-[12px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address (Read Only)</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  <Input 
                    value={user?.email || ""}
                    disabled
                    className="pl-14 h-16 bg-slate-100 border-transparent rounded-[24px] text-[15px] font-bold cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit"
                  disabled={isUpdating || fullName === user?.fullName}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-[24px] px-10 h-16 shadow-2xl shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] font-black text-lg disabled:opacity-50 disabled:scale-100"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 size={24} className="mr-3 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Check size={24} className="mr-3" strokeWidth={3} />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div className="bg-rose-50/50 border border-rose-100 p-6 md:p-8 rounded-[24px] md:rounded-[40px] flex items-start gap-6 group">
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-rose-500 shadow-sm shrink-0">
               <AlertCircle size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-rose-900 mb-2">Danger Zone</h3>
              <p className="text-rose-700/60 font-bold text-sm leading-relaxed mb-6">
                Permanently delete your account and all associated data. This action is irreversible and will remove all workspace access.
              </p>
              <Button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white rounded-2xl h-12 px-8 font-black transition-all">
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
