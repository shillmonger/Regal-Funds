"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "ABOUT", href: "/landing-pages/about" },
    { name: "TEAM", href: "/landing-pages/team" },
    { name: "STRATEGIES", href: "/landing-pages/strategies" },
    { name: "CONTACT", href: "/landing-pages/contact" },
  ];

  const isActive = (href: string) => pathname === href;

  // ✅ Detect scroll only for logo swap
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#373E50] py-3 transition-all duration-300">
        <div className="px-4 sm:px-8 md:px-16 lg:px-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center">
              <img
                src={
                  isScrolled
                    ? "https://www.regalfm.com/content/images/regal_shield.png"
                    : "https://www.regalfm.com/irmcustomizationfile/574/regal_logo_inverte"
                }
                alt="Regal Funds Logo"
                className={`object-contain transition-all duration-300 ${
                  isScrolled ? "h-10" : "h-12"
                }`}
              />
            </div>
          </Link>

          {/* Desktop Links - Centered */}
          <div className="hidden lg:flex gap-8 xl:gap-12 absolute left-1/2 transform -translate-x-1/2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  isActive(link.href)
                    ? "text-white"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Login Button */}
          <div className="hidden lg:block">
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="bg-[#4a5866] hover:bg-[#5a6876] border-none text-white px-6 py-5 text-sm font-medium tracking-wide rounded-none transition-all"
              >
                INVESTOR LOGIN
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden text-white cursor-pointer z-[60]" // ensure hamburger always on top
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Sliding Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-full z-[70] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setIsOpen(false)}
        ></div>

        {/* Sliding Menu */}
        <div className="bg-[#373E50] h-full w-4/5 max-w-sm ml-auto shadow-xl p-6 flex flex-col relative">
          <button
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>

          {/* Links */}
          <div className="flex flex-col gap-6 mt-16">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base font-medium tracking-wide transition-colors ${
                  isActive(link.href)
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="flex flex-col gap-3 mt-8">
              <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                <Button className="cursor-pointer bg-[#4a5866] hover:bg-[#5a6876] border-none text-white w-full py-6 rounded-none text-sm tracking-wide">
                  INVESTOR LOGIN
                </Button>
              </Link>

              <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                <Button className="cursor-pointer bg-[#4a5866] hover:bg-[#5a6876] border-none text-white w-full py-6 rounded-none text-sm tracking-wide">
                  START INVESTING
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
