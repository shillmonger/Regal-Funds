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
} from "lucide-react";

// Theme constants (for reference, not used directly in this file, but their values are applied)
const primaryColorClass = "bg-emerald-500";
const primaryDarkerClass = "bg-emerald-600";
const primaryRingClass = "focus:ring-emerald-500";
const primaryTextClass = "text-emerald-500";

export default function ProfilePage() {
  const { data: session, update } = useSession(); // 👈 Get user session and updater
  console.log("Session data:", session); // 👈 Added line to log session

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [savingAvatar, setSavingAvatar] = useState(false);

  // Load user info from session when available
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    username: "",
  });

  useEffect(() => {
    if (session?.user) {
      const s: any = session.user as any;
      setProfile({
        fullName: (s.name as string) || "",
        email: (s.email as string) || "",
        username: (s.username as string) || "",
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
      // persist to API
      try {
        setSavingAvatar(true);
        const res = await fetch("/api/users/avatar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatar: dataUrl }),
        });
        if (!res.ok) throw new Error("Failed to save avatar");
        toast.success("Profile photo updated");
        // refresh session to include avatar
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
      toast.error("Could not update profile");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Profile Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-20 md:pb-8 mb-[50px] md:mb-0">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {session?.user?.name
                ? `Welcome, ${session.user.name}! 👋`
                : "Profile & Account Info"}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your personal information and account details
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture Card */}
            <div className="lg:col-span-1">
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">
                    Profile Picture
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Upload your profile photo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    {/* Avatar */}
                    <div className="relative mb-4">
                      {/* 👈 Updated gradient to emerald-500 instead of blue-500 */}
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                        {profileImage || (session as any)?.user?.avatar ? (
                          <img
                            src={(profileImage as string) || (((session as any).user?.avatar) as string)}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>
                            {profile.fullName
                              ? profile.fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                              : "U"}
                          </span>
                        )}
                      </div>
                      <label
                        htmlFor="profile-upload"
                        // 👈 Updated button background from blue-600/700 to emerald-600/700
                        className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-600 hover:bg-emerald-700 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition"
                      >
                        <Camera className="w-5 h-5 text-white" />
                        <input
                          id="profile-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      Click the camera icon to upload a new photo
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Account Status Card */}
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mt-6">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">
                    Account Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Email Verified */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Note: CheckCircle is already emerald-600/400 */}
                        <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Email Verified
                        </span>
                      </div>
                    </div>

                    {/* Account Type */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-2">
                        {/* 👈 Updated icon color from blue-600/400 to emerald-600/400 */}
                        <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          Account Type
                        </span>
                      </div>
                      {/* 👈 Updated badge background and text from blue to emerald */}
                      <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full">
                        {(session as any)?.user?.role || "Standard"}
                      </span>
                    </div>

                    {/* Member Since */}
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Member Since
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 ml-6">
                        {(session as any)?.user?.createdAt
                          ? new Date((session as any).user.createdAt as any).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "—"}
                      </p>
                    </div>

                    {/* Last Login */}
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          Last Login
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 ml-6">
                        {(session as any)?.user?.lastLogin
                          ? new Date((session as any).user.lastLogin as any).toLocaleString()
                          : "—"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Basic Information Card */}
            <div className="lg:col-span-2">
              <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {/* 👈 Updated icon circle background and icon color from blue to emerald */}
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <CardTitle className="text-gray-900 dark:text-gray-100">
                        Basic Information
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Update your personal account details
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={profile.fullName}
                          onChange={(e) =>
                            setProfile({ ...profile, fullName: e.target.value })
                          }
                          placeholder="Enter your full name"
                          // 👈 Updated ring focus color from blue-500 to emerald-500
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-gray-100 transition"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={profile.email}
                          disabled
                          className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400"
                        />
                      </div>
                    </div>

                    {/* Username */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={profile.username}
                          onChange={(e) =>
                            setProfile({ ...profile, username: e.target.value })
                          }
                          placeholder="username"
                          // 👈 Updated ring focus color from blue-500 to emerald-500
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-gray-100 transition"
                        />
                      </div>
                    </div>

                    {/* Save */}
                    <div className="flex items-center gap-3 pt-4">
                      <button
                        onClick={handleSaveProfile}
                        // 👈 Updated button background from blue-600/700 to emerald-600/700
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition shadow-lg hover:shadow-xl cursor-pointer"
                      >
                        <Save className="w-5 h-5" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <UserNav />
      </div>
    </div>
  );
}