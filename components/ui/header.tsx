"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/" },
    { name: "Contact Us", href: "/landing-pages/contact" },
    { name: "About Us", href: "/landing-pages/about" },
    { name: "Investment Plans", href: "/landing-pages/plans" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Navbar */}
      <nav className="px-4 sm:px-8 md:px-20 py-4 flex items-center justify-between bg-white dark:bg-gray-950">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2">
            {/* Light mode logo */}
            <img
              src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/dark%20logo.png"
              alt="Logo"
              className="h-10 sm:h-10 md:h-12 w-auto block dark:hidden"
            />
            {/* Dark mode logo */}
            <img
              src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/light%20logo.png"
              alt="Logo"
              className="h-10 sm:h-10 md:h-12 w-auto hidden dark:block"
            />
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden min-[950px]:flex gap-8 font-medium text-gray-900 dark:text-gray-100">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:text-emerald-500 hover:underline underline-offset-4 transition-colors ${
                isActive(link.href) ? "text-emerald-500 underline" : ""
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden min-[950px]:flex [@media(max-width:1150px)]:hidden gap-4">
          <Link href="/auth/login" className="w-full sm:w-auto">
  <Button
    variant="outline"
    className="w-full sm:w-auto border border-emerald-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-950 hover:bg-emerald-500/10 dark:hover:bg-emerald-400/10 hover:text-gray-900 dark:hover:text-white px-5 py-5 text-[14px] sm:text-base font-medium cursor-pointer"
  >
    Sign In
  </Button>
</Link>

<Link href="/auth/register" className="w-full sm:w-auto">
  <Button
    className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-5 text-[14px] sm:text-base font-medium cursor-pointer"
  >
    Start Investing
  </Button>
</Link>

        </div>

        {/* Mobile Hamburger */}
        <button
          className="min-[950px]:hidden text-gray-900 dark:text-gray-100 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Gradient Divider */}
      <div className="max-w-7xl mx-auto">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent"></div>
      </div>

      {/* Mobile Sliding Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-full z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/30"
          onClick={() => setIsOpen(false)}
        ></div>

        {/* Sliding Menu */}
        <div className="bg-white dark:bg-gray-950 h-full w-full shadow-xl p-6 flex flex-col relative">
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 text-gray-900 dark:text-gray-100 hover:text-emerald-500 transition"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>

          {/* Links */}
          <div className="flex flex-col gap-5 mt-16">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors duration-200 text-gray-900 dark:text-gray-100 ${
                  isActive(link.href)
                    ? "text-emerald-500 underline"
                    : "text-[15px] hover:text-emerald-600"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

           {/* Auth Buttons */}
<div className="flex flex-col gap-3 mt-8">
  {/* Sign In */}
  <Link href="/auth/login" onClick={() => setIsOpen(false)}>
    <Button
     className="cursor-pointer bg-emerald-500 hover:bg-emerald-600 
                 text-white w-full py-5 rounded-md text-[15px]"
    >
      
      Sign In
    </Button>
  </Link>

  {/* Start Learning */}
  <Link href="/auth/register" onClick={() => setIsOpen(false)}>
    <Button
     className="cursor-pointer border border-emerald-500 
                 bg-white dark:bg-white 
                 text-gray-900 dark:text-gray-900 
                 hover:bg-emerald-500/10 dark:hover:bg-emerald-400/10 
                 hover:text-gray-900 dark:hover:text-white 
                 w-full py-5 rounded-md text-[15px]"
    >
      Sign up
    </Button>
  </Link>

  {/* Forgotten Password */}
  <Link href="/auth/forgot-password" onClick={() => setIsOpen(false)}>
    <Button
      className="cursor-pointer bg-emerald-500 hover:bg-emerald-600 
                 text-white w-full py-5 rounded-md text-[15px]"
    >
      Forgotten Password
    </Button>
  </Link>
</div>

          </div>
        </div>
      </div>
    </>
  );
}
