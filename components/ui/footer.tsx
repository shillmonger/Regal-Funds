"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export default function Footer() {
  const [darkMode, setDarkMode] = useState(false);

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Inject GTranslate script once on mount
  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://cdn.gtranslate.net/widgets/latest/float.js"]'
    );
    if (existingScript) return;

    (window as any).gtranslateSettings = {
      default_language: "en",
      native_language_names: true,
      detect_browser_language: true,
      languages: [
        "af", "sq", "am", "ar", "hy", "az", "eu", "be", "bn", "bs", "bg", "ca",
        "ceb", "ny", "zh-CN", "zh-TW", "co", "hr", "cs", "da", "nl", "en", "eo",
        "et", "tl", "fi", "fr", "fy", "gl", "ka", "de", "el", "gu", "ht", "ha",
        "haw", "he", "hi", "hmn", "hu", "is", "ig", "id", "ga", "it", "ja", "jw",
        "kn", "kk", "km", "ko", "ku", "ky", "lo", "la", "lv", "lt", "lb", "mk",
        "mg", "ms", "ml", "mt", "mi", "mr", "mn", "my", "ne", "no", "ny", "or",
        "ps", "fa", "pl", "pt", "pa", "ro", "ru", "sm", "gd", "sr", "st", "sn",
        "sd", "si", "sk", "sl", "so", "es", "su", "sw", "sv", "tg", "ta", "te",
        "th", "tr", "uk", "ur", "uz", "vi", "cy", "xh", "yi", "yo", "zu"
      ],      
      wrapper_selector: ".gtranslate_wrapper",
      alt_flags: { en: "usa" },
    };

    const script = document.createElement("script");
    script.src = "https://cdn.gtranslate.net/widgets/latest/float.js";
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  // Toggle theme
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

  return (
    <footer className="bg-gray-900 text-gray-300 transition-colors border-t border-gray-800 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 lg:px-0 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
          {/* Brand */}
          <div className="md:max-w-sm">
            <Link href="/">
              <img
                src="https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/light%20logo.png"
                alt="CyberYearn Logo"
                className="h-11 w-auto"
              />
            </Link>
            <p className="text-[15px] text-gray-400 leading-relaxed mt-4">
              CyberYearn empowers your financial growth through secure cryptocurrency 
              trading and investment. Build wealth with cutting-edge technology and 
              transparent, trusted services.
            </p>
          </div>

          {/* Links wrapper */}
          <div className="flex flex-1 flex-col sm:flex-row justify-between gap-10">
            {/* Trading Services */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Trading</h3>
              <ul className="space-y-3">
                <li><Link href="/landing-pages/plans" className="hover:text-emerald-500 transition">Investment Plans</Link></li>
                <li><Link href="#" className="hover:text-emerald-500 transition">Market Analytics</Link></li>
                <li><Link href="#" className="hover:text-emerald-500 transition">Trading Signals</Link></li>
                <li><Link href="#" className="hover:text-emerald-500 transition">Referral Rewards</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Legal Pages</h3>
              <ul className="space-y-3">
                <li><Link href="/landing/legalpages/privacy" className="hover:text-emerald-500 transition">Privacy Policy</Link></li>
                <li><Link href="/landing/legalpages/terms" className="hover:text-emerald-500 transition">Terms of Service</Link></li>
                <li><Link href="/landing/legalpages/aup" className="hover:text-emerald-500 transition">Acceptable Use Policy</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
              <ul className="space-y-3">
                <li><Link href="/landing-pages/contact" className="hover:text-emerald-500 transition">Help Center</Link></li>
                <li><Link href="/landing-pages/contact" className="hover:text-emerald-500 transition">Contact Support</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom border */}
        <div className="border-t border-gray-800 pt-6 text-center md:text-left">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Cryptoinvest. All rights reserved.
          </p>
        </div>

        {/* Floating Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="fixed bottom-8 right-6 p-3 rounded-[10px] bg-gray-800 border border-gray-700 shadow-lg hover:border-emerald-500/40 hover:bg-gray-700 transition flex items-center justify-center z-50 cursor-pointer"
        >
          {darkMode ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-300" />
          )}
        </button>

        {/* GTranslate Widget */}
        <div
          className="fixed bottom-8 left-6 z-50 bg-gray-800 border border-gray-700 rounded-[10px] shadow-lg p-2"
        >
          <div className="gtranslate_wrapper"></div>
        </div>
      </div>
    </footer>
  );
}
