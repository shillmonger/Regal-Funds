"use client";

import Link from "next/link";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { useEffect } from "react";
import {
  Youtube,
  Twitter,
  Send,
  ShieldCheck,
  Activity,
  Cpu
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

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
      'script[src^="https://embed.tawk.to/6a5d0489096ab21d402a81a6"]'
    );
    if (!existingTawk) {
      const s1 = document.createElement("script");
      const s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = "https://embed.tawk.to/6a5d0489096ab21d402a81a6/1jttljesl";
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      s0.parentNode?.insertBefore(s1, s0);
    }
  }, []);

  const socialLinks = [
    { name: "Telegram", icon: <Send size={20} />, href: "https://t.me/+cX9cZuER651hOGZk" },
    { name: "SiWhatsapp", icon: <SiWhatsapp size={20} />, href: "https://wa.me/43688879937235" },
    { name: "X (Twitter)", icon: <Twitter size={20} />, href: "#" },
    { name: "YouTube", icon: <Youtube size={20} />, href: "#" },
  ];

  return (
    <footer className="bg-[#373E50] border-t border-gray-600 text-gray-200 pb-10 pt-10 px-4 md:px-16 relative">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 md:gap-8 lg:gap-24">
        
        {/* Logo + Platform Description */}
        <div className="flex flex-col space-y-6 md:col-span-4 lg:col-span-2">
          <div>
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-[220px] h-[45px]">
                <Image
                  src="https://www.regalfm.com/irmcustomizationfile/574/regal_logo_inverte"
                  alt="REGAL INVESTMENT Logo"
                  fill
                  className="object-contain object-left"
                  priority
                  unoptimized
                />
              </div>
            </Link>
            <p className="mt-5 leading-relaxed text-gray-300 max-w-lg text-sm sm:text-[17px]">
              Regal Funds Management is a multi-award winning specialist alternatives investment manager, pioneering the hedge fund, private markets and alternatives industry in Australia since 2004.
            </p>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-4">
              Join Our Community
            </h3>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="p-3 bg-gray-700/50 rounded-lg hover:bg-white hover:text-[#3c4654] transition-all duration-300 shadow-sm border border-gray-600"
                  title={social.name}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Investor Area */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-[15px] font-bold uppercase tracking-tight text-white">Investor Area</h3>
          <ul className="space-y-2 text-gray-300 text-xs sm:text-[15px]">
            <li><Link href="/landing-pages/strategies" className="hover:text-white hover:underline transition-colors">Investment Strategies</Link></li>
            <li><Link href="/landing-pages/about" className="hover:text-white hover:underline transition-colors">About Us</Link></li>
            <li><Link href="/landing-pages/team" className="hover:text-white hover:underline transition-colors">Our Team</Link></li>
            <li><Link href="/landing-pages/contact" className="hover:text-white hover:underline transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-[15px] font-bold uppercase tracking-tight text-white">Company</h3>
          <ul className="space-y-2 text-gray-300 text-xs sm:text-[15px]">
            <li><Link href="/landing-pages/about#regal-partners" className="hover:text-white hover:underline transition-colors">Regal Partners (ASX:RPL)</Link></li>
            <li><Link href="/landing-pages/about#news" className="hover:text-white hover:underline transition-colors">News & Insights</Link></li>
            <li><Link href="/landing-pages/strategies" className="hover:text-white hover:underline transition-colors">Our Strategies</Link></li>
            <li><Link href="/landing-pages/team" className="hover:text-white hover:underline transition-colors">Leadership Team</Link></li>
          </ul>
        </div>

        {/* Our Pages */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-[15px] font-bold uppercase tracking-tight text-white">
            Legal
          </h3>
          <ul className="space-y-2 text-gray-300 text-xs sm:text-[15px]">
            <li><Link href="/auth/login" className="hover:text-white hover:underline transition-colors">Investor Login</Link></li>
            <li><Link href="/auth/register" className="hover:text-white hover:underline transition-colors">Investor Register</Link></li>
            <li><Link href="/landing-pages/contact" className="hover:text-white hover:underline transition-colors">Contact Support</Link></li>
          </ul>
        </div>
      </div>

      {/* Financial Disclaimer */}
      <div className="max-w-[1400px] mx-auto mt-10 space-y-8 text-[12px] leading-relaxed text-gray-400 border-t border-gray-600 pt-12">
        <div className="space-y-4">
          <p className="text-[13px]">
            <span className="font-bold text-white">RISK DISCLOSURE:</span> Investing in alternative investment strategies carries a high level of risk and may not be suitable for all investors. Before deciding to invest with Regal Funds Management, you should carefully consider your investment objectives, level of experience, and risk appetite. Past performance is not indicative of future results.
          </p>

          <p className="text-[15px]">
            Regal Funds Management is a specialist alternatives investment manager. We do not guarantee specific returns, and investors should only invest capital they can afford to lose. The value of investments can go up as well as down.
          </p>
        </div>

        <div className="space-y-2 border-t border-gray-600/40 pt-8">
          <p className="font-bold text-white uppercase tracking-widest text-[13px]">
            Regulatory Compliance
          </p>
          <p className="text-[15px]">
            Regal Partners Limited (ASX: RPL) is the parent company of Regal Funds Management, VGI Partners, Kilter Rural, and Taurus Funds Management. We adhere to strict regulatory requirements and maintain high standards of corporate governance. All data is encrypted via SSL protocols.
          </p>
        </div>
      </div>

      {/* Final Copyright */}
      <div className="max-w-[1400px] mx-auto border-t border-gray-600 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-300">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
          <p>© {new Date().getFullYear()} Regal Funds Management — Alternative Investment Excellence.</p>
        </div>
        <p className="italic text-xs text-center md:text-right max-w-md opacity-60">
          All investments carry risk. Regal Funds Management is a licensed investment manager.
          Use of this site constitutes acceptance of our Risk Disclosure.
        </p>
      </div>

      {/* GTranslate Widget (bottom-left corner) */}
      <div className="fixed bottom-6 left-6 z-50 bg-[#373E50] border border-gray-600 rounded-md shadow-md p-2">
        <div className="gtranslate_wrapper"></div>
      </div>

    </footer>
  );
}