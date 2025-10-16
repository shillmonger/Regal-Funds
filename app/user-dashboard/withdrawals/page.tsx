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
  Copy,
  TrendingUp,
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

const withdrawalHistory: Withdrawal[] = [];

// Status configurations
const statusConfig = {
  pending: {
    icon: Clock,
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    border: "border-yellow-200 dark:border-yellow-800",
    badge: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300",
    label: "Pending",
  },
  paid: {
    icon: CheckCircle,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    badge: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
    label: "Paid",
  },
  declined: {
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    badge: "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300",
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
        const meRes = arguments[0][2] || null; // placeholder
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Separate effect to load user wallets (avoids the placeholder workaround above)
  useEffect(() => {
    const loadMe = async () => {
      try {
        const res = await fetch("/api/users/me", { cache: "no-store" });
        if (!res.ok) return;
        const me = await res.json();
        const wallets = (me?.wallets as Record<string, string>) || {};
        setUserWallets(wallets);
        // Attempt initial auto-fill for default selection
        const key = selectedCrypto === 0 ? "btc" : selectedCrypto === 1 ? "eth" : selectedCrypto === 2 ? "usdt" : "bnb";
        if (wallets[key]) setWalletAddress(wallets[key]);
      } catch {}
    };
    loadMe();
  }, []);

  // Auto-fill wallet address when crypto selection changes
  useEffect(() => {
    const key = selectedCrypto === 0 ? "btc" : selectedCrypto === 1 ? "eth" : selectedCrypto === 2 ? "usdt" : "bnb";
    const addr = userWallets[key];
    if (addr) {
      setWalletAddress(addr);
    } else {
      // Clear input if no connected wallet for that type
      setWalletAddress("");
    }
  }, [selectedCrypto, userWallets]);

  const copyToClipboard = (text: string, id: string | number): void => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(id);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleWithdrawal = async () => {
    if (!eligible) {
      toast.info("Available when expired");
      return;
    }
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt < minimumWithdrawal) {
      toast.error(`Minimum withdrawal amount is $${minimumWithdrawal}`);
      return;
    }
    // Ensure user has connected a wallet for the selected crypto
    const requiredKey = selectedCrypto === 0 ? "btc" : selectedCrypto === 1 ? "eth" : selectedCrypto === 2 ? "usdt" : "bnb";
    const connectedAddr = userWallets[requiredKey];
    if (!connectedAddr) {
      toast.error("Please submit a wallet address first");
      return;
    }
    // If input is empty, auto-fill from connected wallet
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
      }
    } catch (e: any) {
      toast.error(e?.message || "Unable to submit withdrawal");
    }
  };

  const filteredWithdrawals =
    filterStatus === "all"
      ? history
      : history.filter((w) => w.status.toLowerCase() === filterStatus.toLowerCase());

  const stats = {
    pending: history.filter((w) => w.status === "Pending").length,
    paid: history.filter((w) => w.status === "Approved").length,
    total: history.length,
  };
  const totalWithdrawnAmount = history
    .filter((w) => w.status === "Approved")
    .reduce((sum, w) => sum + (Number(w.amount) || 0), 0);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-20 md:pb-8 mb-[50px] md:mb-0">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Withdrawals
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Request and manage your fund withdrawals
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <Wallet className="w-8 h-8 opacity-80 mb-2" />
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Available Balance</p>
                <p className="text-3xl font-bold">{`$${availableBalance.toLocaleString()}`}</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <TrendingUp className="w-8 h-8 opacity-80 mb-2 text-green-600" />
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Withdrawal so far</p>
                <p className="text-3xl font-bold">{`$${totalWithdrawnAmount.toLocaleString()}`}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Withdrawal Form */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">
                    New Withdrawal Request
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Submit a withdrawal to your crypto wallet
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-1">
                      Available Balance
                    </p>
                    <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                      ${availableBalance}
                    </p>
                  </div>

                  {/* Crypto Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Select Cryptocurrency
                    </label>
                    <div className="space-y-2">
                      {cryptoOptions.map((crypto, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedCrypto(index)}
                          className={`w-full p-3 rounded-lg border-2 transition text-left ${
                            selectedCrypto === index
                              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                          }`}
                        >
                          <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                            {crypto.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{crypto.network}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2"
                    >
                      Withdrawal Amount
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        id="amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        min={minimumWithdrawal}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Minimum after Expirration: ${minimumWithdrawal}
                    </p>
                  </div>

                  {/* Wallet */}
                  <div>
                    <label
                      htmlFor="wallet"
                      className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2"
                    >
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      id="wallet"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="Enter your wallet address"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Info Banner */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Withdrawal requests are processed within 24-48 hours after admin approval.
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleWithdrawal}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-base font-semibold"
                  >
                    Submit Withdrawal Request
                  </Button>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
                <CardHeader>
                  <CardTitle className="text-orange-800 dark:text-orange-300 text-base flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Important Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-orange-700 dark:text-orange-400">
                    <li>• Verify wallet address before submitting</li>
                    <li>• Processing time: 24-48 hours</li>
                    <li>• Network fees may apply</li>
                    <li>• Wrong address = Lost funds</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">
                    Withdrawal History
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Track all your withdrawal requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-16 text-gray-600 dark:text-gray-400">Loading...</div>
                  ) : filteredWithdrawals.length === 0 ? (
                    <div className="text-center py-16">
                      <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        No Withdrawals Found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        You haven’t made any withdrawal requests yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredWithdrawals.map((w) => {
                        const conf = statusConfig[
                          w.status === "Pending" ? "pending" : w.status === "Approved" ? "paid" : "declined"
                        ];
                        const Icon = conf.icon;
                        return (
                          <div key={w.id} className={`p-4 rounded-lg border ${conf.border} ${conf.bg}`}>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-gray-100">${'{'}w.amount.toLocaleString(){'}'}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{w.crypto} • {new Date(w.requestedAt).toLocaleString()}</p>
                              </div>
                              <div className={`px-2 py-1 rounded-full text-xs ${conf.badge} flex items-center gap-1`}>
                                <Icon className="w-4 h-4" /> {conf.label}
                              </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 break-all">
                              Wallet: {w.walletAddress}
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
