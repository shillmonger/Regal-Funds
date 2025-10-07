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
  Calendar,
  ArrowRight,
  Info,
  Copy,
  TrendingUp,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type WithdrawalStatus = keyof typeof statusConfig;

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


// Withdrawal history data
const withdrawalHistory: Withdrawal[] = [
  {
    id: 1,
    amount: 1200,
    walletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    crypto: "Bitcoin (BTC)",
    requestDate: "2025-10-05",
    status: "pending",
    adminNote: null,
  },
  {
    id: 2,
    amount: 3500,
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    crypto: "Ethereum (ETH)",
    requestDate: "2025-10-03",
    status: "approved",
    processedDate: "2025-10-04",
    adminNote: "Approved - Processing within 24 hours",
  },
  {
    id: 3,
    amount: 800,
    walletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    crypto: "Bitcoin (BTC)",
    requestDate: "2025-10-01",
    status: "paid",
    processedDate: "2025-10-02",
    paidDate: "2025-10-02",
    txHash: "0x8f3d...a9c2",
    adminNote: "Payment completed successfully",
  },
  {
    id: 4,
    amount: 500,
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    crypto: "Ethereum (ETH)",
    requestDate: "2025-09-28",
    status: "declined",
    processedDate: "2025-09-29",
    adminNote: "Insufficient completed investment period. Please wait for plan maturity.",
  },
  {
    id: 5,
    amount: 2100,
    walletAddress: "bnb1xy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    crypto: "BNB",
    requestDate: "2025-09-25",
    status: "paid",
    processedDate: "2025-09-26",
    paidDate: "2025-09-26",
    txHash: "0x7e2f...b8d1",
    adminNote: "Payment completed successfully",
  },
];

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
  approved: {
    icon: CheckCircle,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    badge: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
    label: "Approved",
  },
  paid: {
    icon: CheckCircle,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-800",
    badge: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300",
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

// Supported cryptocurrencies
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

  // User balance (in real app, fetch from backend)
  const availableBalance = 5680;
  const minimumWithdrawal = 50;

  // Copy to clipboard
const copyToClipboard = (text: string, id: string | number): void => {
  navigator.clipboard.writeText(text);
  setCopiedAddress(id);
  setTimeout(() => setCopiedAddress(null), 2000);
};

// Format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};


  // Handle withdrawal submission
  const handleWithdrawal = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) < minimumWithdrawal) {
      alert(`Minimum withdrawal amount is $${minimumWithdrawal}`);
      return;
    }
    if (parseFloat(withdrawAmount) > availableBalance) {
      alert("Insufficient balance");
      return;
    }
    if (!walletAddress) {
      alert("Please enter your wallet address");
      return;
    }
    
    // In real app, send to backend
    console.log({
      amount: withdrawAmount,
      walletAddress,
      crypto: cryptoOptions[selectedCrypto],
    });
    
    alert("Withdrawal request submitted successfully!");
    setWithdrawAmount("");
    setWalletAddress("");
  };

  // Filter withdrawals
  const filteredWithdrawals = filterStatus === "all" 
    ? withdrawalHistory 
    : withdrawalHistory.filter(w => w.status === filterStatus);

  // Calculate statistics
  const stats = {
    pending: withdrawalHistory.filter(w => w.status === "pending").length,
    approved: withdrawalHistory.filter(w => w.status === "approved").length,
    paid: withdrawalHistory.filter(w => w.status === "paid").reduce((sum, w) => sum + w.amount, 0),
    total: withdrawalHistory.length,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Withdrawals Content */}
<main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-20 md:pb-8 mb-[50px] md:mb-0">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Withdrawals
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Request and manage your fund withdrawals
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Wallet className="w-8 h-8 opacity-80" />
                </div>
                <p className="text-emerald-100 text-sm mb-1">Available Balance</p>
                <p className="text-2xl md:text-3xl font-bold">${availableBalance.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-xs bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full font-semibold">
                    {stats.pending}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Pending</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">Review</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full font-semibold">
                    {stats.approved}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Approved</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">Processing</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Withdrawn</p>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  ${stats.paid.toLocaleString()}
                </p>
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
                  {/* Available Balance Display */}
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-1">Available Balance</p>
                    <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                      ${availableBalance.toLocaleString()}
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

                  {/* Withdrawal Amount */}
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
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
                        max={availableBalance}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Minimum: ${minimumWithdrawal} • Maximum: ${availableBalance.toLocaleString()}
                    </p>
                  </div>

                  {/* Wallet Address */}
                  <div>
                    <label htmlFor="wallet" className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
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
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Make sure the address matches the selected network
                    </p>
                  </div>

                  {/* Info Banner */}
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Withdrawal requests are processed within 24-48 hours after admin approval
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={handleWithdrawal}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 text-base font-semibold"
                  >
                    Submit Withdrawal Request
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Info Card */}
              <Card className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
                <CardHeader>
                  <CardTitle className="text-orange-800 dark:text-orange-300 text-base flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Important Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-orange-700 dark:text-orange-400">
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>Verify wallet address before submitting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>Processing time: 24-48 hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>Network fees may apply</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>Wrong address = Lost funds</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Withdrawal History */}
            <div className="lg:col-span-2">
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-gray-900 dark:text-gray-100">
                        Withdrawal History
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Track all your withdrawal requests
                      </CardDescription>
                    </div>
                  </div>

                  {/* Filter Buttons */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {["all", "pending", "approved", "paid", "declined"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          filterStatus === status
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredWithdrawals.length === 0 ? (
                      <div className="text-center py-12">
                        <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                          No Withdrawals Found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {filterStatus === "all" 
                            ? "You haven't made any withdrawal requests yet"
                            : `No ${filterStatus} withdrawals found`}
                        </p>
                      </div>
                    ) : (
                      filteredWithdrawals.map((withdrawal) => {
                        const config = statusConfig[withdrawal.status];
                        const StatusIcon = config.icon;
                        
                        return (
                          <div
                            key={withdrawal.id}
                            className={`p-5 border-2 ${config.border} ${config.bg} rounded-lg hover:shadow-md transition`}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center`}>
                                  <StatusIcon className={`w-6 h-6 ${config.color}`} />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                                    ${withdrawal.amount.toLocaleString()}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    ID: #{withdrawal.id.toString().padStart(6, '0')}
                                  </p>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.badge}`}>
                                {config.label}
                              </span>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Cryptocurrency:</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  {withdrawal.crypto}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Wallet Address:</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs text-gray-900 dark:text-gray-100">
                                    {withdrawal.walletAddress.slice(0, 8)}...{withdrawal.walletAddress.slice(-6)}
                                  </span>
                                  <button
                                    onClick={() => copyToClipboard(withdrawal.walletAddress, withdrawal.id)}
                                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition"
                                  >
                                    {copiedAddress === withdrawal.id ? (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <Copy className="w-4 h-4 text-gray-500" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Request Date:</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  {formatDate(withdrawal.requestDate)}
                                </span>
                              </div>

                              {withdrawal.processedDate && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600 dark:text-gray-400">Processed Date:</span>
                                  <span className="font-medium text-gray-900 dark:text-gray-100">
                                    {formatDate(withdrawal.processedDate)}
                                  </span>
                                </div>
                              )}

                              {withdrawal.txHash && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600 dark:text-gray-400">Transaction Hash:</span>
                                  <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                                    {withdrawal.txHash}
                                  </span>
                                </div>
                              )}

                              {withdrawal.adminNote && (
                                <div className="mt-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                                    Admin Note:
                                  </p>
                                  <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {withdrawal.adminNote}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <UserNav />
      </div>
    </div>
  );
}