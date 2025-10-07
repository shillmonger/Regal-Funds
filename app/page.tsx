"use client";

import Link from "next/link";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
// Image is imported but not necessary here, keeping it for completeness if used elsewhere
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Shield,
  Activity,
  Zap,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { UserPlus, TrendingUp, Wallet } from "lucide-react";

// Steps data (OK)
const stepsData = [
  {
    icon: UserPlus,
    title: "Create Account!",
    description:
      "Quick registration in minutes. Get instant access to our platform and all features!",
  },
  {
    icon: TrendingUp,
    title: "Fund & Trade!",
    description:
      "After registration is complete, add funds and start trading to grow your earnings!",
  },
  {
    icon: Wallet,
    title: "Collect Earnings!",
    description:
      "Success! Access your earnings from your balance whenever you need, instantly!",
  },
];

// Supported Crypto Logos
const cryptoLogos = [
  { name: "Bitcoin", url: "/images/coin1.png" },
  { name: "Ethereum", url: "/images/coin2.png" },
  { name: "Tether", url: "/images/coin3.png" },
  { name: "BNB", url: "/images/coin4.png" },
  { name: "Solana", url: "/images/coin5.png" },
  { name: "Cardano", url: "/images/coin6.png" },
  { name: "Ripple", url: "/images/coin7.png" },
  { name: "Polkadot", url: "/images/coin8.png" },
  { name: "Dogecoin", url: "/images/coin9.png" },
  { name: "USDC", url: "/images/coin10.png" },
];

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  // Type assertion for useRef to ensure it targets an HTMLDivElement
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Scroll function (OK)
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollTo({
        left:
          scrollContainerRef.current.scrollLeft +
          (direction === "left" ? -scrollAmount : scrollAmount),
        behavior: "smooth",
      });
    }
  };

  // REMOVED: export default function SupportedCrypto() { ... }
  // This function was incorrectly defined inside the Home component.

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 py-16 sm:py-20">
        <div className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-left sm:text-center">
            Gateway to <span className="text-emerald-500">Smart Trading</span>
            <br />
            In the Digital Economy
          </h1>

          <p
            className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-3xl leading-relaxed 
   text-left sm:text-center sm:mx-auto"
          >
            Experience next-generation trading with our secure, high-speed
            platform. We combine institutional-grade technology with
            user-friendly tools to make cryptocurrency trading accessible,
            transparent, and trustworthy.
          </p>

          <div className="flex flex-col-reverse sm:flex-row gap-4 justify-center w-full">
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-[15px] sm:text-lg font-medium cursor-pointer"
              >
                Start Trading
              </Button>
            </Link>
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border border-emerald-500 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-950 hover:bg-emerald-500/10 dark:hover:bg-emerald-400/10 hover:text-gray-900 dark:hover:text-white px-8 py-6 text-[15px] sm:text-lg font-medium cursor-pointer"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Shield,
              title: "Advanced Protection",
              description:
                "Your account is protected with cutting-edge blockchain encryption and high-performance infrastructure.",
            },
            {
              icon: Activity,
              title: "Live Market Access",
              description:
                "Experience institutional-grade trading tools with global market connectivity and expert-level features.",
            },
            {
              icon: Zap,
              title: "Instant Processing",
              description:
                "Seamless deposits and withdrawals with rapid processing times to keep your capital moving efficiently.",
            },
            {
              icon: DollarSign,
              title: "Competitive Rates",
              description:
                "Maximize your returns with reduced trading fees and transparent pricing structure.",
            },
          ].map(({ icon: Icon, title, description }, i) => (
            <Card
              key={i}
              className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 
                          hover:-translate-y-2 transition text-center cursor-pointer"
            >
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <Icon className="h-8 w-8 text-emerald-500" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-400 leading-relaxed text-base sm:text-lg">
                  {description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Investment Disclaimer */}
        <div className="w-full bg-emerald-50 dark:bg-gray-900 border border-emerald-200 dark:border-emerald-700 mt-16 rounded-2xl">
          <Card className="w-full border-0 bg-transparent shadow-none">
            <CardHeader className="pb-0">
              <CardTitle className="flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-lg font-semibold">
                Investment Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-emerald-700 dark:text-emerald-400 leading-relaxed max-w-5xl">
                This platform provides access to cryptocurrency-based investment
                opportunities. All investments carry inherent risks, and past
                performance does not guarantee future results. Users are
                strongly advised to conduct their own research before investing.
                We do not offer financial advice — participation is entirely at
                your own discretion.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Supported Cryptocurrencies */}
        <section className="pt-15 bg-white dark:bg-gray-950">
          <div className="max-w-full mx-auto sm:px-6 md:px-12 lg:px-0">
            <div className="text-center mb-5">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Supported Currencies
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Trade with confidence across multiple digital assets
              </p>
            </div>

            {/* Sliding Container */}
            <div className="relative overflow-hidden">
              {/* Gradient overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-gray-950 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-gray-950 to-transparent z-10 pointer-events-none"></div>

              {/* Scrolling content */}
              <div className="flex animate-scroll">
                {/* First set of logos */}
                {cryptoLogos.map((crypto, index) => (
                  <div
                    key={`first-${index}`}
                    className="flex-shrink-0 mx-0 sm:mx-3 flex items-center justify-center"
                  >
                    <Image
                      src={crypto.url}
                      alt={crypto.name}
                      width={100}
                      height={100}
                      className="h-25 w-25x sm:h-30 sm:w-30 object-contain grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-emerald-500 hover:shadow-lg rounded-lg"
                    />
                  </div>
                ))}

                {/* Duplicate set for seamless loop */}
                {cryptoLogos.map((crypto, index) => (
                  <div
                    key={`first-${index}`}
                    className="flex-shrink-0 mx-0 sm:mx-3 flex items-center justify-center"
                  >
                    <Image
                      src={crypto.url}
                      alt={crypto.name}
                      width={100}
                      height={100}
                      className="h-25 w-25x sm:h-30 sm:w-30 object-contain grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer hover:ring-2 hover:ring-emerald-500 hover:shadow-lg rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }

            .animate-scroll {
              animation: scroll 15s linear infinite; /* ⏩ Faster speed */
              width: 200%; /* Double the width to hold duplicated content */
            }

            /* Pause on hover for desktop users */
            .animate-scroll:hover {
              animation-play-state: paused;
            }

            /* Responsive tweak: even faster on small screens */
            @media (max-width: 768px) {
              .animate-scroll {
                animation-duration: 10s; /* ⚡ Faster on mobile */
              }
            }

            /* Hide scrollbar but keep scrollable */
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
