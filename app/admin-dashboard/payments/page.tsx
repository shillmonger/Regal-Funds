"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Activity, Check, X, Clock, DollarSign } from "lucide-react";
import AdminHeader from "@/components/ui/admin-header";
import AdminSidebar from "@/components/ui/admin-sidebar";
import AdminNav from "@/components/ui/admin-nav";

// Helpers
const getStatusClasses = (status: string) => {
  switch (status) {
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
    case "Approved":
      return <Check className="w-4 h-4 mr-1" />;
    case "Rejected":
      return <X className="w-4 h-4 mr-1" />;
    default:
      return <Clock className="w-4 h-4 mr-1" />;
  }
};

export default function AdminPaymentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPayments = useCallback(async () => {
    setError(null);
    try {
      setLoading(true);
      const res = await fetch("/api/payments", { cache: "no-store" });
      if (!res.ok) {
        setPayments([]);
        setError("Failed to load payments");
        return;
      }
      const data = await res.json();
      const mapped = (data as any[]).map((p) => ({
        id: p.id,
        userName: p.userName || "",
        user: p.userEmail || "",
        amount: p.amount,
        plan: p.planName,
        date: p.createdAt ? new Date(p.createdAt).toLocaleString() : "",
        status: p.status || "Pending",
      }));
      setPayments(mapped);
    } catch (e: any) {
      setPayments([]);
      setError(e?.message || "Unable to load payments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await loadPayments();
    })();
    return () => {
      mounted = false;
    };
  }, [loadPayments]);

  const handleAction = useCallback(async (id: string, newStatus: string) => {
    setError(null);
    try {
      setLoading(true);
      const res = await fetch(`/api/payments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        setError(msg?.error || `Failed to update status (${res.status})`);
        return;
      }
      // refresh from server to reflect accurate status
      await loadPayments();
    } catch (e: any) {
      setError(e?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  }, [loadPayments]);

  const StatusPill = ({ status }: { status: string }) => (
    <div
      className={`flex items-center px-3 py-1 text-xs font-medium rounded-full ${getStatusClasses(
        status
      )}`}
    >
      {getStatusIcon(status)}
      {status}
    </div>
  );

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
              Payments Review 💸
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Review and manage all user payment submissions.
            </p>
          </div>

          {/* Payments Table */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                All Payment Submissions
              </h2>
              <DollarSign className="w-6 h-6 text-[#72a210]" />
            </div>

            {/* Table Header */}
            <div className="hidden lg:grid grid-cols-6 gap-4 border-b border-gray-200 dark:border-gray-700 pb-2 mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
              <div>User</div>
              <div>Amount</div>
              <div>Plan</div>
              <div>Date</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-6 text-[#72a210]">
                <Activity className="w-5 h-5 animate-spin mr-2" />
                Loading payments...
              </div>
            )}

            {/* Empty State */}
            {!loading && payments.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500 dark:text-gray-400">
                <DollarSign className="w-10 h-10 mb-3 text-[#72a210]" />
                <p className="text-lg font-medium">No payments found</p>
                <p className="text-sm">Once users make payments, they’ll appear here.</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="my-3 text-sm text-red-600 dark:text-red-400">{error}</div>
            )}

            {/* Table Body */}
            {!loading &&
              payments.length > 0 &&
              payments.map((payment) => (
                <div
                  key={payment.id}
                  className="grid grid-cols-1 gap-3 lg:grid-cols-6 lg:gap-4 lg:items-center border-b border-gray-100 dark:border-gray-800 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {/* User Info */}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {payment.userName}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {payment.user}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    ${payment.amount.toLocaleString()}
                  </div>

                  {/* Plan */}
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {payment.plan}
                  </div>

                  {/* Date */}
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {payment.date}
                  </div>

                  {/* Status */}
                  <div>
                    <StatusPill status={payment.status} />
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 justify-end">
                    {payment.status === "Pending" ? (
                      <>
                        <button
                          onClick={() => handleAction(payment.id, "Approved")}
                          className="px-3 py-1.5 bg-[#72a210] text-white rounded-md text-sm font-medium hover:bg-[#507800] transition disabled:opacity-50"
                          disabled={loading}
                        >
                          <Check className="w-4 h-4 inline mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(payment.id, "Rejected")}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
                          disabled={loading}
                        >
                          <X className="w-4 h-4 inline mr-1" />
                          Reject
                        </button>
                      </>
                    ) : (
                      <div className="text-sm text-gray-500 dark:text-gray-400">No actions</div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <AdminNav />
      </div>
    </div>
  );
}
