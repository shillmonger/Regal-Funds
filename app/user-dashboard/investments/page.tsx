"use client";

import React, { useState } from "react";
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
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle,
  Calendar,
  RefreshCw,
  ArrowUpRight,
  AlertCircle,
  Activity,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample investments data
const activeInvestments = [
  {
    id: 1,
    planName: "Gold Plan",
    investedAmount: 5000,
    roi: 40,
    duration: 21,
    startDate: "2025-09-20",
    expiryDate: "2025-10-11",
    daysRemaining: 5,
    expectedEarnings: 2000,
    currentEarnings: 1428,
    status: "active",
    progress: 71,
  },
  {
    id: 2,
    planName: "Silver Plan",
    investedAmount: 2000,
    roi: 25,
    duration: 14,
    startDate: "2025-09-25",
    expiryDate: "2025-10-09",
    daysRemaining: 3,
    expectedEarnings: 500,
    currentEarnings: 393,
    status: "active",
    progress: 79,
  },
  {
    id: 3,
    planName: "Platinum Plan",
    investedAmount: 15000,
    roi: 60,
    duration: 30,
    startDate: "2025-10-01",
    expiryDate: "2025-10-31",
    daysRemaining: 25,
    expectedEarnings: 9000,
    currentEarnings: 1500,
    status: "active",
    progress: 17,
  },
];

const completedInvestments = [
  {
    id: 4,
    planName: "Starter Plan",
    investedAmount: 500,
    roi: 15,
    duration: 7,
    startDate: "2025-08-25",
    expiryDate: "2025-09-01",
    expectedEarnings: 75,
    actualEarnings: 75,
    status: "completed",
    completedDate: "2025-09-01",
  },
  {
    id: 5,
    planName: "Silver Plan",
    investedAmount: 3000,
    roi: 25,
    duration: 14,
    startDate: "2025-08-15",
    expiryDate: "2025-08-29",
    expectedEarnings: 750,
    actualEarnings: 750,
    status: "completed",
    completedDate: "2025-08-29",
  },
  {
    id: 6,
    planName: "Gold Plan",
    investedAmount: 7000,
    roi: 40,
    duration: 21,
    startDate: "2025-07-20",
    expiryDate: "2025-08-10",
    expectedEarnings: 2800,
    actualEarnings: 2800,
    status: "completed",
    completedDate: "2025-08-10",
  },
];

export default function MyInvestmentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active"); // 'active' or 'completed'

  // Calculate totals
  const totalActive = activeInvestments.reduce((sum, inv) => sum + inv.investedAmount, 0);
  const totalExpectedEarnings = activeInvestments.reduce((sum, inv) => sum + inv.expectedEarnings, 0);
  const totalCurrentEarnings = activeInvestments.reduce((sum, inv) => sum + inv.currentEarnings, 0);
  const totalCompleted = completedInvestments.reduce((sum, inv) => sum + inv.actualEarnings, 0);

// Format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Calculate days elapsed
const calculateDaysElapsed = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  return Math.min(elapsedDays, totalDays);
};


  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Investments Content */}
<main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-20 md:pb-8 mb-[50px] md:mb-0">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              My Investments
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Track and manage all your investment plans
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-8 h-8 opacity-80" />
                  <span className="text-xs bg-blue-400/30 px-2 py-1 rounded-full">
                    {activeInvestments.length} Active
                  </span>
                </div>
                <p className="text-blue-100 text-sm mb-1">Total Active Investment</p>
                <p className="text-2xl md:text-3xl font-bold">${totalActive.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-8 h-8 opacity-80" />
                </div>
                <p className="text-emerald-100 text-sm mb-1">Expected Earnings</p>
                <p className="text-2xl md:text-3xl font-bold">${totalExpectedEarnings.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-8 h-8 opacity-80" />
                </div>
                <p className="text-purple-100 text-sm mb-1">Current Earnings</p>
                <p className="text-2xl md:text-3xl font-bold">${totalCurrentEarnings.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Award className="w-8 h-8 opacity-80" />
                  <span className="text-xs bg-orange-400/30 px-2 py-1 rounded-full">
                    {completedInvestments.length} Plans
                  </span>
                </div>
                <p className="text-orange-100 text-sm mb-1">Total Completed</p>
                <p className="text-2xl md:text-3xl font-bold">${totalCompleted.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab("active")}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                activeTab === "active"
                  ? "bg-emerald-500 text-white"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              Active Investments ({activeInvestments.length})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-6 py-3 rounded-lg font-medium transition ${
                activeTab === "completed"
                  ? "bg-emerald-500 text-white"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              Completed ({completedInvestments.length})
            </button>
          </div>

          {/* Active Investments */}
          {activeTab === "active" && (
            <div className="space-y-6">
              {activeInvestments.length === 0 ? (
                <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                  <CardContent className="p-12 text-center">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      No Active Investments
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Start investing today to grow your wealth
                    </p>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6">
                      Browse Investment Plans
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                activeInvestments.map((investment) => (
                  <Card key={investment.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left Section - Plan Info */}
                        <div className="lg:col-span-4 space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {investment.planName}
                              </h3>
                              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                                Active
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Investment ID: #{investment.id.toString().padStart(6, '0')}
                            </p>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Invested Amount</span>
                              <span className="font-bold text-gray-900 dark:text-gray-100">
                                ${investment.investedAmount.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <span className="text-sm text-gray-600 dark:text-gray-400">ROI Rate</span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                {investment.roi}%
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
                              <span className="font-bold text-gray-900 dark:text-gray-100">
                                {investment.duration} Days
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Middle Section - Progress & Earnings */}
                        <div className="lg:col-span-5 space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Progress
                              </span>
                              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                {investment.progress}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full transition-all duration-500"
                                style={{ width: `${investment.progress}%` }}
                              ></div>
                            </div>
                            <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                              <span>Day {calculateDaysElapsed(investment.startDate, investment.expiryDate)}/{investment.duration}</span>
                              <span>{investment.daysRemaining} days remaining</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                              <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Expected Earnings</p>
                              <p className="text-xl font-bold text-blue-700 dark:text-blue-300">
                                ${investment.expectedEarnings.toLocaleString()}
                              </p>
                            </div>
                            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                              <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Current Earnings</p>
                              <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
                                ${investment.currentEarnings.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <div className="flex-1 text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                {formatDate(investment.startDate)} → {formatDate(investment.expiryDate)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right Section - Actions */}
                        <div className="lg:col-span-3 flex flex-col justify-between gap-3">
                          <div className="space-y-2">
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3">
                              <ArrowUpRight className="w-4 h-4 mr-2" />
                              Upgrade Plan
                            </Button>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Renew Plan
                            </Button>
                            <Button className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-3">
                              View Details
                            </Button>
                          </div>

                          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <div className="flex items-start gap-2">
                              <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                                Expires in {investment.daysRemaining} days
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Completed Investments */}
          {activeTab === "completed" && (
            <div className="space-y-4">
              {completedInvestments.length === 0 ? (
                <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                  <CardContent className="p-12 text-center">
                    <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      No Completed Investments
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Your matured investments will appear here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                completedInvestments.map((investment) => (
                  <Card key={investment.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        {/* Plan Info */}
                        <div className="md:col-span-3">
                          <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                              {investment.planName}
                            </h3>
                          </div>
                          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                            Completed
                          </span>
                        </div>

                        {/* Investment Details */}
                        <div className="md:col-span-5 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Invested Amount</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              ${investment.investedAmount.toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">ROI Rate</p>
                            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                              {investment.roi}%
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Duration</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                              {investment.duration} Days
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Earnings</p>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">
                              ${investment.actualEarnings.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Dates & Actions */}
                        <div className="md:col-span-4 space-y-3">
                          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Completion Date</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {formatDate(investment.completedDate)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm py-2">
                              <RefreshCw className="w-4 h-4 mr-1" />
                              Reinvest
                            </Button>
                            <Button className="flex-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm py-2">
                              Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </main>

        {/* Mobile Bottom Navigation */}
        <UserNav />
      </div>
    </div>
  );
}