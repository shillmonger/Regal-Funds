"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Wallet, Settings, User, GraduationCap } from "lucide-react";

export default function UserNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Payments", href: "/admin-dashboard/payments", icon: LayoutGrid },
    { name: "PAYOUTS", href: "/admin-dashboard/investment-payouts", icon: Wallet },
    { name: "ALL USER", href: "/admin-dashboard/user-management", icon: User },
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
        bg-white dark:bg-gray-900
        py-3 rounded-t-3xl 
        shadow-[0_-4px_20px_-2px_rgba(0,0,0,0.15)] 
        dark:shadow-[0_-4px_20px_-2px_rgba(0,0,0,0.4)]
        lg:hidden
      "
    >
      {navItems.map(({ name, href, icon: Icon }) => (
        <Link
          key={name}
          href={href}
          className={`
            flex flex-col items-center text-xs font-semibold transition-colors
            ${
              isActive(href)
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-gray-600 dark:text-gray-400 hover:text-emerald-500"
            }
          `}
        >
          <div
            className={`
              flex items-center justify-center 
              w-12 h-12 rounded-2xl mb-1 
              transition-all duration-300
              ${
                isActive(href)
                  ? "bg-emerald-500 dark:bg-emerald-500 text-white shadow-md shadow-black/20 dark:shadow-black/40"
                  : "bg-gray-100 dark:bg-gray-800"
              }
            `}
          >
            <Icon className="w-6 h-6" />
          </div>

          {name.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
