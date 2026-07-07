"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu, ChevronDown, LogOut, User, Settings, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function AdminHeader({ setSidebarOpen }: HeaderProps) {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync theme setup cleanly
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDark = savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return (
      <header className="sticky top-0 z-20 flex items-center h-16 px-4 sm:px-6 bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900 shadow-sm font-sora">
        <div className="flex w-full items-center justify-between animate-pulse">
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-800 rounded" />
          <div className="h-9 w-9 bg-gray-200 dark:bg-gray-800 rounded-full" />
        </div>
      </header>
    );
  }

  const fullName = session?.user?.name || "Admin User";
  const firstName = fullName.split(" ")[0];
  const userEmail = session?.user?.email || "admin@email.com";
  const userInitial = firstName.charAt(0).toUpperCase();
  const avatar = (session as any)?.user?.avatar as string | undefined;

  return (
    <header className="sticky top-0 z-20 flex items-center h-15 px-4 sm:px-6 bg-white dark:bg-[#080d17]
          border-r border-gray-200/80 dark:border-white/[0.06] border-b border-gray-100 dark:border-gray-900 shadow-sm transition-all duration-300 font-sora">
      <div className="flex w-full items-center justify-between">
        
        {/* Sidebar Toggle (Mobile Only) */}
        <button
          className="lg:hidden p-2 -ml-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100 transition-colors focus:outline-none"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Branding/Title Section */}
        {/* <h1 className="text-base font-semibold tracking-tight text-gray-900 dark:text-gray-50 hidden sm:block">
          Admin Panel
        </h1> */}

        {/* Right Side Control Panel */}
        <div className="flex items-center gap-3 ml-auto">
          
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border cursor-pointer border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-all focus:outline-none"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="h-[18px] w-[18px] text-amber-500 fill-amber-500/10" />
            ) : (
              <Moon className="h-[18px] w-[18px] text-gray-600 fill-gray-600/5" />
            )}
          </button>

          {/* User Options Dropdown Trigger */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2.5 p-1.5 pr-2.5 cursor-pointer rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-all focus:outline-none group"
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt="Admin profile"
                  className="w-8 h-8 rounded-xl object-cover ring-2 ring-gray-100 dark:ring-gray-900 group-hover:ring-gray-200 dark:group-hover:ring-gray-800 transition-all"
                />
              ) : (
                <div className="w-8 h-8 bg-[#507800] rounded-xl flex items-center justify-center text-white text-xs font-semibold shadow-sm shadow-[#507800]/20">
                  {userInitial}
                </div>
              )}
              
              <span className="hidden sm:block text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                {firstName}
              </span>
              <ChevronDown 
                className={`hidden sm:block h-3.5 w-3.5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180 text-gray-600 dark:text-gray-300" : ""
                }`} 
              />
            </button>

            {/* Dropdown Action Panel */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-60 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-900 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none z-30 origin-top-right transition-all animate-in fade-in slide-in-from-top-2 duration-150 ease-out divide-y divide-gray-50 dark:divide-gray-900">
                
                {/* Meta Profile Identity */}
                <div className="px-4 py-3.5">
                  <p className="text-xs font-semibold text-gray-900 dark:text-gray-50 truncate">
                    {fullName}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate mt-0.5">
                    {userEmail}
                  </p>
                </div>

                {/* Dashboard Options */}
                <div className="p-1.5 space-y-0.5">
                  <Link href="/admin-dashboard/profile" className="block">
                    <button 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center w-full px-3 py-2 text-xs font-medium rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                      <User className="h-3.5 w-3.5 mr-2.5 text-gray-400 dark:text-gray-500" /> 
                      Profile Setup
                    </button>
                  </Link>

                  <Link href="/admin-dashboard/settings" className="block">
                    <button 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center w-full px-3 py-2 text-xs font-medium rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                      <Settings className="h-3.5 w-3.5 mr-2.5 text-gray-400 dark:text-gray-500" /> 
                      Role Settings
                    </button>
                  </Link>
                </div>

                {/* Session Lifecycle Management */}
                <div className="p-1.5">
                  <button
                    onClick={() => signOut({ callbackUrl: "/auth/login" })}
                    className="flex items-center w-full px-3 py-2 text-xs font-medium rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50/60 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-2.5" /> 
                    Secure Logout
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}