"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/ui/user-sidebar";
import Header from "@/components/ui/user-header";
import UserNav from "@/components/ui/user-nav";
import { useSession } from "next-auth/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  Wallet,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

// Recent activity data state is declared inside the component below

// Notifications data is removed as it's no longer used

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [stats, setStats] = useState({
    balance: 0,
    totalInvested: 0,
    activeInvestmentsCount: 0,
    totalEarnings: 0,
    earningsToday: 0,
    referralEarnings: 0,
    referralCount: 0,
  });
  const [loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (status !== "authenticated") return;
      setLoadingStats(true);
      setStatsError(null);
      try {
        const res = await fetch("/api/user/stats");
        if (!res.ok) throw new Error("Failed to load stats");
        const data = await res.json();
        setStats({
          balance: Number(data.balance) || 0,
          totalInvested: Number(data.totalInvested) || 0,
          activeInvestmentsCount: Number(data.activeInvestmentsCount) || 0,
          totalEarnings: Number(data.totalEarnings) || 0,
          earningsToday: Number(data.earningsToday) || 0,
          referralEarnings: Number(data.referralEarnings) || 0,
          referralCount: Number(data.referralCount) || 0,
        });
      } catch (e: any) {
        setStatsError(e?.message || "Unable to load stats");
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [status]);

  // Show welcome bonus toast when redirected after registration
  useEffect(() => {
    const flag = searchParams?.get("welcome");
    if (flag === "1") {
      toast.success("You just earned $5 welcome bonus 🎉");
      // remove the query param to avoid repeated toasts
      const url = new URL(window.location.href);
      url.searchParams.delete("welcome");
      router.replace(url.pathname + (url.search ? `?${url.searchParams.toString()}` : ""));
    }
  }, [searchParams, router]);

  useEffect(() => {
    const fetchActivity = async () => {
      if (status !== "authenticated") return;
      setLoadingActivity(true);
      try {
        const res = await fetch("/api/user/activity", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        setRecentActivities(Array.isArray(data) ? data : []);
      } finally {
        setLoadingActivity(false);
      }
    };
    fetchActivity();
  }, [status]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-20 md:pb-8 mb-[50px] md:mb-0">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome back, {session?.user?.name || "Investor"}! 👋
            </h1>

            <p className="text-gray-600 dark:text-gray-400">
              Here's what's happening with your investments today
            </p>
          </div>


    {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {/* Active Investments */}
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader className="pb-2">
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Active Investments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {loadingStats
                        ? "Loading..."
                        : `$${stats.balance.toLocaleString()}`}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Across {loadingStats ? "-" : stats.activeInvestmentsCount}{" "}
                      {stats.activeInvestmentsCount === 1 ? "plan" : "plans"}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Earnings */}
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader className="pb-2">
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Total Earnings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {loadingStats
                        ? "Loading..."
                        : `$${stats.totalEarnings.toLocaleString()}`}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            
            {/* Total Invested */}
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader className="pb-2">
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Total Invested
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {loadingStats
                        ? "Loading..."
                        : `$${stats.totalInvested.toLocaleString()}`}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            

            {/* Referral Commissions */}
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader className="pb-2">
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Referral Commissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {loadingStats ? "Loading..." : `$${Number(stats.referralEarnings || 0).toLocaleString()}`}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {loadingStats ? "-" : `${stats.referralCount} active ${stats.referralCount === 1 ? "referral" : "referrals"}`}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity Section - Now spans full width on large screens */}
          {/* The grid layout is updated to span all columns */}
          <div className="grid grid-cols-1 gap-5">
            {/* Recent Activity (Now spans full width on all screens) */}
            <Card className="lg:col-span-1 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Your latest transactions and activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingActivity ? (
                  <div className="text-center py-10">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3 animate-spin" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      Loading Activity
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Fetching your latest transactions
                    </p>
                  </div>
                ) : recentActivities.length === 0 ? (
                  <div className="text-center py-10">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      No Recent Activity
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Your latest transactions will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivities.map((activity) => {
                      const isPayment = activity.kind === "payment";
                      const TitleIcon = isPayment ? DollarSign : Activity;
                      const when = activity.date
                        ? new Date(activity.date).toLocaleString()
                        : "";
                      const title = `${isPayment ? "Payment" : "Investment"} ${
                        activity.status
                      }`;
                      const subtitle = `${when} • ${activity.planName || ""}`;
                      const amount = Number(activity.amount || 0);
                      return (
                        <div
                          key={activity.id}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                        >
                          <div className="flex items-center gap-4">
<div className="hidden sm:flex w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center">
                              <TitleIcon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {title}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {subtitle}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            ${amount.toLocaleString()}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* The Notifications Card was here, but has been removed. */}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <UserNav />
      </div>
    </div>
  );
}
