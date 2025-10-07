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

// ✅ Metadata
export const metadata: Metadata = {
  title: "cyberlearn",
  description: "Master Cybersecurity through hands-on learning",
  icons: {
    icon: "https://pub-8297b2aff6f242709e9a4e96eeb6a803.r2.dev/CyberYearn_favicon.png",
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
