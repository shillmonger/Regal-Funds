"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusMap = (s: string) => {
  const x = (s || "").toLowerCase();
  if (x === "approved" || x === "paid" || x === "active" || x === "completed") return "completed";
  if (x === "rejected" || x === "failed" || x === "declined") return "declined";
  return "pending";
};

// Transaction type configurations
const transactionTypes = {
  investment: {
    icon: TrendingUp,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50/50 dark:bg-blue-950/20",
    badge: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    label: "Investment",
  },
  withdrawal: {
    icon: ArrowUpRight,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50/50 dark:bg-orange-950/20",
    badge: "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
    label: "Withdrawal",
  },
  deposit: {
    icon: ArrowDownRight,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50/50 dark:bg-green-950/20",
    badge: "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    label: "Deposit",
  },
  referral: {
    icon: Users,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50/50 dark:bg-purple-950/20",
    badge: "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
    label: "Referral",
  },
  roi: {
    icon: DollarSign,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50/50 dark:bg-emerald-950/20",
    badge: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    label: "ROI Payout",
  },
  admin: {
    icon: Settings,
    color: "text-gray-600 dark:text-gray-400",
    bg: "bg-gray-50/50 dark:bg-gray-950/20",
    badge: "bg-gray-50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300",
    label: "Admin Action",
  },
};

// Status configurations
const statusTypes = {
  completed: {
    icon: CheckCircle,
    color: "text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/40 dark:border-emerald-500/10",
    label: "Completed",
  },
  pending: {
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200/40 dark:border-amber-500/10",
    label: "Pending",
  },
  declined: {
    icon: XCircle,
    color: "text-red-600 dark:text-red-400",
    badge: "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200/40 dark:border-red-500/10",
    label: "Declined",
  },
};

export default function HistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setError(null);
      setLoading(true);
      try {
        const res = await fetch("/api/user/activity", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load activity");
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError(e?.message || "Unable to load activity");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const transactionHistory = useMemo(() => {
    return items.map((a: any) => {
      const kind = String(a.kind || "");
      const rawStatus = String(a.status || "");
      const status = statusMap(rawStatus);
      const amount = Number(a.amount || 0);
      const when = a.date || new Date().toISOString();
      const time = new Date(when).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let type = "deposit" as keyof typeof transactionTypes;
      let description = "";
      
      if (kind === "payment") {
        type = "deposit";
        description = `Payment ${a.planName ? `• ${a.planName}` : ""}`;
      } else if (kind === "investment") {
        type = "investment";
        description = `Investment ${a.planName ? `• ${a.planName}` : ""}`;
      } else if (kind === "withdrawal") {
        type = "withdrawal";
        description = `Withdrawal Request`;
      } else if (kind === "referral") {
        type = "referral";
        description = "Referral commission bonus";
      } else if (kind === "roi") {
        type = "roi";
        description = `Daily earnings yields ${a.planName ? `• ${a.planName}` : ""}`;
      }
      return {
        id: a.id,
        type,
        status,
        amount,
        description,
        date: when,
        time,
        reference: a.id ? String(a.id).substring(0, 8).toUpperCase() : "N/A",
      };
    });
  }, [items]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredTransactions = transactionHistory.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesStatus = filterStatus === "all" || transaction.status === filterStatus;

    let matchesDate = true;
    if (dateFilter !== "all") {
      const transactionDate = new Date(transaction.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      transactionDate.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - transactionDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 

      if (dateFilter === "today") matchesDate = diffDays === 0;
      else if (dateFilter === "week") matchesDate = diffDays <= 6;
      else if (dateFilter === "month") matchesDate = diffDays <= 29;
      else if (dateFilter === "3months") matchesDate = diffDays <= 89;
    }

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50 dark:bg-[#080d17] transition-colors duration-200">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-15 md:pb-8 mb-[50px] md:mb-0">
          
          {/* Header Area */}
          <div className="max-w-6xl mx-auto mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Transaction History
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
              Complete transactional audit log records for ledger balances.
            </p>
          </div>

          {/* Filtering Controls Workspace Grid */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 opacity-70" />
              <Input
                placeholder="Search reference or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-11 bg-white dark:bg-[#0f1623] border border-gray-200 dark:border-white/[0.06] rounded-xl text-xs font-medium text-gray-900 dark:text-white"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-11 bg-white dark:bg-[#0f1623] border border-gray-200 dark:border-white/[0.06] rounded-xl text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                <SelectValue placeholder="All Activity Types" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#0f1623] border border-gray-100 dark:border-white/[0.06] rounded-xl text-xs font-bold uppercase tracking-wider">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="deposit">Deposits</SelectItem>
                <SelectItem value="withdrawal">Withdrawals</SelectItem>
                <SelectItem value="investment">Investments</SelectItem>
                <SelectItem value="roi">ROI Dividends</SelectItem>
                <SelectItem value="referral">Referrals</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-11 bg-white dark:bg-[#0f1623] border border-gray-200 dark:border-white/[0.06] rounded-xl text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                <SelectValue placeholder="All Status Matrix" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#0f1623] border border-gray-100 dark:border-white/[0.06] rounded-xl text-xs font-bold uppercase tracking-wider">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="h-11 bg-white dark:bg-[#0f1623] border border-gray-200 dark:border-white/[0.06] rounded-xl text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                <SelectValue placeholder="Time Horizon" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#0f1623] border border-gray-100 dark:border-white/[0.06] rounded-xl text-xs font-bold uppercase tracking-wider">
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Master Table Area Card Container */}
          <div className="max-w-6xl mx-auto">
            <Card className="bg-white dark:bg-[#0f1623] border border-gray-200/80 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-sm relative">
              <CardHeader className="p-5 border-b border-gray-100 dark:border-white/[0.04]">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-gray-900 dark:text-white">
                      Ledger Ledger Entries
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                      Displaying {filteredTransactions.length} processed operations matching parameters
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {loading ? (
                  /* Premium Loading State Overlay Component Spinner */
                  <div className="flex flex-col items-center justify-center py-24 w-full">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500 mt-4">
                      Synchronizing Global Ledger...
                    </span>
                  </div>
                ) : error ? (
                  <div className="text-center py-12 px-4">
                    <p className="text-xs font-semibold text-red-500">{error}</p>
                  </div>
                ) : filteredTransactions.length === 0 ? (
                  <div className="text-center py-20">
                    <FileText className="w-12 h-12 text-gray-300 dark:text-slate-700 mx-auto mb-3 opacity-60" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                      No Records Discovered
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-slate-500 max-w-xs mx-auto">
                      Adjust your global search or dropdown filter arrays to expose hidden node activities.
                    </p>
                  </div>
                ) : (
                  /* Redesigned Structural Ledger View Data Table */
                  <div className="w-full overflow-x-auto scrollbar-none">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/70 dark:bg-white/[0.01] border-b border-gray-100 dark:border-white/[0.04]">
                          <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                            Reference ID
                          </th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                            Activity Operation
                          </th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                            Timestamp Date
                          </th>
                          <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                            Status Matrix
                          </th>
                          <th className="p-4 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">
                            Net Value
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
                        {filteredTransactions.map((transaction) => {
                          const typeConfig = transactionTypes[transaction.type];
                          const statusConfig = statusTypes[transaction.status as keyof typeof statusTypes];
                          const TypeIcon = typeConfig.icon;
                          const isDebit = transaction.type === "withdrawal";

                          return (
                            <tr 
                              key={transaction.id}
                              className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors"
                            >
                              {/* Reference Code cell */}
                              <td className="p-4 align-middle text-xs font-mono font-bold tracking-tight text-slate-400 dark:text-slate-500">
                                #{transaction.reference}
                              </td>

                              {/* Main Label and Dynamic Categorization badge column */}
                              <td className="p-4 align-middle">
                                <div className="flex items-center gap-3">
                                  <div className={`w-8 h-8 rounded-lg ${typeConfig.bg} flex items-center justify-center shrink-0`}>
                                    <TypeIcon className={`w-4 h-4 ${typeConfig.color}`} />
                                  </div>
                                  <div>
                                    <div className="text-xs font-bold text-gray-900 dark:text-white">
                                      {transaction.description}
                                    </div>
                                    <div className="sm:hidden mt-0.5">
                                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${typeConfig.badge}`}>
                                        {typeConfig.label}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Clock timestamp configuration context column */}
                              <td className="p-4 align-middle whitespace-nowrap">
                                <div className="text-xs font-semibold text-gray-700 dark:text-slate-300">
                                  {formatDate(transaction.date)}
                                </div>
                                <div className="text-[10px] font-medium text-gray-400 dark:text-slate-500 mt-0.5">
                                  {transaction.time}
                                </div>
                              </td>

                              {/* Status Verification Badge column */}
                              <td className="p-4 align-middle whitespace-nowrap">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${statusConfig.badge}`}>
                                  <span className={`w-1 h-1 rounded-full ${statusConfig.color} bg-current`} />
                                  {statusConfig.label}
                                </span>
                              </td>

                              {/* Net calculated Ledger Volume Amount Column */}
                              <td className="p-4 align-middle text-right whitespace-nowrap">
                                <span className={`text-sm font-bold font-mono tracking-tight ${
                                  isDebit ? "text-red-500" : "text-emerald-500"
                                }`}>
                                  {isDebit ? "-" : "+"}${transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        <UserNav />
      </div>
    </div>
  );
}