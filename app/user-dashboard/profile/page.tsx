"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Sidebar from "@/components/ui/user-sidebar";
import Header from "@/components/ui/user-header";
import UserNav from "@/components/ui/user-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  Mail,
  AtSign,
  Camera,
  Save,
  Calendar,
  Clock,
  CheckCircle,
  Shield,
  Loader2,
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, update } = useSession();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    username: "",
  });

  useEffect(() => {
    if (session?.user) {
      const s = session.user as any;
      setProfile({
        fullName: s.name || "",
        email: s.email || "",
        username: s.username || "",
      });
    }
  }, [session]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const dataUrl = reader.result as string;
      setProfileImage(dataUrl);
      try {
        setSavingAvatar(true);
        const res = await fetch("/api/users/avatar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatar: dataUrl }),
        });
        if (!res.ok) throw new Error("Failed to save avatar");
        toast.success("Profile photo updated successfully");
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      } catch (err) {
        console.error(err);
        toast.error("Could not update profile photo");
      } finally {
        setSavingAvatar(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    try {
      setIsSavingProfile(true);
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: profile.fullName, username: profile.username }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      toast.success("Profile updated successfully");
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (e) {
      toast.error("Could not update profile parameters");
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50 dark:bg-[#080d17] transition-colors duration-200">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-24 md:pb-8 mb-[50px] md:mb-0">
          
          {/* Header */}
          <div className="max-w-5xl mx-auto mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {session?.user?.name ? `Welcome back, ${session.user.name}! 👋` : "Account Workspace"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Configure security privileges, verification parameters, and identity settings.
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Card Grid Array */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Profile Image Node */}
              <Card className="bg-white dark:bg-[#0f1623] border border-gray-200/80 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm">
                <CardHeader className="p-5 border-b border-gray-100 dark:border-white/[0.04]">
                  <CardTitle className="text-sm font-bold text-gray-900 dark:text-white">Profile Photo</CardTitle>
                  <CardDescription className="text-xs text-gray-400 dark:text-slate-500">Avatar personalization token</CardDescription>
                </CardHeader>
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="relative mb-4 group">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 p-0.5 shadow-md flex items-center justify-center text-white text-3xl font-bold overflow-hidden relative">
                      {profileImage || (session as any)?.user?.avatar ? (
                        <img
                          src={(profileImage as string) || (((session as any).user?.avatar) as string)}
                          alt="Identity Representation"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <span className="tracking-tighter">
                          {profile.fullName
                            ? profile.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
                            : "U"}
                        </span>
                      )}

                      {/* Dynamic Upload Spinner Overlay */}
                      {savingAvatar && (
                        <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center backdrop-blur-xs">
                          <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                        </div>
                      )}
                    </div>
                    
                    <label
                      htmlFor="profile-upload"
                      className="absolute bottom-0 right-0 w-9 h-9 bg-emerald-500 hover:bg-emerald-600 border-2 border-white dark:border-[#0f1623] rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all transform hover:scale-105"
                    >
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        disabled={savingAvatar}
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-[11px] font-medium text-gray-400 dark:text-slate-500 text-center max-w-[180px]">
                    Supported formats: PNG, JPG or WEBP. Max file capacity 4MB.
                  </p>
                </CardContent>
              </Card>

              {/* Status Verification Identity Metrics */}
              <Card className="bg-white dark:bg-[#0f1623] border border-gray-200/80 dark:border-white/[0.06] rounded-2xl shadow-sm">
                <CardHeader className="p-5 border-b border-gray-100 dark:border-white/[0.04]">
                  <CardTitle className="text-sm font-bold text-gray-900 dark:text-white">Security Metadata</CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="font-semibold text-gray-700 dark:text-slate-300">Identity Status</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/30 dark:border-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[9px] rounded-md">
                      Verified
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-3 border-t border-gray-100 dark:border-white/[0.04]">
                    <div className="flex items-center gap-2.5">
                      <Shield className="w-4 h-4 text-emerald-500" />
                      <span className="font-semibold text-gray-700 dark:text-slate-300">Authority Clear</span>
                    </div>
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-white/[0.04] text-gray-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[9px] rounded-md">
                      {(session as any)?.user?.role || "Standard"}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-white/[0.04] space-y-1">
                    <div className="flex items-center gap-2 text-gray-400 dark:text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Registration Timestamp</span>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-slate-300 pl-5">
                      {(session as any)?.user?.createdAt
                        ? new Date((session as any).user.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-white/[0.04] space-y-1">
                    <div className="flex items-center gap-2 text-gray-400 dark:text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Session Synchronization</span>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 dark:text-slate-300 pl-5 truncate">
                      {(session as any)?.user?.lastLogin
                        ? new Date((session as any).user.lastLogin).toLocaleString()
                        : "—"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Information Node Inputs */}
            <div className="lg:col-span-2">
              <Card className="bg-white dark:bg-[#0f1623] border border-gray-200/80 dark:border-white/[0.06] rounded-2xl shadow-sm">
                <CardHeader className="p-5 border-b border-gray-100 dark:border-white/[0.04]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-gray-900 dark:text-white">Profile Registry Settings</CardTitle>
                      <CardDescription className="text-xs text-gray-400 dark:text-slate-500">Modify basic informational fields linked to this node</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-5">
                  
                  {/* Full Name Form */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                      Legal Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 opacity-60" />
                      <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 h-11 bg-gray-50/50 dark:bg-white/[0.01] border border-gray-200 dark:border-white/[0.06] rounded-xl focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 text-xs font-medium text-gray-900 dark:text-white transition-all outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Locked Email Form */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                      Immutable Communication Mail
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 opacity-40" />
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full pl-10 pr-4 h-11 bg-gray-100/60 dark:bg-white/[0.02] border border-gray-200/50 dark:border-white/[0.04] rounded-xl text-xs font-medium text-gray-400 dark:text-slate-500 cursor-not-allowed select-none outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Username Form */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                      Platform Public Alias Handle
                    </label>
                    <div className="relative">
                      <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 opacity-60" />
                      <input
                        type="text"
                        value={profile.username}
                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                        placeholder="johndoe"
                        className="w-full pl-10 pr-4 h-11 bg-gray-50/50 dark:bg-white/[0.01] border border-gray-200 dark:border-white/[0.06] rounded-xl focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500 text-xs font-medium text-gray-900 dark:text-white transition-all outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Submission Row */}
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile}
                      className="w-full lg:w-auto h-11 px-6 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-md shadow-emerald-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      {isSavingProfile ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Commit Registry Save
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <UserNav />
      </div>
    </div>
  );
}