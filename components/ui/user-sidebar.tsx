"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  X,
} from "lucide-react";

// Theme colors (pulled from login page)
const primary = "#10B981";       // Emerald green
const primaryDarker = "#059669"; // Darker emerald (hover)

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  const basePath = "/user-dashboard";

  // Avoid hydration mismatch by only showing admin link after mount when session is known
  const [showAdmin, setShowAdmin] = useState(false);
  useEffect(() => {
    if (status === "authenticated") {
      const role = (session?.user as any)?.role;
      setShowAdmin(role === "admin");
    } else if (status === "unauthenticated") {
      setShowAdmin(false);
    }
  }, [status, session]);

  const sidebarItems = [
    { name: "Dashboard", icon: Home, href: `${basePath}/dashboard` },
    { name: "Investment Plans", icon: Layers, href: `${basePath}/plan-details` },
    { name: "Withdrawals", icon: ArrowDownCircle, href: `${basePath}/withdrawals` },
    { name: "Referral Program", icon: Users, href: `${basePath}/referrals` },
    { name: "Connect Wallet", icon: Wallet, href: `${basePath}/connect-wallet` },
    { name: "Overall Histery", icon: Clock, href: `${basePath}/histery` },
    { name: "Account Settings", icon: Settings, href: `${basePath}/settings` },
    // { name: "Submit Payment Proof", icon: FileCheck, href: `${basePath}/submit-payment` },
    // admin link is conditionally added below
  ];

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <>
      {/* Background Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 backdrop-blur-md bg-transparent lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-30 w-[85%] sm:w-[70%] md:w-[60%] lg:w-64 transform 
           bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 
           transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-xl`}
      >
        {/* Logo + Close */}
        <div className="flex items-center justify-between h-15 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <img
              src="https://www.regalfm.com/irmcustomizationfile/574/regal_logo_inverte"
              alt="Logo"
              className="h-10 w-auto block dark:hidden"
            />
            <img
              src="https://www.regalfm.com/irmcustomizationfile/574/regal_logo_inverte"
              alt="Logo"
              className="h-10 w-auto hidden dark:block"
            />
          </div>
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 py-6 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
          {[...sidebarItems, ...(showAdmin ? [{ name: "Switch to Admin", icon: FileCheck, href: "/admin-dashboard/payments" }] : [])].map(({ name, icon: Icon, href }) => (
            <Link
              key={name}
              href={href}
              className={`flex items-center px-3 py-2 rounded-md transition-colors duration-200 ${
                isActive(href)
                  ? `bg-emerald-50 dark:bg-gray-800 text-[${primary}] font-medium`
                  : `text-gray-700 dark:text-gray-200 hover:bg-emerald-500 hover:text-white`
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="w-5 h-5 mr-2" /> {name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}