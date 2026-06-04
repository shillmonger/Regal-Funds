"use client";

import React, { useState, useEffect, useRef } from "react";
import { Menu, ChevronDown, LogOut, User, Settings, Moon, Sun, Loader2, Bell } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ setSidebarOpen }: HeaderProps) {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isLoading = status === "loading";
  const fullName  = session?.user?.name  || "User";
  const firstName = fullName.split(" ")[0];
  const userEmail = session?.user?.email || "";
  const userInitial = firstName.charAt(0).toUpperCase();
  const avatar = (session as any)?.user?.avatar as string | undefined;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
        .header-root { font-family: 'Sora', sans-serif; }

        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        .dropdown-panel {
          animation: dropIn 0.18s ease forwards;
        }
      `}</style>

      <header
        className="header-root sticky top-0 z-20 flex items-center h-[60px] px-4 sm:px-6
                   bg-white dark:bg-[#080d17] 
                   border-b border-gray-200/80 dark:border-white/[0.06]
                   transition-colors duration-200"
      >
        <div className="flex w-full items-center justify-between">

          {/* ── Mobile menu trigger ── */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center
                       bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08]
                       hover:bg-gray-200 dark:hover:bg-white/[0.09]
                       transition-colors duration-150 cursor-pointer"
          >
            <Menu className="h-5 w-5 text-gray-600 dark:text-slate-300" />
          </button>

          {/* ── Right controls ── */}
          <div className="flex items-center gap-2 ml-auto">

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center
                         bg-gray-100 dark:bg-white/[0.05] border border-gray-200 dark:border-white/[0.08]
                         hover:bg-gray-200 dark:hover:bg-white/[0.09]
                         transition-all duration-150 cursor-pointer"
            >
              {darkMode
                ? <Sun className="h-4 w-4 text-white-500" />
                : <Moon className="h-4 w-4 text-gray-600" />
              }
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-gray-200 dark:bg-white/[0.08] mx-1" />

            {/* ── User section ── */}
            <div className="relative" ref={dropdownRef}>
              {isLoading ? (
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500 dark:text-emerald-400" />
                  <span className="hidden sm:inline text-xs text-gray-400 dark:text-slate-500">
                    Verifying session…
                  </span>
                </div>
              ) : (
                <>
                  {/* Trigger */}
                  <button
                    onClick={() => setDropdownOpen((p) => !p)}
                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl
                               hover:bg-gray-100 dark:hover:bg-white/[0.05]
                               transition-colors duration-150 cursor-pointer group"
                  >
                    {/* Avatar */}
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="avatar"
                        className="w-8  h-8 rounded-xl object-cover ring-2 ring-gray-200 dark:ring-white/10"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-violet-500
                                      flex items-center justify-center text-white text-xs font-bold
                                      shadow-md shadow-violet-500/10 dark:shadow-lg dark:shadow-violet-500/20 shrink-0">
                        {userInitial}
                      </div>
                    )}

                    {/* Name + email */}
                    <div className="hidden sm:flex flex-col items-start leading-tight">
                      <span className="text-[13px] font-semibold text-gray-800 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        {firstName}
                      </span>
                      <span className="text-[11px] text-gray-400 dark:text-slate-500 truncate max-w-[140px]">
                        {userEmail}
                      </span>
                    </div>

                    <ChevronDown
                      className={`hidden sm:block h-3.5 w-3.5 text-gray-400 dark:text-slate-500
                                  transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown */}
                  {dropdownOpen && (
                    <div
                      className="dropdown-panel absolute right-0 mt-2 w-60
                                 bg-white dark:bg-[#0f1623] border border-gray-200 dark:border-white/[0.08]
                                 rounded-2xl shadow-lg dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)]
                                 z-30 overflow-hidden"
                    >
                      {/* User info header */}
                      <div className="px-4 py-3.5 border-b border-gray-100 dark:border-white/[0.06]
                                      bg-gray-50/60 dark:bg-[#131b2b]">
                        <div className="flex items-center gap-3">
                          {avatar ? (
                            <img src={avatar} alt="avatar" className="w-9 h-9 rounded-xl object-cover" />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-violet-500
                                            flex items-center justify-center text-white text-sm font-bold shrink-0">
                              {userInitial}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {fullName}
                            </p>
                            <p className="text-[11px] text-gray-400 dark:text-slate-500 truncate mt-0.5">
                              {userEmail}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Links */}
                      <div className="p-2 space-y-0.5">
                        <Link href="/user-dashboard/profile" onClick={() => setDropdownOpen(false)}>
                          <button className="flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm
                                             text-gray-700 dark:text-slate-300
                                             hover:bg-gray-100 dark:hover:bg-white/[0.05]
                                             transition-colors duration-150 cursor-pointer">
                            <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center">
                              <User className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
                            </div>
                            Profile
                          </button>
                        </Link>

                        <Link href="/user-dashboard/settings" onClick={() => setDropdownOpen(false)}>
                          <button className="flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm
                                             text-gray-700 dark:text-slate-300
                                             hover:bg-gray-100 dark:hover:bg-white/[0.05]
                                             transition-colors duration-150 cursor-pointer">
                            <div className="w-7 h-7 rounded-lg bg-slate-500/10 flex items-center justify-center">
                              <Settings className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                            </div>
                            Account Settings
                          </button>
                        </Link>

                        <div className="h-px bg-gray-100 dark:bg-white/[0.06] my-1.5" />

                        <button
                          onClick={() => signOut({ callbackUrl: "/auth/login" })}
                          className="flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                                     text-red-600 dark:text-rose-400
                                     hover:bg-red-50 dark:hover:bg-rose-500/10
                                     transition-colors duration-150 cursor-pointer"
                        >
                          <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center">
                            <LogOut className="h-3.5 w-3.5 text-red-500 dark:text-rose-400" />
                          </div>
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}