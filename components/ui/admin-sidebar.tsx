"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  Sprout,
  Settings,
  LogOut,
  GraduationCap,
  Briefcase,
  Wallet,
  X,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

// Dual-theme context-aware safe values mapped to Admin keys
const accentMap: Record<string, { icon: string; bg: string; bar: string }> = {
  "All Payments": { icon: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", bar: "bg-emerald-500 dark:bg-emerald-400" },
  "Role Settings": { icon: "text-slate-600 dark:text-slate-400", bg: "bg-slate-100 dark:bg-slate-500/10", bar: "bg-slate-500 dark:bg-slate-400" },
  "User Management": { icon: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-500/10", bar: "bg-violet-500 dark:bg-violet-400" },
  "View Seedphrase": { icon: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", bar: "bg-amber-500 dark:bg-amber-400" },
  "Investment Payouts": { icon: "text-sky-600 dark:text-sky-400", bg: "bg-sky-50 dark:bg-sky-500/10", bar: "bg-sky-500 dark:bg-sky-400" },
  "Switch to Investor": { icon: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", bar: "bg-amber-500 dark:bg-amber-400" },
};

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const basePath = "/admin-dashboard";

  const sidebarItems = [
    { name: "All Payments", icon: Wallet, href: `${basePath}/payments` },
    { name: "User Management", icon: Users, href: `${basePath}/user-management` },
    { name: "View Seedphrase", icon: Sprout, href: `${basePath}/seedphrase` },
    { name: "Investment Payouts", icon: Briefcase, href: `${basePath}/investment-payouts` },
    { name: "Users Role Settings", icon: Settings, href: `${basePath}/settings` },
    { name: "Switch to Investor", icon: GraduationCap, href: `/user-dashboard/dashboard` },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    router.push("/auth/login");
  };

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
          className="fixed inset-0 z-100 backdrop-blur-sm bg-black/10 dark:bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar-root
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          fixed inset-y-0 left-0 z-100
          w-[85%] sm:w-[65%] md:w-[55%] lg:w-65
          flex flex-col
          bg-white dark:bg-[#080d17]
          border-r border-gray-200/80 dark:border-white/[0.06]
          shadow-[4px_0_24px_rgba(0,0,0,0.04)] dark:shadow-[4px_0_32px_rgba(0,0,0,0.5)]
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0`}
      >
        {/* ── Logo bar ── */}
        <div className="flex items-center justify-between px-5 h-[60px] border-b border-gray-100 dark:border-white/[0.06] shrink-0">
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

        {/* ── Nav Items ── */}
        <nav className="flex-1 px-3 space-y-0 overflow-y-auto py-6">
          {sidebarItems.map(({ name, icon: Icon, href }, index) => {
            const active = isActive(href);
            const accent = accentMap[name] ?? accentMap["Role Settings"];

            return (
              <Link
                key={name}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`nav-item group relative flex items-center gap-3 px-3 py-2 rounded-lg
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

        {/* ── Fixed Red Logout Section at the Bottom ── */}
        <div className="p-4 border-t border-gray-100 dark:border-white/[0.06] bg-white dark:bg-[#080d17] shrink-0">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border border-transparent text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-red-50 dark:bg-red-500/10 group-hover:bg-red-100 dark:group-hover:bg-red-500/20 transition-all duration-200">
              <LogOut className="w-4 h-4 text-red-500 dark:text-red-400" />
            </div>
            <span className="truncate text-left">Logout My Account</span>
          </button>
        </div>
      </aside>

      {/* ── Logout Confirmation Modal ── */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/40 backdrop-blur-sm sidebar-root">
          <div className="bg-white dark:bg-[#0f1623] border border-gray-100 dark:border-white/[0.06] rounded-2xl shadow-xl w-80 p-6 text-center animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Confirm Logout
            </h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-white/[0.05] text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-white/[0.08] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-red-600 hover:bg-red-700 text-white transition shadow-sm shadow-red-600/10"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}