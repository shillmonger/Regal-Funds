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
  Bell,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  History,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

// Fallback login history (used if none from DB)
const fallbackLoginHistory = [
  { id: 1, device: "Chrome on Windows", location: "Lagos, Nigeria", date: "2025-10-06 09:30 AM", status: "success" },
];

export default function AccountSettings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [show2FAEnabled, setShow2FAEnabled] = useState(false);
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loginHistory, setLoginHistory] = useState<any[]>([]);
  
  // Notification settings state
  const [notifications, setNotifications] = useState({
    withdrawals: true,
    referrals: true,
    adminMessages: true,
    deposits: false,
    loginAlerts: true,
  });

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

  // Load user profile from API
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
        setLoginAlertsEnabled(!!data.loginAlertsEnabled);
        setLoginHistory(Array.isArray(data.loginHistory) ? data.loginHistory : fallbackLoginHistory);
      } catch (e: any) {
        toast.error(e.message || "Could not load account settings");
        setLoginHistory(fallbackLoginHistory);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Save profile (name, email, username and wallets)
  const handleSaveProfile = async () => {
    try {
      setLoadingSave(true);
      // Save name + username
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: profile.name, username: profile.username }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.error || "Failed to update profile");
      }
      // Save wallets present
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

  // Toggle 2FA and login alerts
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

  const toggleLoginAlerts = async () => {
    try {
      const next = !loginAlertsEnabled;
      setLoginAlertsEnabled(next);
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginAlertsEnabled: next }),
      });
      if (!res.ok) {
        setLoginAlertsEnabled(!next);
        const j = await res.json();
        throw new Error(j.error || "Failed updating login alerts");
      }
      toast.success(`Login alerts ${next ? "enabled" : "disabled"}`);
    } catch (e: any) {
      toast.error(e.message || "Update failed");
    }
  };

  type NotificationKey = "withdrawals" | "referrals" | "adminMessages" | "deposits" | "loginAlerts";
  const handleNotificationToggle = (key: NotificationKey) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Settings Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-20 md:pb-8 mb-[50px] md:mb-0">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Account Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your profile, security, and preferences
            </p>
          </div>

          {/* Profile Information Section */}
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-gray-900 dark:text-gray-100">
                    Profile Information
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Update your personal details
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
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
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                {/* Username (replaces Phone Number) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={profile.username}
                      onChange={(e) => setProfile({...profile, username: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                {/* Crypto Wallets */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Crypto Wallet Addresses
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Bitcoin (BTC)
                      </label>
                      <input
                        type="text"
                        value={profile.btcWallet}
                        onChange={(e) => setProfile({...profile, btcWallet: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Ethereum (ETH)
                      </label>
                      <input
                        type="text"
                        value={profile.ethWallet}
                        onChange={(e) => setProfile({...profile, ethWallet: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        USDT (TRC20)
                      </label>
                      <input
                        type="text"
                        value={profile.usdtWallet}
                        onChange={(e) => setProfile({...profile, usdtWallet: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        BNB (BEP20)
                      </label>
                      <input
                        type="text"
                        value={profile.bnbWallet}
                        onChange={(e) => setProfile({...profile, bnbWallet: e.target.value})}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button onClick={handleSaveProfile} disabled={loadingSave} className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition cursor-pointer">
                  <Save className="w-4 h-4" />
                  {loadingSave ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings Section */}
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-gray-900 dark:text-gray-100">
                    Security Settings
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Manage password and two-factor authentication
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Change Password */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Change Password
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter current password"
                          className="w-full pl-10 pr-12 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          className="w-full pl-10 pr-12 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                        />
                        <button
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="password"
                          placeholder="Confirm new password"
                          className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    </div>

                    <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition">
                      Update Password
                    </button>
                  </div>
                </div>

                {/* 2FA Toggle */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          Two-Factor Authentication
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={show2FAEnabled}
                        onChange={toggleTwoFA}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  {show2FAEnabled && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        2FA is now enabled. Use your authenticator app to generate codes when logging in.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Login History */}
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <History className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-gray-900 dark:text-gray-100">
                    Login History
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Recent login attempts to your account
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loginHistory.map((login) => (
                  <div
                    key={login.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                        {login.device}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {login.location} • {login.date}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        login.status === "success"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {login.status === "success" ? "Success" : "Failed"}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-gray-900 dark:text-gray-100">
                    Notification Settings
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Choose what notifications you want to receive
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Withdrawal Alerts */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      Withdrawal Alerts
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Get notified when you make a withdrawal
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.withdrawals}
                      onChange={() => handleNotificationToggle('withdrawals')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Referral Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      Referral Notifications
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Get notified about new referrals and commissions
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.referrals}
                      onChange={() => handleNotificationToggle('referrals')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Admin Messages */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      Admin Messages
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Receive important messages from administrators
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.adminMessages}
                      onChange={() => handleNotificationToggle('adminMessages')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Deposit Notifications */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      Deposit Notifications
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Get notified when deposits are confirmed
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.deposits}
                      onChange={() => handleNotificationToggle('deposits')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Login Alerts */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      Login Alerts
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Get notified of new login attempts
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={loginAlertsEnabled}
                      onChange={toggleLoginAlerts}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Management - Danger Zone */}
          <Card className="bg-white dark:bg-gray-900 border-red-200 dark:border-red-900/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-red-900 dark:text-red-100">
                    Danger Zone
                  </CardTitle>
                  <CardDescription className="text-red-600 dark:text-red-400">
                    Irreversible account actions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-800 dark:text-red-300 flex items-start gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    Warning: These actions cannot be undone. Please be certain before proceeding.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
                      <XCircle className="w-4 h-4" />
                      Close Account
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </main>

        {/* Mobile Bottom Navigation */}
        <UserNav />
      </div>
    </div>
  );
}