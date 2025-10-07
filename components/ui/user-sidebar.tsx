"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Layers,
  FileCheck,
  BarChart3,
  ArrowDownCircle,
  Users,
  Wallet,
  Clock,
  Settings,
  LogOut,
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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const basePath = "/user-dashboard";

  const sidebarItems = [
    { name: "Dashboard", icon: Home, href: `${basePath}/dashboard` },
    { name: "Investment Plans", icon: Layers, href: `${basePath}/plan-details` },
    { name: "Submit Payment Proof", icon: FileCheck, href: `${basePath}/submit-payment` },
    { name: "My Investments", icon: BarChart3, href: `${basePath}/investments` },
    { name: "Withdrawals", icon: ArrowDownCircle, href: `${basePath}/withdrawals` },
    { name: "Referral Program", icon: Users, href: `${basePath}/referrals` },
    { name: "Connect Wallet", icon: Wallet, href: `${basePath}/connect-wallet` },
    { name: "Overall Histery", icon: Clock, href: `${basePath}/histery` },
    { name: "Account Settings", icon: Settings, href: `${basePath}/settings` },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    router.push("/auth/login");
  };

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
              src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/dark%20logo.png"
              alt="Logo"
              className="h-10 w-auto block dark:hidden"
            />
            <img
              src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/light%20logo.png"
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
          {sidebarItems.map(({ name, icon: Icon, href }) => (
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

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center w-full px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-emerald-500 hover:text-white transition-colors duration-200 rounded-md"
          >
            <LogOut className="w-5 h-5 mr-2" /> Logout
          </button>
        </nav>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-80 p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Confirm Logout
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white transition"
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
