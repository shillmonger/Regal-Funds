"use client";

import React, { useState, useMemo, useEffect } from "react";
import { DollarSign, Filter, Check, X, LineChart } from "lucide-react";
import AdminHeader from "@/components/ui/admin-header";
import AdminSidebar from "@/components/ui/admin-sidebar";
import AdminNav from "@/components/ui/admin-nav";

// Helpers
const getStatusClasses = (status: string) => {
  switch (status) {
    case "Paid":
    case "Approved":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "Rejected":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Paid":
    case "Approved":
      return <Check className="w-4 h-4 mr-1" />;
    case "Rejected":
      return <X className="w-4 h-4 mr-1" />;
    default:
      return <LineChart className="w-4 h-4 mr-1" />;
  }
};

export default function AdminInvestmentPayoutsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [payouts, setPayouts] = useState<any[]>([]); // 🟢 Loaded from API
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  const filteredPayouts = useMemo(() => {
    return payouts.filter((p) => {
      const statusMatch = statusFilter === "All" || p.status === statusFilter;
      const planMatch = planFilter === "All" || !p.plan || p.plan === planFilter;
      return statusMatch && planMatch;
    });
  }, [statusFilter, planFilter, payouts]);

  const reload = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/withdrawals", { cache: "no-store" });
      if (!res.ok) return;
      const list = await res.json();
      setPayouts(Array.isArray(list) ? list : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const handleAction = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/withdrawals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) return;
      await reload();
    } catch {}
  };

  const summary = useMemo(() => {
    const total = payouts.length;
    const paid = payouts.filter((p) => p.status === "Approved").length;
    const pending = payouts.filter((p) => p.status === "Pending").length;
    const rejected = payouts.filter((p) => p.status === "Rejected").length;
    return { total, paid, pending, rejected };
  }, [payouts]);

  const plans = ["All", ...Array.from(new Set(payouts.map((p) => p.plan).filter(Boolean)))];
  const statuses = ["All", "Pending", "Approved", "Rejected"];

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
              Investment Payouts 💰
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage profit payouts and investor disbursements.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow border border-gray-200 dark:border-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Records</p>
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Rejected</p>
              <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400">
                {summary.rejected}
              </h2>
            </div>
          </div>

          {/* Payout Table */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                All Investment Payouts
              </h2>
              <DollarSign className="w-6 h-6 text-[#72a210]" />
            </div>

            {/* Table Header */}
            <div className="hidden lg:grid grid-cols-8 gap-4 border-b border-gray-200 dark:border-gray-700 pb-2 mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
              <div>Investor</div>
              {/* <div>Plan</div> */}
              <div>Investment</div>
              <div>Wallet</div>
              <div>Status</div>
              <div>Date</div>
              <div>Type</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Table Rows */}
            {loading ? (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">Loading...</div>
            ) : filteredPayouts.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-1 gap-3 lg:grid-cols-8 lg:gap-4 lg:items-center border-b border-gray-100 dark:border-gray-800 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="font-medium text-gray-900 dark:text-gray-100">
                  <div>{p.userName || p.userEmail}</div>
                  <div className="text-xs text-gray-500">{p.userEmail}</div>
                </div>
                {/* <div className="text-sm text-gray-600 dark:text-gray-400">
                  {p.planName || p.plan || "N/A"}
                </div> */}
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  ${p.amount?.toLocaleString() || '0'}
                </div>
                <div className="text-sm break-all">
                  <div className="font-medium">{p.walletAddress || 'N/A'}</div>
                  <div className="text-xs text-gray-500">{p.crypto || ''}</div>
                </div>
                <div>
                  <div
                    className={`flex items-center px-3 py-1 text-xs font-medium rounded-full ${getStatusClasses(
                      p.status
                    )}`}
                  >
                    {getStatusIcon(p.status)}
                    {p.status}
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {p.requestedAt ? new Date(p.requestedAt).toLocaleDateString() : ""}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {p.type === 'first_roi' ? 'First ROI' : 'Regular'}
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleAction(p.id, "Approved")}
                    disabled={p.status === "Approved"}
                    className="px-3 py-1.5 bg-[#72a210] text-white rounded-md text-sm font-medium hover:bg-[#507800] transition disabled:opacity-50"
                  >
                    <Check className="w-4 h-4 inline mr-1" /> Mark Paid
                  </button>
                  <button
                    onClick={() => handleAction(p.id, "Rejected")}
                    disabled={p.status === "Rejected"}
                    className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
                  >
                    <X className="w-4 h-4 inline mr-1" /> Reject
                  </button>
                </div>
              </div>
            ))}

            {/* Empty State */}
            {!loading && filteredPayouts.length === 0 && (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                No payout records found.
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
