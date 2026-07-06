"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "@/components/ui/user-sidebar";
import Header from "@/components/ui/user-header";
import UserNav from "@/components/ui/user-nav";
import LiveTrades from "@/components/ui/LiveTrades";
import { useSession } from "next-auth/react";
import {
  DollarSign,
  TrendingUp,
  Wallet,
  Users,
  Activity,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  accent: string;        // Tailwind bg class for icon well
  iconColor: string;     // Tailwind text class
  delay: string;
}

function StatCard({ label, value, sub, icon: Icon, accent, iconColor, delay }: StatCardProps) {
  return (
    <div
      className="stat-card group relative overflow-hidden rounded-2xl p-4 md:p-5
                 border border-gray-200/80 dark:border-white/[0.06] bg-white dark:bg-[#0f1623]
                 hover:border-gray-300 dark:hover:border-white/[0.12] hover:bg-gray-50/50 dark:hover:bg-[#131b2b]
                 transition-all duration-300 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.02)] dark:shadow-none"
      style={{ animationDelay: delay }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-2">
        <p className="text-[10px] md:text-[11px] font-semibold tracking-[0.12em] uppercase text-gray-400 dark:text-slate-400/80">
          {label}
        </p>
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent}
                      group-hover:scale-110 transition-transform duration-200`}
        >
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>

      {/* Value */}
      <p className="text-2xl md:text-[1.65rem] font-bold tracking-tight text-gray-900 dark:text-white leading-none mb-2">
        {value}
      </p>

      {/* Sub */}
      <p className="text-[11px] md:text-xs text-gray-500 dark:text-slate-500 font-medium">{sub}</p>
    </div>
  );
}

// ─── Activity Row ─────────────────────────────────────────────────────────────
function ActivityRow({ activity, index }: { activity: any; index: number }) {
  const when = activity.date
    ? new Date(activity.date).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
    : "—";
  const amount = Number(activity.amount || 0);
  const status = (activity.status || "pending").toLowerCase();
  const kind = activity.kind || "investment";

  const statusMap: Record<string, { label: string; className: string }> = {
    completed: { label: "Completed", className: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 border-emerald-200 dark:border-emerald-400/20" },
    approved:  { label: "Approved",  className: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10 border-emerald-200 dark:border-emerald-400/20" },
    active:    { label: "Active",    className: "text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-400/10 border-sky-200 dark:border-sky-400/20" },
    pending:   { label: "Pending",   className: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 border-amber-200 dark:border-amber-400/20" },
  };
  const { label: statusLabel, className: statusClass } =
    statusMap[status] ?? { label: status, className: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-400/10 border-rose-200 dark:border-rose-400/20" };

  const kindMap: Record<string, { label: string; icon: React.ElementType; bgClass: string; iconColor: string; amountColor: string; amountPrefix: string }> = {
    payment:     { label: "Payment",     icon: DollarSign, bgClass: "bg-violet-50 dark:bg-violet-500/10", iconColor: "text-violet-600 dark:text-violet-400", amountColor: "text-emerald-600 dark:text-emerald-400", amountPrefix: "+" },
    investment:  { label: "Investment",  icon: Activity,   bgClass: "bg-sky-50 dark:bg-sky-500/10",     iconColor: "text-sky-600 dark:text-sky-400",     amountColor: "text-emerald-600 dark:text-emerald-400", amountPrefix: "+" },
    withdrawal:  { label: "Withdrawal",  icon: ArrowUpRight, bgClass: "bg-rose-50 dark:bg-rose-500/10",   iconColor: "text-rose-600 dark:text-rose-400",   amountColor: "text-rose-600 dark:text-rose-400",   amountPrefix: "-" },
    referral:    { label: "Referral",    icon: Users,       bgClass: "bg-amber-50 dark:bg-amber-500/10", iconColor: "text-amber-600 dark:text-amber-400", amountColor: "text-emerald-600 dark:text-emerald-400", amountPrefix: "+" },
    roi:         { label: "ROI Earnings", icon: TrendingUp, bgClass: "bg-emerald-50 dark:bg-emerald-500/10", iconColor: "text-emerald-600 dark:text-emerald-400", amountColor: "text-emerald-600 dark:text-emerald-400", amountPrefix: "+" },
  };
  const { label: kindLabel, icon: KindIcon, bgClass, iconColor, amountColor, amountPrefix } =
    kindMap[kind] ?? kindMap.investment;

  return (
    <tr
      className="activity-row border-b border-gray-100 dark:border-white/[0.04] last:border-0
                 hover:bg-gray-50/40 dark:hover:bg-white/[0.025] transition-colors duration-150"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Icon */}
      <td className="py-4 pl-6 pr-3 w-12">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bgClass}`}>
          <KindIcon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </td>

      {/* Plan / type */}
      <td className="py-4 px-3">
        <p className="font-semibold text-sm text-gray-900 dark:text-white leading-snug">
          {activity.planName || "—"}
        </p>
        <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">
          {kindLabel}
        </p>
      </td>

      {/* Date */}
      <td className="py-4 px-3 text-xs text-gray-500 dark:text-slate-400 whitespace-nowrap sm:table-cell">
        {when}
      </td>

      {/* Status */}
      <td className="py-4 px-3 whitespace-nowrap">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg
                          text-[11px] font-semibold border capitalize ${statusClass}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
          {statusLabel}
        </span>
      </td>

      {/* Amount */}
      <td className="py-4 pl-3 pr-6 text-right font-bold text-sm text-gray-900 dark:text-white whitespace-nowrap">
        <span className={amountColor}>{amountPrefix} ${amount.toLocaleString()}</span>
      </td>
    </tr>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [stats, setStats] = useState({
    balance: 0,
    totalInvested: 0,
    activeInvestmentsCount: 0,
    totalEarnings: 0,
    earningsToday: 0,
    referralEarnings: 0,
    referralCount: 0,
  });
  const [loadingStats, setLoadingStats] = useState(false);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    setLoadingStats(true);
    fetch("/api/user/stats")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) =>
        setStats({
          balance: Number(data.balance) || 0,
          totalInvested: Number(data.totalInvested) || 0,
          activeInvestmentsCount: Number(data.activeInvestmentsCount) || 0,
          totalEarnings: Number(data.totalEarnings) || 0,
          earningsToday: Number(data.earningsToday) || 0,
          referralEarnings: Number(data.referralEarnings) || 0,
          referralCount: Number(data.referralCount) || 0,
        })
      )
      .finally(() => setLoadingStats(false));
  }, [status]);

  useEffect(() => {
    const flag = searchParams?.get("welcome");
    if (flag === "1") {
      toast.success("You just earned $5 welcome bonus 🎉");
      const url = new URL(window.location.href);
      url.searchParams.delete("welcome");
      router.replace(url.pathname + (url.search ? `?${url.searchParams.toString()}` : ""));
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    setLoadingActivity(true);
    fetch("/api/user/activity", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setRecentActivities(Array.isArray(data) ? data : []))
      .finally(() => setLoadingActivity(false));
  }, [status]);

  const fmt = (n: number) => (loadingStats ? "—" : `$${n.toLocaleString()}`);

  const statCards: StatCardProps[] = [
    {
      label: "Active Investments",
      value: fmt(stats.balance),
      sub: loadingStats
        ? "Loading…"
        : `Across ${stats.activeInvestmentsCount} ${stats.activeInvestmentsCount === 1 ? "plan" : "plans"}`,
      icon: Activity,
      accent: "bg-emerald-50 dark:bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      delay: "0ms",
    },
    {
      label: "Total Earnings",
      value: fmt(stats.totalEarnings),
      sub: loadingStats ? "Loading…" : `+$${stats.earningsToday.toLocaleString()} today`,
      icon: TrendingUp,
      accent: "bg-violet-50 dark:bg-violet-500/10",
      iconColor: "text-violet-600 dark:text-violet-400",
      delay: "60ms",
    },
    {
      label: "Total Invested",
      value: fmt(stats.totalInvested),
      sub: "Capital deployed",
      icon: DollarSign,
      accent: "bg-sky-50 dark:bg-sky-500/10",
      iconColor: "text-sky-600 dark:text-sky-400",
      delay: "120ms",
    },
    {
      label: "Referral Earnings",
      value: fmt(stats.referralEarnings),
      sub: loadingStats
        ? "Loading…"
        : `${stats.referralCount} ${stats.referralCount === 1 ? "referral" : "referrals"}`,
      icon: Users,
      accent: "bg-amber-50 dark:bg-amber-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
      delay: "180ms",
    },
  ];

  return (
    <>

      <div className="dashboard-root flex h-screen overflow-hidden bg-gray-50/50 dark:bg-[#080d17]">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header setSidebarOpen={setSidebarOpen} />

          <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-4 lg:p-6 pb-15 md:pb-8 mb-[50px] md:mb-0">

            {/* ── Welcome ── */}
            <div className="welcome-block mb-8 flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {/* <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" /> */}
                  <span className="text-[11px] font-semibold tracking-[0.15em] uppercase text-gray-400 dark:text-slate-500">
                    Investor Portal
                  </span>
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                  Welcome back,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-violet-600 dark:from-sky-400 dark:to-violet-400">
                    {session?.user?.name || "Investor"}
                  </span>
                </h1>
                <p className="text-gray-500 dark:text-slate-500 text-sm mt-1.5">
                  Here's a snapshot of your portfolio performance today.
                </p>
              </div>

              {/* Quick CTA */}
              <Link href="/user-dashboard/plan-details"> 
              <button
                className="hidden cursor-pointer md:flex items-center gap-2 px-4 py-2.5 rounded-xl
                           bg-white dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08] text-gray-700 dark:text-white text-sm font-medium shadow-sm dark:shadow-none
                           hover:bg-gray-50 dark:hover:bg-white/[0.09] hover:border-gray-300 dark:hover:border-white/[0.14] transition-all duration-200"
              >
                <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                New Investment
              </button>
              </Link>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
              {statCards.map((card) => (
                <StatCard key={card.label} {...card} />
              ))}
            </div>



            {/* ── Recent Activity ── */}
            <div
              className="rounded-2xl border border-gray-200/80 dark:border-white/[0.06] bg-white dark:bg-[#0f1623] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)] dark:shadow-none"
              style={{ animation: "fadeUp 0.5s ease 240ms both" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/[0.05]">
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                  <p className="text-xs text-gray-500 dark:text-slate-500 mt-0.5">Your latest transactions and updates</p>
                </div>
                <button
                  className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-slate-400
                             hover:text-gray-900 dark:hover:text-white transition-colors duration-150"
                >
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Body */}
              {loadingActivity ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-sky-500/20 border-t-sky-600 dark:border-sky-500/30 dark:border-t-sky-400 animate-spin" />
                  <p className="text-sm text-gray-500 dark:text-slate-500 font-medium">Fetching transactions…</p>
                </div>
              ) : recentActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/[0.04] flex items-center justify-center">
                    <Activity className="w-5 h-5 text-gray-400 dark:text-slate-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-600 dark:text-slate-400">No activity yet</p>
                  <p className="text-xs text-gray-400 dark:text-slate-600">Your transactions will appear here once you invest.</p>
                </div>
              ) : (
                <div className="thin-scroll w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[560px]">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-white/[0.04]">
                        {["", "Plan", "Date", "Status", "Amount"].map((h, i) => (
                          <th
                            key={i}
                            className={`py-3 text-[10px] font-bold tracking-[0.12em] uppercase text-gray-400 dark:text-slate-600
                                        ${i === 0 ? "pl-6 pr-3 w-12" : i === 4 ? "pl-3 pr-6 text-right" : "px-3"}`}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivities.map((a, i) => (
                        <ActivityRow key={a.id} activity={a} index={i} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>


          {/* Trading live market */}
                <div id="live-market">
                  <LiveTrades />
                </div>
          </main>
          

          <UserNav />
        </div>
      </div>
    </>
  );
}