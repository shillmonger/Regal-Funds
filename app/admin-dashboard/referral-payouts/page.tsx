"use client";

import React, { useState, useMemo } from "react";
import { Gift, DollarSign, FileDown, Check, Clock, Users } from "lucide-react";
import AdminHeader from "@/components/ui/admin-header";
import AdminSidebar from "@/components/ui/admin-sidebar";
import AdminNav from "@/components/ui/admin-nav";

// Helpers
const getStatusClasses = (status: string) => {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "Pending":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Paid":
      return <Check className="w-4 h-4 mr-1" />;
    case "Pending":
      return <Clock className="w-4 h-4 mr-1" />;
    default:
      return null;
  }
};

export default function AdminReferralPayoutsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [referrals, setReferrals] = useState<any[]>([]); // 🟢 Empty initially
  const [search, setSearch] = useState("");

  const filteredReferrals = useMemo(() => {
    return referrals.filter(
      (r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, referrals]);

  const handlePayout = (id: number) => {
    setReferrals((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Paid" } : r))
    );
  };

  const handleExport = (format: "csv" | "xlsx") => {
    const headers = ["Name", "Email", "Referred Users", "Total Earned", "Status"];
    const rows = referrals.map((r) => [r.name, r.email, r.referred, `$${r.earned}`, r.status]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `referral-payouts.${format}`;
    link.click();
  };

  const summary = useMemo(() => {
    const total = referrals.length;
    const pending = referrals.filter((r) => r.status === "Pending").length;
    const paid = referrals.filter((r) => r.status === "Paid").length;
    const totalEarned = referrals.reduce((acc, r) => acc + (r.earned || 0), 0);
    return { total, pending, paid, totalEarned };
  }, [referrals]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 font-inter">
      {/* Sidebar */}
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        {/* Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-20 md:pb-8 mb-[50px] md:mb-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              Referral Payouts 🎁
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and track all affiliate and referral payouts.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow border border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Referrals</p>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {summary.total}
              </h2>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow border border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
              <h2 className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">
                {summary.pending}
              </h2>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow border border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Paid</p>
              <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400">
                {summary.paid}
              </h2>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow border border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Earned</p>
              <h2 className="text-2xl font-semibold text-[#72a210]">
                ${summary.totalEarned.toLocaleString()}
              </h2>
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="relative w-full md:w-1/2">
              <Gift className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search referrers by name or email..."
                className="pl-9 pr-3 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-[#72a210] outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Referral Table */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                All Referral Payouts
              </h2>
              <DollarSign className="w-6 h-6 text-[#72a210]" />
            </div>

            {/* Table Header */}
            <div className="hidden lg:grid grid-cols-6 gap-4 border-b border-gray-200 dark:border-gray-700 pb-2 mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
              <div>Referrer</div>
              <div>Email</div>
              <div>Referred Users</div>
              <div>Total Earned</div>
              <div>Status</div>
              <div className="text-right">Action</div>
            </div>

            {/* Table Rows */}
            {filteredReferrals.map((r) => (
              <div
                key={r.id}
                className="grid grid-cols-1 gap-3 lg:grid-cols-6 lg:gap-4 lg:items-center border-b border-gray-100 dark:border-gray-800 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">{r.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{r.email}</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">{r.referred}</div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  ${r.earned.toLocaleString()}
                </div>
                <div>
                  <div
                    className={`flex items-center px-3 py-1 text-xs font-medium rounded-full ${getStatusClasses(
                      r.status
                    )}`}
                  >
                    {getStatusIcon(r.status)}
                    {r.status}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => handlePayout(r.id)}
                    disabled={r.status === "Paid"}
                    className="px-3 py-1.5 bg-[#72a210] text-white rounded-md text-sm font-medium hover:bg-[#507800] transition disabled:opacity-50"
                  >
                    Mark as Paid
                  </button>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {filteredReferrals.length === 0 && (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                No referral records found.
              </div>
            )}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <AdminNav />
      </div>
    </div>
  );
}
