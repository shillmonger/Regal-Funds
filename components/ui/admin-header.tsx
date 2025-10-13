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

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
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

  // Close dropdown when clicking outside
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
      <header className="p-4 text-gray-500 dark:text-gray-400 text-sm">
        Loading admin data...
      </header>
    );
  }

  const fullName = session?.user?.name || "Admin User";
  const firstName = fullName.split(" ")[0];
  const userEmail = session?.user?.email || "admin@email.com";
  const userInitial = firstName.charAt(0).toUpperCase();
  const avatar = (session as any)?.user?.avatar as string | undefined;

  return (
    <header className="sticky top-0 z-20 flex items-center h-16 px-4 sm:px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      <div className="flex w-full items-center justify-between">
        {/* Sidebar Toggle (Mobile) */}
        <button
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>

        {/* Admin Panel title */}
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 hidden sm:block">
          Admin Panel
        </h1>

        {/* Right side controls */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* Profile dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center space-x-2 focus:outline-none cursor-pointer"
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt="Admin avatar"
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 bg-[#507800] rounded-full flex items-center justify-center text-white font-medium">
                  {userInitial}
                </div>
              )}
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">
                {firstName}
              </span>
              <ChevronDown className="hidden sm:block h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-30">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {fullName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{userEmail}</p>
                </div>

                <Link href="/admin-dashboard/profile">
                  <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">
                    <User className="h-4 w-4 mr-2" /> Profile
                  </button>
                </Link>

                <Link href="/admin-dashboard/settings">
                  <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">
                    <Settings className="h-4 w-4 mr-2" /> Role Settings
                  </button>
                </Link>

                <button
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
