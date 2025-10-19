import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import { Toaster } from "sonner";
import { Suspense } from "react";

// ✅ Fonts setup
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Enhanced Metadata (SEO + OG + Twitter)
export const metadata: Metadata = {
  title: "Regal Investmentz | Earn Daily Returns with Smart Investments",
  description:
    "Invest from $100 and earn 10% daily returns for 30 days. Start building your wealth with Regal Investmentz today.",
  icons: {
    icon: "https://www.regalfm.com/content/images/regal_shield.png",
  },
  openGraph: {
    title: "Regal Investmentz",
    description: "Smart investment platform with daily returns.",
    url: "https://regalinvestmentz.com",
    siteName: "Regal Investmentz",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Regal Investmentz",
    description: "Smart investment platform with daily returns.",
  },
};

// ✅ Root Layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {/* ⚡ Suspense prevents build-time errors for useSearchParams() & dynamic hooks */}
          <Suspense fallback={<div className="p-6 text-center text-gray-400">Loading...</div>}>
            {children}
          </Suspense>

          {/* 🔔 Toast notifications */}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
