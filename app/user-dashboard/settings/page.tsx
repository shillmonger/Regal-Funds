"use client";

import React, { useEffect, useState } from "react";
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
  Wallet,
  Lock,
  Shield,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function AccountSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [show2FAEnabled, setShow2FAEnabled] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Form inputs for password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Profile state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    username: "",
    btcWallet: "",
    ethWallet: "",
    usdtWallet: "",
    bnbWallet: "",
  });

  // Load user profile
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/users/me", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load settings");
        if (!active) return;
        const wallets = (data.wallets || {}) as Record<string, string>;
        setProfile({
          name: data.name || "",
          email: data.email || "",
          username: data.username || "",
          btcWallet: wallets.btc || "",
          ethWallet: wallets.eth || "",
          usdtWallet: wallets.usdt || "",
          bnbWallet: wallets.bnb || "",
        });
        setShow2FAEnabled(!!data.twoFactorEnabled);
      } catch (e: any) {
        toast.error(e.message || "Could not load account settings");
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Save profile (name, email, username, wallets)
  const handleSaveProfile = async () => {
    try {
      setLoadingSave(true);
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: profile.name,
          username: profile.username,
          email: profile.email, // ✅ Fix: include email
        }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Failed to update profile");
      }

      const walletEntries: Array<[string, string]> = [
        ["btc", profile.btcWallet],
        ["eth", profile.ethWallet],
        ["usdt", profile.usdtWallet],
        ["bnb", profile.bnbWallet],
      ];
      for (const [type, address] of walletEntries) {
        if (address && address.trim()) {
          const w = await fetch("/api/users/wallet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type, address: address.trim() }),
          });
          if (!w.ok) {
            const jj = await w.json();
            throw new Error(jj.error || `Failed saving ${type.toUpperCase()} wallet`);
          }
        }
      }
      toast.success("Settings saved");
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    } finally {
      setLoadingSave(false);
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setLoadingPassword(true);
      const res = await fetch("/api/users/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Failed to update password");
      }
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      toast.error(e.message || "Password update failed");
    } finally {
      setLoadingPassword(false);
    }
  };

  // Toggle 2FA
  const toggleTwoFA = async () => {
    try {
      const next = !show2FAEnabled;
      setShow2FAEnabled(next);
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ twoFactorEnabled: next }),
      });
      if (!res.ok) {
        setShow2FAEnabled(!next);
        const j = await res.json();
        throw new Error(j.error || "Failed updating 2FA");
      }
      toast.success(`Two-Factor Authentication ${next ? "enabled" : "disabled"}`);
    } catch (e: any) {
      toast.error(e.message || "Update failed");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-20 md:pb-8 mb-[50px] md:mb-0">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Account Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your profile and security settings
            </p>
          </div>

          {/* Profile Information */}
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800"
                  />
                </div>

                {/* Wallets */}
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Crypto Wallet Addresses
                  </h3>
                  {["btc", "eth", "usdt", "bnb"].map((type) => (
                    <div key={type}>
                      <label className="block text-xs font-medium mb-1 uppercase">
                        {type}
                      </label>
                      <input
                        type="text"
                        value={profile[`${type}Wallet` as keyof typeof profile]}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            [`${type}Wallet`]: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800"
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleSaveProfile}
                  disabled={loadingSave}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  <Save className="w-4 h-4" />
                  {loadingSave ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          {/* Security Settings */}
<Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
  <CardHeader>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
        <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>Change your password and manage 2FA</CardDescription>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {/* Current Password */}
      <div>
        <label className="block text-sm font-medium mb-1">Current Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* New Password */}
      <div>
        <label className="block text-sm font-medium mb-1">New Password</label>
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
          >
            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium mb-1">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800"
        />
      </div>

      {/* Update Password Button */}
      <button
        onClick={handleUpdatePassword}
        disabled={loadingPassword}
        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition"
      >
        <Lock className="w-4 h-4" />
        {loadingPassword ? "Updating..." : "Update Password"}
      </button>

      {/* 2FA Toggle */}
      <div className="pt-4 border-t">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Two-Factor Authentication</h3>
         <label className="relative inline-flex items-center cursor-pointer">
  <input
    type="checkbox"
    checked={show2FAEnabled}
    onChange={toggleTwoFA}
    className="sr-only peer"
  />
  <div
    className="
      w-11 h-6 
      rounded-full 
      transition-colors 
      bg-gray-300 dark:bg-gray-700 
      peer-checked:bg-emerald-500
    "
  ></div>

  {/* Circle */}
  <span
    className="
      absolute left-0.5 top-0.5 
      w-5 h-5 
      bg-white 
      rounded-full 
      transition-all 
      peer-checked:translate-x-5 
      shadow-md
    "
  ></span>
</label>

        </div>
        {show2FAEnabled && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              2FA is now enabled. Use your authenticator app when logging in.
            </p>
          </div>
        )}
      </div>
    </div>
  </CardContent>
</Card>

        </main>

        <UserNav />
      </div>
    </div>
  );
}
