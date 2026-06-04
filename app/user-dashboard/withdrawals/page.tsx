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
  Wallet,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Info,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type WithdrawalStatus = "Pending" | "Approved" | "Rejected";

interface Withdrawal {
  id: string;
  amount: number;
  walletAddress: string;
  crypto: string;
  requestedAt: string;
  status: WithdrawalStatus;
  approvedAt?: string | null;
  txHash?: string | null;
  adminNote?: string | null;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/20",
    border: "border-amber-200/60 dark:border-amber-900/30",
    badge: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
    label: "Pending",
  },
  paid: {
    icon: CheckCircle,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    border: "border-emerald-200/60 dark:border-emerald-900/30",
    badge: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
    label: "Paid",
  },
  declined: {
    icon: XCircle,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950/20",
    border: "border-rose-200/60 dark:border-rose-900/30",
    badge: "bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300",
    label: "Declined",
  },
};

const cryptoOptions = [
  { name: "Bitcoin (BTC)", network: "Bitcoin Network" },
  { name: "Ethereum (ETH)", network: "ERC-20" },
  { name: "Tether (USDT)", network: "TRC-20 / ERC-20" },
  { name: "BNB", network: "BEP-20" },
];

export default function WithdrawalsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState(0);
  const [filterStatus, setFilterStatus] = useState("all");
  const [copiedAddress, setCopiedAddress] = useState<string | number | null>(null);
  const [history, setHistory] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(false);
  const [eligible, setEligible] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [minimumWithdrawal, setMinimumWithdrawal] = useState(50);
  const [userWallets, setUserWallets] = useState<Record<string, string>>({});

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [eligRes, listRes] = await Promise.all([
          fetch("/api/withdrawals/eligibility", { cache: "no-store" }),
          fetch("/api/withdrawals", { cache: "no-store" }),
          fetch("/api/users/me", { cache: "no-store" }),
        ]);
        if (eligRes.ok) {
          const e = await eligRes.json();
          setEligible(Boolean(e.eligible));
          setAvailableBalance(Number(e.balance) || 0);
          if (e.minimumWithdrawal) setMinimumWithdrawal(Number(e.minimumWithdrawal));
        }
        if (listRes.ok) {
          const list = await listRes.json();
          const mapped: Withdrawal[] = (list || []).map((w: any) => ({
            id: w.id,
            amount: Number(w.amount) || 0,
            walletAddress: String(w.walletAddress || ""),
            crypto: String(w.crypto || ""),
            requestedAt: w.requestedAt || w.requestDate || new Date().toISOString(),
            status: (w.status as WithdrawalStatus) || "Pending",
            approvedAt: w.approvedAt ?? null,
            txHash: w.txHash ?? null,
            adminNote: w.adminNote ?? null,
          }));
          setHistory(mapped);
        }
      } catch {
        // Fallback context handling
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadMe = async () => {
      try {
        const res = await fetch("/api/users/me", { cache: "no-store" });
        if (!res.ok) return;
        const me = await res.json();
        const wallets = (me?.wallets as Record<string, string>) || {};
        setUserWallets(wallets);
        const key = selectedCrypto === 0 ? "btc" : selectedCrypto === 1 ? "eth" : selectedCrypto === 2 ? "usdt" : "bnb";
        if (wallets[key]) setWalletAddress(wallets[key]);
      } catch {}
    };
    loadMe();
  }, []);

  useEffect(() => {
    const key = selectedCrypto === 0 ? "btc" : selectedCrypto === 1 ? "eth" : selectedCrypto === 2 ? "usdt" : "bnb";
    const addr = userWallets[key];
    if (addr) {
      setWalletAddress(addr);
    } else {
      setWalletAddress("");
    }
  }, [selectedCrypto, userWallets]);

  const handleWithdrawal = async () => {
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt < minimumWithdrawal) {
      toast.error(`Minimum withdrawal amount is $${minimumWithdrawal}`);
      return;
    }
    const requiredKey = selectedCrypto === 0 ? "btc" : selectedCrypto === 1 ? "eth" : selectedCrypto === 2 ? "usdt" : "bnb";
    const connectedAddr = userWallets[requiredKey];
    if (!connectedAddr) {
      toast.error("Please submit a wallet address first");
      return;
    }
    if (!walletAddress) {
      setWalletAddress(connectedAddr);
    }
    if (amt > availableBalance) {
      toast.error("Amount exceeds available balance");
      return;
    }
    try {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amt, walletAddress, crypto: cryptoOptions[selectedCrypto].name }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to submit withdrawal");
      }
      toast.success("Withdrawal request submitted successfully");
      setWithdrawAmount("");
      setWalletAddress("");
      const listRes = await fetch("/api/withdrawals", { cache: "no-store" });
      if (listRes.ok) {
        const list = await listRes.json();
        const mapped: Withdrawal[] = (list || []).map((w: any) => ({
          id: w.id,
          amount: Number(w.amount) || 0,
          walletAddress: String(w.walletAddress || ""),
          crypto: String(w.crypto || ""),
          requestedAt: w.requestedAt || new Date().toISOString(),
          status: (w.status as WithdrawalStatus) || "Pending",
          approvedAt: w.approvedAt ?? null,
          txHash: w.txHash ?? null,
          adminNote: w.adminNote ?? null,
        }));
        setHistory(mapped);
        setCurrentPage(1); // Reset back to first page upon fresh creation logic
      }
    } catch (e: any) {
      toast.error(e?.message || "Unable to submit withdrawal");
    }
  };

  const filteredWithdrawals =
    filterStatus === "all"
      ? history
      : history.filter((w) => w.status.toLowerCase() === filterStatus.toLowerCase());

  // Compute total dynamic pages
  const totalPages = Math.ceil(filteredWithdrawals.length / itemsPerPage) || 1;
  
  // Safe bounded calculation checks for slice arrays
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredWithdrawals.slice(indexOfFirstItem, indexOfLastItem);

  const totalWithdrawnAmount = history
    .filter((w) => w.status === "Approved")
    .reduce((sum, w) => sum + (Number(w.amount) || 0), 0);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50 dark:bg-[#080d17] transition-colors duration-200">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-24 md:pb-8 mb-[50px] md:mb-0">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-1.5">
              Withdrawals
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Request and manage your fund withdrawals safely
            </p>
          </div>

          {/* Stats Summary Panel - Grid 2 on mobile devices */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8">
            <Card className="bg-white dark:bg-[#0f1623] border border-gray-200/80 dark:border-white/[0.06] shadow-sm">
              <CardContent className="p-4 md:p-6 flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-3 md:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Wallet className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="min-w-0 w-full">
                  <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white truncate">{`$${availableBalance.toLocaleString()}`}</p>
                  <p className="text-gray-400 dark:text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-0.5 truncate">Available Balance</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-[#0f1623] border border-gray-200/80 dark:border-white/[0.06] shadow-sm">
              <CardContent className="p-4 md:p-6 flex flex-col sm:flex-row items-center sm:items-start md:items-center mb-0.5 gap-3 md:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="min-w-0 w-full">
                  <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white truncate mb-0.5">{`$${totalWithdrawnAmount.toLocaleString()}`}</p>
                  <p className="text-gray-400 dark:text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-wider truncate">Total Withdrawn</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Withdrawal Form Input Structure Column */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="bg-white dark:bg-[#0f1623] border border-gray-200/80 dark:border-white/[0.06] shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-gray-900 dark:text-white font-bold">
                    New Withdrawal Request
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-500 dark:text-slate-400">
                    Securely request settlement to your bound crypto addresses
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  
                  <div className="p-4 bg-emerald-50/60 dark:bg-emerald-500/[0.03] border border-emerald-200/60 dark:border-emerald-500/10 rounded-xl flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">Withdrawable Vault Pool</span>
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">${availableBalance}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2.5">
                      Select Crypto Asset
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {cryptoOptions.map((crypto, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedCrypto(index)}
                          className={`p-3 rounded-xl border transition-all text-left flex flex-col justify-center cursor-pointer ${
                            selectedCrypto === index
                              ? "border-emerald-500 bg-emerald-500/[0.03] shadow-sm shadow-emerald-500/5"
                              : "border-gray-200 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.01] hover:bg-gray-100/50 dark:hover:bg-white/[0.03]"
                          }`}
                        >
                          <span className="font-semibold text-gray-900 dark:text-white text-sm">
                            {crypto.name}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{crypto.network}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="amount" className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2.5">
                      Withdrawal Target Amount
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/[0.05] flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                      </div>
                      <input
                        type="number"
                        id="amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        min={minimumWithdrawal}
                        className="w-full pl-14 pr-4 py-3 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.08] rounded-xl text-gray-900 dark:text-white font-medium focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/20 transition-all text-sm"
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1.5 px-0.5">
                      <span className="text-[11px] text-gray-400 dark:text-slate-500">
                        Threshold lock limit: <strong className="text-gray-600 dark:text-slate-400">${minimumWithdrawal}</strong>
                      </span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="wallet" className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2.5">
                      Bound Transfer Address
                    </label>
                    <input
                      type="text"
                      id="wallet"
                      value={walletAddress}
                      disabled
                      placeholder="Connect corresponding wallet address first"
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-gray-500 dark:text-slate-400 font-mono text-xs cursor-not-allowed select-none"
                    />
                  </div>

                  <div className="p-3 bg-blue-500/[0.04] border border-blue-500/10 rounded-xl flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700/80 dark:text-blue-400/80 leading-normal">
                      Security Verification: Payout instructions are automatically executed upon compliance clearance by operators within 24 to 48 hours.
                    </p>
                  </div>

                  <Button
                    onClick={handleWithdrawal}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-6 rounded-xl text-sm font-bold tracking-wide transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
                  >
                    Submit Withdrawal Request
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-amber-500/[0.02] border border-amber-500/10 shadow-none rounded-xl">
                <CardHeader className="py-4">
                  <CardTitle className="text-amber-600 dark:text-amber-500 text-sm font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Important Security Advisory Notice
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-gray-500 dark:text-slate-400">
                    <li className="flex items-center gap-1.5">• Double-check parameters layout</li>
                    <li className="flex items-center gap-1.5">• Settlement buffer: 24-48 Hours</li>
                    <li className="flex items-center gap-1.5">• Network mining gas fees apply</li>
                    <li className="flex items-center gap-1.5 text-red-500/80 dark:text-rose-400/80 font-medium">• Irrecoverable assets if address errors occur</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Right Hand: Paginated History Ledger Column */}
            <div className="lg:col-span-5">
              <Card className="bg-white dark:bg-[#0f1623] border border-gray-200/80 dark:border-white/[0.06] shadow-sm h-full flex flex-col">
                <CardHeader className="pb-4 flex flex-row items-start justify-between gap-4 space-y-0">
                  <div>
                    <CardTitle className="text-lg text-gray-900 dark:text-white font-bold">
                      Withdrawal History
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-500 dark:text-slate-400">
                      Audit overview log of processing transfers
                    </CardDescription>
                  </div>

                  {/* Left / Right Navigation Triggers (Conditional Visibility) */}
                  {!loading && filteredWithdrawals.length > itemsPerPage && (
                    <div className="flex items-center gap-1 shrink-0 bg-gray-100 dark:bg-white/[0.04] p-1 rounded-lg border border-gray-200/50 dark:border-white/[0.04]">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-200 dark:hover:bg-white/[0.05] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer text-gray-600 dark:text-slate-400"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-[10px] font-bold text-gray-500 dark:text-slate-400 px-1 min-w-[28px] text-center">
                        {currentPage}/{totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-200 dark:hover:bg-white/[0.05] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer text-gray-600 dark:text-slate-400"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-slate-500 gap-2">
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-medium">Fetching history ledger…</span>
                    </div>
                  ) : filteredWithdrawals.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/[0.04] flex items-center justify-center mx-auto mb-3.5 text-gray-400 dark:text-slate-500">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                        No History Ledger Generated
                      </h3>
                      <p className="text-xs text-gray-400 dark:text-slate-500 max-w-[240px] mx-auto leading-normal">
                        Your completed ledger settlements will populate within this sub-view panel.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentItems.map((w) => {
                        const conf = statusConfig[
                          w.status === "Pending" ? "pending" : w.status === "Approved" ? "paid" : "declined"
                        ];
                        const Icon = conf.icon;
                        return (
                          <div key={w.id} className={`p-4 rounded-xl border ${conf.border} ${conf.bg} transition-all animate-fadeIn`}>
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="font-bold text-base text-gray-900 dark:text-white">
                                  ${w.amount.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mt-0.5">
                                  {w.crypto}
                                </p>
                                <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">
                                  {new Date(w.requestedAt).toLocaleString()}
                                </p>
                              </div>
                              <div className={`px-2 py-1 rounded-lg text-[11px] font-bold tracking-wide ${conf.badge} flex items-center gap-1 shrink-0 shadow-sm`}>
                                <Icon className="w-3.5 h-3.5" /> {conf.label}
                              </div>
                            </div>
                            <div className="mt-3 pt-2.5 border-t border-gray-900/[0.03] dark:border-white/[0.04] text-[11px] text-gray-400 dark:text-slate-500 font-mono flex items-center justify-between gap-2">
                              <span className="truncate">Addr: {w.walletAddress}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <UserNav />
      </div>
    </div>
  );
}