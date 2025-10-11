"use client";

import React, { useState } from "react";
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
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Sample data for charts (kept for 'Monthly Earnings' chart)
const earningsData = [
  { month: "Jan", earnings: 320 },
  { month: "Feb", earnings: 450 },
  { month: "Mar", earnings: 380 },
  { month: "Apr", earnings: 620 },
  { month: "May", earnings: 890 },
  { month: "Jun", earnings: 1050 },
];

// Recent activity data (kept)
const recentActivities = [
  { id: 1, type: "Deposit", amount: 0, status: "Completed", date: "2025-10-05", icon: ArrowDownRight, color: "text-green-600" },
  { id: 2, type: "Investment", amount: 0, status: "Active", date: "2025-10-04", icon: TrendingUp, color: "text-blue-600" },
  { id: 3, type: "Withdrawal", amount: 0, status: "Pending", date: "2025-10-03", icon: ArrowUpRight, color: "text-orange-600" },
  { id: 4, type: "Referral Bonus", amount: 0, status: "Completed", date: "2025-10-02", icon: Users, color: "text-purple-600" },
  { id: 5, type: "ROI Payout", amount: 0, status: "Completed", date: "2025-10-01", icon: DollarSign, color: "text-emerald-600" },
];

// Notifications data is removed as it's no longer used

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, status } = useSession();

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
                      $0
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +0% this month
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

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
                      0
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Across 0 plans
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
                      $0
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      +0% ROI
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
                      $0
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      0 active referrals
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
          <div className="grid grid-cols-1 gap-6">
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
                <div className="space-y-4">
                  {recentActivities.map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${activity.color}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {activity.type}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {activity.date} • {activity.status}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          ${activity.amount.toLocaleString()}
                        </p>
                      </div>
                    );
                  })}
                </div>
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