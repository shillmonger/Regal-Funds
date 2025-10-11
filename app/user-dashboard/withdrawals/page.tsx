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

type WithdrawalStatus = "pending" | "paid" | "declined";

interface Withdrawal {
  id: number;
  amount: number;
  walletAddress: string;
  crypto: string;
  requestDate: string;
  status: WithdrawalStatus;
  processedDate?: string;
  paidDate?: string;
  txHash?: string;
  adminNote?: string | null;
}

// Empty history
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

  const availableBalance = 0;
  const minimumWithdrawal = 50;

  const copyToClipboard = (text: string, id: string | number): void => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(id);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleWithdrawal = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) < minimumWithdrawal) {
      alert(`Minimum withdrawal amount is $${minimumWithdrawal}`);
      return;
    }
    if (!walletAddress) {
      alert("Please enter your wallet address");
      return;
    }
    alert("Withdrawal request submitted successfully!");
    setWithdrawAmount("");
    setWalletAddress("");
  };

  const filteredWithdrawals =
    filterStatus === "all"
      ? withdrawalHistory
      : withdrawalHistory.filter((w) => w.status === filterStatus);

  const stats = {
    pending: 0,
    paid: 0,
    total: 0,
  };

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
                <p className="text-3xl font-bold">${availableBalance}</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <TrendingUp className="w-8 h-8 opacity-80 mb-2 text-green-600" />
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Withdrawn</p>
                <p className="text-3xl font-bold">${stats.paid}</p>
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
                      Minimum: ${minimumWithdrawal}
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

            {/* Empty History */}
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
                  <div className="text-center py-16">
                    <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      No Withdrawals Found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      You haven’t made any withdrawal requests yet.
                    </p>
                  </div>
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
