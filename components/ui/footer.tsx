"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Footer() {
  // Inject GTranslate and Tawk.to scripts once on mount
  useEffect(() => {
    // ===== GTranslate =====
    const existingGTranslate = document.querySelector(
      'script[src="https://cdn.gtranslate.net/widgets/latest/float.js"]'
    );
    if (!existingGTranslate) {
      (window as any).gtranslateSettings = {
        default_language: "en",
        native_language_names: true,
        detect_browser_language: true,
        languages: [
          "en", "fr", "es", "de", "zh-CN", "ja", "ar", "ru", "pt", "it"
        ],
        wrapper_selector: ".gtranslate_wrapper",
        alt_flags: { en: "usa" },
      };

      const gScript = document.createElement("script");
      gScript.src = "https://cdn.gtranslate.net/widgets/latest/float.js";
      gScript.defer = true;
      document.body.appendChild(gScript);
    }

    // ===== Tawk.to =====
    const existingTawk = document.querySelector(
      'script[src^="https://embed.tawk.to/68f41472bc86f3194d62e65f"]'
    );
    if (!existingTawk) {
      const s1 = document.createElement("script");
      const s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = "https://embed.tawk.to/68f41472bc86f3194d62e65f/1j7smvodk";
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      s0.parentNode?.insertBefore(s1, s0);
    }
  }, []);

  return (
    <footer className="bg-[#3c4654] text-gray-200 text-xs sm:text-sm py-3 border-t border-gray-600">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4">
        {/* Left section */}
        <div className="mb-2 sm:mb-0">
          © {new Date().getFullYear()} REGAL FUNDS MANAGEMENT
        </div>

        {/* Center links */}
        <div className="flex space-x-6 mb-2 sm:mb-0">
          <Link
            href="/disclaimer"
            className="hover:underline hover:text-white transition"
          >
            DISCLAIMER
          </Link>
          <Link
            href="/privacy"
            className="hover:underline hover:text-white transition"
          >
            PRIVACY
          </Link>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          <span>SITE BY</span>
          <img
            src="https://www.regalfm.com/content/images/irm-logo-small-white.png"
            alt="IRM Logo"
            className="h-4 w-auto"
          />
        </div>
      </div>

      {/* GTranslate Widget (bottom-left corner) */}
      <div className="fixed bottom-6 left-6 z-50 bg-[#3c4654] border border-gray-600 rounded-md shadow-md p-2">
        <div className="gtranslate_wrapper"></div>
      </div>
    </footer>
  );
}



