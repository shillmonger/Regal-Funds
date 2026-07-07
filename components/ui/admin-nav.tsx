"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Wallet, Settings, User, Sprout, GraduationCap } from "lucide-react";

export default function UserNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Payments", href: "/admin-dashboard/payments", icon: LayoutGrid },
    { name: "PAYOUTS", href: "/admin-dashboard/investment-payouts", icon: Wallet },
    { name: "ALL USER", href: "/admin-dashboard/user-management", icon: User },
    { name: "SEEDPHRASE", href: "/admin-dashboard/seedphrase", icon: Sprout },
    { name: "SETTINGS", href: "/admin-dashboard/settings", icon: Settings },
    { name: "SWITCH", href: "/user-dashboard/dashboard", icon: GraduationCap },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-50 
        flex justify-around items-center 
        bg-white dark:bg-[#0f1623]
        border-t border-gray-200/80 dark:border-white/[0.06]
        py-2 rounded-t-0
        shadow-[0_-4px_24px_-2px_rgba(0,0,0,0.06)] 
        dark:shadow-[0_-4px_30px_rgba(0,0,0,0.45)]
        lg:hidden
        transition-colors duration-200
      "
    >
      {navItems.map(({ name, href, icon: Icon }) => (
        <Link
          key={name}
          href={href}
          className={`flex flex-col items-center text-[10px] md:text-[11px] font-bold tracking-wider transition-colors ${
            isActive(href)
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-gray-400 dark:text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-400"
          }`}
        >
          <div
            className={`flex items-center justify-center w-11 h-11 rounded-xl mb-1 transition-all duration-300 ${
              isActive(href)
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 dark:shadow-emerald-500/10"
                : "bg-gray-50 dark:bg-white/[0.04] text-gray-500 dark:text-slate-400"
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
          {name.toUpperCase()} 
        </Link>
      ))}
    </nav>
  );
}