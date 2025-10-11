"use client";

import React, { useState } from "react";
// Assuming these imports are correctly aliased in your project
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
  ArrowDownRight,
  ArrowUpRight,
  TrendingUp,
  Users,
  Settings,
  Calendar,
  Search,
  Download,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  FileText,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
// SHADCN UI DROPDOWN IMPORTS for Select (Already present)
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Complete transaction history
const transactionHistory = [
  {
    id: 1,
    type: "investment",
    description: "Gold Plan Investment",
    amount: 5000,
    status: "completed",
    date: "2025-10-05",
    time: "14:30",
    reference: "INV-001234",
    details: "21 days plan with 40% ROI",
  },
  {
    id: 2,
    type: "withdrawal",
    description: "Bitcoin Withdrawal",
    amount: 1200,
    status: "pending",
    date: "2025-10-05",
    time: "10:15",
    reference: "WTH-005678",
    details: "Processing to BTC wallet",
  },
  {
    id: 3,
    type: "referral",
    description: "Referral Commission from John D.",
    amount: 500,
    status: "completed",
    date: "2025-10-04",
    time: "16:45",
    reference: "REF-002345",
    details: "10% commission on $5,000 investment",
  },
  {
    id: 4,
    type: "deposit",
    description: "Ethereum Deposit",
    amount: 3000,
    status: "completed",
    date: "2025-10-03",
    time: "09:20",
    reference: "DEP-003456",
    details: "Payment verification completed",
  },
  {
    id: 5,
    type: "roi",
    description: "Silver Plan ROI Payout",
    amount: 450,
    status: "completed",
    date: "2025-10-02",
    time: "12:00",
    reference: "ROI-004567",
    details: "Daily ROI credit",
  },
  {
    id: 6,
    type: "withdrawal",
    description: "USDT Withdrawal",
    amount: 800,
    status: "completed",
    date: "2025-10-01",
    time: "15:30",
    reference: "WTH-005679",
    details: "Successfully paid",
  },
  {
    id: 7,
    type: "admin",
    description: "Bonus Credit",
    amount: 100,
    status: "completed",
    date: "2025-09-30",
    time: "11:00",
    reference: "ADM-006789",
    details: "Welcome bonus from admin",
  },
  {
    id: 8,
    type: "investment",
    description: "Platinum Plan Investment",
    amount: 15000,
    status: "completed",
    date: "2025-09-28",
    time: "13:45",
    reference: "INV-001235",
    details: "30 days plan with 60% ROI",
  },
  {
    id: 9,
    type: "referral",
    description: "Referral Commission from Sarah M.",
    amount: 300,
    status: "completed",
    date: "2025-09-27",
    time: "10:30",
    reference: "REF-002346",
    details: "10% commission on $3,000 investment",
  },
  {
    id: 10,
    type: "withdrawal",
    description: "Bitcoin Withdrawal",
    amount: 500,
    status: "declined",
    date: "2025-09-26",
    time: "14:20",
    reference: "WTH-005680",
    details: "Insufficient investment period",
  },
  {
    id: 11,
    type: "deposit",
    description: "Bitcoin Deposit",
    amount: 2000,
    status: "completed",
    date: "2025-09-25",
    time: "08:15",
    reference: "DEP-003457",
    details: "Payment verification completed",
  },
  {
    id: 12,
    type: "roi",
    description: "Gold Plan ROI Payout",
    amount: 285,
    status: "completed",
    date: "2025-09-24",
    time: "12:00",
    reference: "ROI-004568",
    details: "Daily ROI credit",
  },
];

// Transaction type configurations
const transactionTypes = {
  investment: {
    icon: TrendingUp,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    badge: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
    label: "Investment",
  },
  withdrawal: {
    icon: ArrowUpRight,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    badge: "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300",
    label: "Withdrawal",
  },
  deposit: {
    icon: ArrowDownRight,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950/30",
    badge: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300",
    label: "Deposit",
  },
  referral: {
    icon: Users,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    badge: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
    label: "Referral",
  },
  roi: {
    icon: DollarSign,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    badge: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
    label: "ROI Payout",
  },
  admin: {
    icon: Settings,
    color: "text-gray-600 dark:text-gray-400",
    bg: "bg-gray-50 dark:bg-gray-950/30",
    badge: "bg-gray-100 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300",
    label: "Admin Action",
  },
};

// Status configurations
const statusTypes = {
  completed: {
    icon: CheckCircle,
    color: "text-green-600 dark:text-green-400",
    badge: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300",
    label: "Completed",
  },
  pending: {
    icon: Clock,
    color: "text-yellow-600 dark:text-yellow-400",
    badge: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300",
    label: "Pending",
  },
  declined: {
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    badge: "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300",
    label: "Declined",
  },
};

// Date range options for the Select component
const dateRangeOptions = [
  { value: "all", label: "All Time" },
  { value: "today", label: "Today" },
  { value: "week", label: "Last 7 Days" },
  { value: "month", label: "Last 30 Days" },
  { value: "3months", label: "Last 3 Months" },
];

export default function HistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateFilter, setDateFilter] = useState("all"); // Changed to use state from Select

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Filter transactions
  const filteredTransactions = transactionHistory.filter(transaction => {
    // Search filter
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchQuery.toLowerCase());

    // Type filter
    const matchesType = filterType === "all" || transaction.type === filterType;

    // Status filter
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus;

    // Date filter
    let matchesDate = true;
    if (dateFilter !== "all") {
      const transactionDate = new Date(transaction.date);
      const today = new Date();
      // Set time to start of day for accurate comparison
      today.setHours(0, 0, 0, 0);
      transactionDate.setHours(0, 0, 0, 0);

      // Calculate time difference in milliseconds
      const diffTime = today.getTime() - transactionDate.getTime();
      // Calculate day difference (milliseconds / (milliseconds per day))
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 

      if (dateFilter === "today") matchesDate = diffDays === 0; // Exactly today
      else if (dateFilter === "week") matchesDate = diffDays <= 6; // Today and the last 6 days
      else if (dateFilter === "month") matchesDate = diffDays <= 29; // Today and the last 29 days
      else if (dateFilter === "3months") matchesDate = diffDays <= 89; // Today and the last 89 days
    }

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  // Calculate statistics
  const stats = {
    total: transactionHistory.length,
    deposits: transactionHistory.filter(t => t.type === "deposit" && t.status === "completed").reduce((sum, t) => sum + t.amount, 0),
    withdrawals: transactionHistory.filter(t => t.type === "withdrawal" && t.status === "completed").reduce((sum, t) => sum + t.amount, 0),
    earnings: transactionHistory.filter(t => (t.type === "roi" || t.type === "referral") && t.status === "completed").reduce((sum, t) => sum + t.amount, 0),
  };

  // Export function (placeholder)
  const handleExport = (format: string) => {
    alert(`Exporting transaction history as ${format.toUpperCase()}...`);
    // In real app, generate and download file
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar (Assuming this component is imported correctly) */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        {/* History Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-20 md:pb-8 mb-[50px] md:mb-0">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Transaction History
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Complete record of all your account activities
            </p>
          </div>

          {/* Transaction List */}
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">
                All Transactions ({filteredTransactions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    No Transactions Found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your filters or search query
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTransactions.map((transaction) => {
                    const typeConfig = transactionTypes[transaction.type as keyof typeof transactionTypes];
                    const statusConfig = statusTypes[transaction.status as keyof typeof statusTypes];
                    const TypeIcon = typeConfig.icon;
                    const StatusIcon = statusConfig.icon;
                    const isDebit = transaction.type === "withdrawal";

                    return (
                      // Mobile column structure for transactions
                      <div
                        key={transaction.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-2 border-gray-200 dark:border-gray-800 rounded-lg hover:border-emerald-500 dark:hover:border-emerald-500 transition"
                      >
                        {/* Left Section (Icon + Details) */}
                        <div className="flex items-start gap-4 flex-1 mb-2 sm:mb-0">
                          {/* Icon */}
                          <div className={`w-10 h-10 rounded-full ${typeConfig.bg} flex items-center justify-center flex-shrink-0`}>
                            <TypeIcon className={`w-5 h-5 ${typeConfig.color}`} />
                          </div>

                          {/* Details - Column on Small Screen */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-gray-900 dark:text-gray-100 truncate text-base">
                                {transaction.description}
                              </h4>
                              {/* Type Badge */}
                              <span className={`hidden sm:inline-block px-2 py-0.5 rounded text-xs font-semibold ${typeConfig.badge} flex-shrink-0`}>
                                {typeConfig.label}
                              </span>
                            </div>
                            {/* Date/Ref on large screens, or under description on small screens */}
                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(transaction.date)} at {transaction.time}
                              </span>
                              <span className="hidden sm:inline-block">•</span>
                              <span className="hidden sm:inline-block">Ref: {transaction.reference}</span>
                            </div>
                            <p className="sm:hidden text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Ref: {transaction.reference}
                            </p>
                          </div>
                        </div>

                        {/* Right Section (Amount + Status) - Column/End on Small Screen */}
                        <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 dark:border-gray-800/50">
                          {/* Amount - Visible on Small Screen now */}
                          <div className="text-right flex-shrink-0">
                            <p className={`text-lg sm:text-xl font-bold ${
                              isDebit ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                            }`}>
                              {isDebit ? "-" : "+"}${transaction.amount.toLocaleString()}
                            </p>
                          </div>

                          {/* Status */}
                          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 ${statusConfig.badge} flex-shrink-0`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </main>

        {/* Mobile Bottom Navigation (Assuming this component is imported correctly) */}
        <UserNav />
      </div>
    </div>
  );
}