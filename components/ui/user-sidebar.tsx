"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  Home,
  Layers,
  FileCheck,
  ArrowDownCircle,
  Users,
  Wallet,
  Clock,
  Settings,
  LogOut,
  X,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const navItems = [
  { name: "Dashboard",        icon: Home,           href: "/user-dashboard/dashboard"       },
  { name: "Choose Plan",      icon: Layers,         href: "/user-dashboard/plan-details"    },
  { name: "Connect Wallet",   icon: Wallet,         href: "/user-dashboard/connect-wallet"  },
  { name: "Referral Program", icon: Users,          href: "/user-dashboard/referrals"       },
  { name: "Overall History",  icon: Clock,          href: "/user-dashboard/histery"         },
  { name: "Withdraw Funds",      icon: ArrowDownCircle,href: "/user-dashboard/withdrawals"     },
  { name: "Account Settings", icon: Settings,       href: "/user-dashboard/settings"        },
  { name: "Logout My Account", icon: LogOut,       href: "/auth/login"},
];

// Dual-theme context-aware safe values
const accentMap: Record<string, { icon: string; bg: string; bar: string }> = {
  "Dashboard":        { icon: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", bar: "bg-emerald-500 dark:bg-emerald-400" },
  "Choose Plan":      { icon: "text-violet-600 dark:text-violet-400",   bg: "bg-violet-50 dark:bg-violet-500/10",   bar: "bg-violet-500 dark:bg-violet-400"   },
  "Connect Wallet":   { icon: "text-sky-600 dark:text-sky-400",       bg: "bg-sky-50 dark:bg-sky-500/10",         bar: "bg-sky-500 dark:bg-sky-400"         },
  "Referral Program": { icon: "text-amber-600 dark:text-amber-400",   bg: "bg-amber-50 dark:bg-amber-500/10",     bar: "bg-amber-500 dark:bg-amber-400"     },
  "Overall History":  { icon: "text-sky-600 dark:text-sky-400",       bg: "bg-sky-50 dark:bg-sky-500/10",         bar: "bg-sky-500 dark:bg-sky-400"         },
  "Withdraw Funds":      { icon: "text-rose-600 dark:text-rose-400",       bg: "bg-rose-50 dark:bg-rose-500/10",       bar: "bg-rose-500 dark:bg-rose-400"       },
  "Account Settings": { icon: "text-slate-600 dark:text-slate-400",     bg: "bg-slate-100 dark:bg-slate-500/10",    bar: "bg-slate-500 dark:bg-slate-400"     },
  "Switch to Admin":  { icon: "text-amber-600 dark:text-amber-400",   bg: "bg-amber-50 dark:bg-amber-500/10",     bar: "bg-amber-500 dark:bg-amber-400"     },
  "Logout My Account": {
    icon: "text-red-500 dark:text-rose-400",
    bg: "bg-red-50 dark:bg-rose-500/10",
    bar: "bg-red-500 dark:bg-rose-400",
  },
};

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [showAdmin, setShowAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const avatar = (session as any)?.user?.avatar as string | undefined;

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (status === "authenticated") {
      const role = (session?.user as any)?.role;
      setShowAdmin(role === "admin");
    } else if (status === "unauthenticated") {
      setShowAdmin(false);
    }
  }, [status, session]);

  const allItems = [
    ...navItems,
    ...(showAdmin
      ? [{ name: "Switch to Admin", icon: FileCheck, href: "/admin-dashboard/payments" }]
      : []),
  ];

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        .sidebar-root { font-family: 'Sora', sans-serif; }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .nav-item {
          opacity: 0;
          animation: slideIn 0.35s ease forwards;
        }
      `}</style>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 backdrop-blur-sm bg-black/20 dark:bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar-root
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          fixed inset-y-0 left-0 z-100
          w-[100%] sm:w-[65%] md:w-[55%] lg:w-65
          flex flex-col
          bg-white dark:bg-[#080d17]
          border-r border-gray-200/80 dark:border-white/[0.06]
          shadow-[4px_0_24px_rgba(0,0,0,0.04)] dark:shadow-[4px_0_32px_rgba(0,0,0,0.5)]
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0`}
      >
        {/* ── Logo bar ── */}
        <div className="flex items-center justify-between px-5 h-[60px] border-b border-gray-100 dark:border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2">
            {/* Light logo */}
            <img
              src="/images/dark-logo.png"
              alt="Logo"
              className="h-14 w-auto block dark:hidden object-contain"
            />
            {/* Dark logo */}
            <img
              src="https://www.regalfm.com/irmcustomizationfile/574/regal_logo_inverted"
              alt="Logo"
              className="h-9 w-auto hidden dark:block object-contain"
            />
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-8 h-8 rounded-xl flex items-center justify-center
                       bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08]
                       hover:bg-gray-200 dark:hover:bg-white/[0.09] transition-colors duration-150"
          >
            <X className="w-4 h-4 text-gray-500 dark:text-slate-400" />
          </button>
        </div>

        {/* ── Label ── */}
        <div className="px-5 pt-6 pb-3">
          <p className="text-[10px] font-semibold tracking-[0.14em] uppercase text-gray-400 dark:text-slate-600">
            Navigation
          </p>
        </div>

        {/* ── Nav ── */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto pb-6">
          {allItems.map(({ name, icon: Icon, href }, index) => {
            const active = isActive(href);
            const accent = accentMap[name] ?? accentMap["Account Settings"];

            return (
              <Link
                key={name}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`nav-item group relative flex items-center gap-3 px-3 py-2 rounded-xl
                            text-sm font-medium transition-all duration-200 border
                            ${active
                              ? "bg-gray-50 dark:bg-[#131b2b] border-gray-200/60 dark:border-white/[0.08] text-gray-900 dark:text-white"
                              : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.04] border-transparent"
                            }`}
                style={{ animationDelay: `${index * 45}ms` }}
              >
                {/* Icon well */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                              transition-all duration-200 group-hover:scale-105
                              ${active ? accent.bg : "bg-gray-100/70 dark:bg-white/[0.04] group-hover:" + accent.bg}`}
                >
                  <Icon className={`w-4 h-4 transition-colors ${active ? accent.icon : "text-gray-400 dark:text-slate-500 group-hover:" + accent.icon}`} />
                </div>

                <span className="truncate">{name}</span>

                {/* Active left bar */}
                {active && (
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full ${accent.bar}`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Footer user chip ── */}
        {mounted && status === "authenticated" && (
          <div className="px-4 pb-6 shrink-0">
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl
                            bg-gray-50 dark:bg-[#0f1623] border border-gray-200/60 dark:border-white/[0.06]">
              {avatar ? (
                <img
                  src={avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-xl object-cover ring-2 ring-gray-200 dark:ring-white/10"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-violet-500
                                flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                  {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate leading-tight">
                  {session?.user?.name ?? "Investor"}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-slate-500 truncate mt-0.5">
                  {session?.user?.email ?? ""}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}