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
          email: profile.email,
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
      toast.success("Settings saved successfully");
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
    <div className="flex h-screen overflow-hidden bg-gray-50/50 dark:bg-[#080d17] transition-colors duration-200">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-15 md:pb-8 mb-[50px] md:mb-0">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-1.5">
              Account Settings
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Manage your profile configuration parameters and verification security credentials
            </p>
          </div>

          {/* Master Responsive Container: Side-by-Side on LG/Big Screens, Stacked on Mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* Left Box: Profile Information */}
            <Card className="bg-white dark:bg-[#0f1623] border border-gray-200/80 dark:border-white/[0.06] shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 flex items-center justify-center rounded-xl text-blue-600 dark:text-blue-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-gray-900 dark:text-white">Profile Information</CardTitle>
                    <CardDescription className="text-xs text-gray-500 dark:text-slate-400">Update identity metrics and records</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-white/[0.06] rounded-xl bg-gray-50 dark:bg-white/[0.01] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-white/[0.06] rounded-xl bg-gray-50 dark:bg-white/[0.01] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">Username</label>
                    <input
                      type="text"
                      value={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-white/[0.06] rounded-xl bg-gray-50 dark:bg-white/[0.01] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>

                  {/* Wallets Nested Row Section */}
                  <div className="pt-4 border-t border-gray-100 dark:border-white/[0.06] space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 flex items-center gap-2 mb-1">
                      <Wallet className="w-3.5 h-3.5" />
                      Payout Settlement Wallets
                    </h3>
                    {["btc", "eth", "usdt", "bnb"].map((type) => (
                      <div key={type}>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-600 mb-1.5">
                          {type} Node Address
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
                          className="w-full px-3.5 py-3.5 text-xs font-mono border border-gray-200 dark:border-white/[0.06] rounded-xl bg-gray-50 dark:bg-white/[0.01] text-gray-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Button: full width on mobile, normal on desktop screens */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={loadingSave}
                      className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-all shadow-md shadow-blue-600/10 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      {loadingSave ? "Saving parameters..." : "Save Config Profile"}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Box: Security Settings */}
            <Card className="bg-white dark:bg-[#0f1623] border border-gray-200/80 dark:border-white/[0.06] shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/10 flex items-center justify-center rounded-xl text-emerald-600 dark:text-emerald-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold text-gray-900 dark:text-white">Security Loop & Protection</CardTitle>
                    <CardDescription className="text-xs text-gray-500 dark:text-slate-400">Re-evaluate password arrays and secure tokens</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-white/[0.06] rounded-xl bg-gray-50 dark:bg-white/[0.01] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 px-3.5 flex items-center text-gray-400 dark:text-slate-500 hover:text-gray-600 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">New Password String</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-white/[0.06] rounded-xl bg-gray-50 dark:bg-white/[0.01] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 px-3.5 flex items-center text-gray-400 dark:text-slate-500 hover:text-gray-600 transition-colors cursor-pointer"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 dark:border-white/[0.06] rounded-xl bg-gray-50 dark:bg-white/[0.01] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    />
                  </div>

                  {/* Button: full width on mobile, normal on desktop screens */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleUpdatePassword}
                      disabled={loadingPassword}
                      className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
                    >
                      <Lock className="w-4 h-4" />
                      {loadingPassword ? "Overwriting array..." : "Update Vault Password"}
                    </button>
                  </div>

                  {/* 2FA Toggle Row block */}
                  <div className="pt-5 border-t border-gray-100 dark:border-white/[0.06]">
                    <div className="flex items-center justify-between gap-4 p-3.5 bg-gray-50/50 dark:bg-white/[0.01] border border-gray-200 dark:border-white/[0.04] rounded-2xl">
                      <div>
                        <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-0.5">Two-Factor Authenticator Loop</h3>
                        <p className="text-[11px] text-gray-400 dark:text-slate-500">Require automated security dynamic passes upon entry triggers</p>
                      </div>
                      
                      <label className="relative inline-flex items-center cursor-pointer shrink-0 select-none">
                        <input
                          type="checkbox"
                          checked={show2FAEnabled}
                          onChange={toggleTwoFA}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-5.5 rounded-full transition-colors bg-gray-200 dark:bg-white/[0.08] peer-checked:bg-emerald-500 relative after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white dark:after:bg-slate-200 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4.5 shadow-inner" />
                      </label>
                    </div>

                    {show2FAEnabled && (
                      <div className="mt-3 p-3.5 bg-blue-500/[0.02] border border-blue-500/10 rounded-xl">
                        <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium flex items-start gap-2 leading-relaxed">
                          <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                          Dual layers initialized. Ensure your personal authenticator device engine app is correctly synced to decrypt tokens next access sequence.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </main>

        <UserNav />
      </div>
    </div>
  );
}