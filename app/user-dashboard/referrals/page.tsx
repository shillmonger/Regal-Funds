"use client";

import React, { useState } from "react";
import Sidebar from "@/components/ui/user-sidebar";
import Header from "@/components/ui/user-header";
import UserNav from "@/components/ui/user-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  DollarSign,
  Copy,
  CheckCircle,
  Share2,
  TrendingUp,
  Gift,
  Link2,
  Facebook,
  Twitter,
  Mail,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// User's referral data
const referralData = {
  referralCode: "KING2025",
  referralLink: "https://platform.com/ref/KING2025",
  totalReferrals: 0,
  activeReferrals: 0,
  totalEarnings: 0,
  pendingEarnings: 0,
  commissionRate: 0,
};

// Referral history (Your Referrals)
const referralHistory = [
  {
    id: 1,
    name: "John D.",
    joinDate: "2025-10-01",
    status: "active",
    investment: 5000,
    commission: 500,
    level: "Gold",
  },
  {
    id: 2,
    name: "Sarah M.",
    joinDate: "2025-09-28",
    status: "active",
    investment: 3000,
    commission: 300,
    level: "Silver",
  },
  {
    id: 3,
    name: "Mike T.",
    joinDate: "2025-09-25",
    status: "active",
    investment: 10000,
    commission: 1000,
    level: "Platinum",
  },
  {
    id: 4,
    name: "Emma W.",
    joinDate: "2025-09-20",
    status: "pending",
    investment: 0,
    commission: 0,
    level: "N/A",
  },
  {
    id: 5,
    name: "David K.",
    joinDate: "2025-09-15",
    status: "active",
    investment: 2000,
    commission: 200,
    level: "Silver",
  },
];

// Leaderboard data is removed as the component is no longer used

export default function ReferralsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

 // Copy to clipboard
const copyToClipboard = (text: string, type: "link" | "code"): void => {
  navigator.clipboard.writeText(text);

  if (type === "link") {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  } else {
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  }
};

// Share functions
const shareVia = (platform: "facebook" | "twitter" | "whatsapp" | "email"): void => {
  const text = `Join me on this amazing investment platform and start earning! Use my referral code: ${referralData.referralCode}`;
  const url = referralData.referralLink;

  switch (platform) {
    case "facebook":
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        "_blank"
      );
      break;
    case "twitter":
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
        "_blank"
      );
      break;
    case "whatsapp":
      window.open(
        `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
        "_blank"
      );
      break;
    case "email":
      window.location.href = `mailto:?subject=Join me on this investment platform&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
      break;
  }
};

// Format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};


  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Referrals Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-20 md:pb-8 mb-[50px] md:mb-0">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Referral Program 🎁
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Invite friends and earn {referralData.commissionRate}% commission on their investments
            </p>
          </div>

          {/* Statistics Cards */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
  {/* Card 1: Total Referrals */}
  <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
  <CardContent className="p-6">
      <div className="flex items-center justify-between mb-2">
        <Users className="w-8 h-8 opacity-80" />
        {/* Adjusted background color to match the primary theme */}
        <span className="text-xs bg-emerald-400/30 px-2 py-1 rounded-full">
          {referralData.activeReferrals} Active
        </span>
      </div>
      <p className="text-emerald-100 text-sm mb-1">Total Referrals</p>
      <p className="text-3xl font-bold">{referralData.totalReferrals}</p>
    </CardContent>
  </Card>

  {/* Card 2: Total Earnings */}
  <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
  <CardContent className="p-6">
      <div className="flex items-center justify-between mb-2">
        <DollarSign className="w-8 h-8 opacity-80" />
        <span className="text-xs bg-emerald-400/30 px-2 py-1 rounded-full">
          Rate: {referralData.commissionRate}%
        </span>
      </div>
      <p className="text-emerald-100 text-sm mb-1">Total Earnings</p>
      <p className="text-3xl font-bold">${referralData.totalEarnings.toLocaleString()}</p>
    </CardContent>
  </Card>

  {/* Card 3: Pending Earnings */}
  <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
  <CardContent className="p-6">
      <div className="flex items-center justify-between mb-2">
        <Gift className="w-8 h-8 opacity-80" />
      </div>
      <p className="text-emerald-100 text-sm mb-1">Pending Earnings</p>
      <p className="text-3xl font-bold">${referralData.pendingEarnings.toLocaleString()}</p>
    </CardContent>
  </Card>

  {/* Card 4: Commission Rate */}
  <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
  <CardContent className="p-6">
      <div className="flex items-center justify-between mb-2">
        <TrendingUp className="w-8 h-8 opacity-80" />
      </div>
      <p className="text-emerald-100 text-sm mb-1">Commission Rate</p>
      <p className="text-3xl font-bold">{referralData.commissionRate}%</p>
    </CardContent>
  </Card>
</div>

          {/* Main Content Grid: Now a single column for better flow */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column (Referral Link & Share, How It Works, Terms) - now takes up 1 column space */}
            <div className="space-y-6">
              {/* Referral Link Card */}
              <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 text-white">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Link2 className="w-5 h-5" />
                    Your Referral Link
                  </CardTitle>
                  <CardDescription className="text-emerald-100">
                    Share this link to earn commissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Referral Code */}
                  <div>
                    <p className="text-emerald-100 text-sm mb-2">Referral Code</p>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                      <code className="flex-1 font-mono text-lg font-bold">
                        {referralData.referralCode}
                      </code>
                      <button
                        onClick={() => copyToClipboard(referralData.referralCode, "code")}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
                      >
                        {copiedCode ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Referral URL */}
                  <div>
                    <p className="text-emerald-100 text-sm mb-2">Referral URL</p>
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                      <p className="flex-1 font-mono text-sm truncate">
                        {referralData.referralLink}
                      </p>
                      <button
                        onClick={() => copyToClipboard(referralData.referralLink, "link")}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition flex-shrink-0"
                      >
                        {copiedLink ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={() => copyToClipboard(referralData.referralLink, "link")}
                    className="w-full bg-white text-emerald-600 hover:bg-emerald-50 font-semibold py-6"
                  >
                    {copiedLink ? "Link Copied!" : "Copy Referral Link"}
                  </Button>
                </CardContent>
              </Card>

              {/* Share Options */}
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-emerald-500" />
                    Share Via
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Spread the word on social media
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => shareVia('facebook')}
                    className="flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                  >
                    <Facebook className="w-5 h-5" />
                    Facebook
                  </button>
                  <button
                    onClick={() => shareVia('twitter')}
                    className="flex items-center justify-center gap-2 p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition font-medium"
                  >
                    <Twitter className="w-5 h-5" />
                    Twitter
                  </button>
                  <button
                    onClick={() => shareVia('whatsapp')}
                    className="flex items-center justify-center gap-2 p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => shareVia('email')}
                    className="flex items-center justify-center gap-2 p-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition font-medium"
                  >
                    <Mail className="w-5 h-5" />
                    Email
                  </button>
                </CardContent>
              </Card>

              {/* How It Works */}
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">
                    How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          Share Your Link
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Send your unique referral link to friends and family
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          They Sign Up
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          New users register using your referral link
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                          You Earn {referralData.commissionRate}%
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Get {referralData.commissionRate}% commission on their initial investment
                        </p>
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              {/* Terms */}
              <Card className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-blue-900 dark:text-blue-100 text-base">
                    Program Rules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>Earn {referralData.commissionRate}% on first investment only</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>Minimum referral investment: $100</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>Commissions credited within 24 hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>No limit on number of referrals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>Fraud results in account suspension</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Your Referrals (Referral History) - now takes up 2 column space on large screens, or full width on small screens. */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Referral History (Your Referrals) */}
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">
                    Your Referrals
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Track all users who joined through your link
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {referralHistory.map((referral) => (
                      <div
                        key={referral.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                            {referral.name.split(' ').map(n => n[0]).join('')}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 dark:text-gray-100">
                              {referral.name}
                            </p>
                            {/* Date is visible on small screens */}
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Joined {formatDate(referral.joinDate)}
                            </p>
                          </div>
                        </div>

                        {/* Stats - Adjusted for better mobile responsiveness */}
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 sm:gap-4 flex-shrink-0">
                          
                          {/* Investment (Hidden on extra-small screens, shown on small screens and up) */}
                          <div className="text-right hidden sm:block">
                            <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                              Investment
                            </p>
                            <p className="font-bold text-gray-900 dark:text-gray-100 text-sm whitespace-nowrap">
                              {referral.investment > 0 ? `$${referral.investment.toLocaleString()}` : "-"}
                            </p>
                          </div>

                          {/* Commission (Key Metric, visible on all screens) */}
                          <div className="text-right">
                            <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                              Commission
                            </p>
                            <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm whitespace-nowrap">
                              {referral.commission > 0 ? `$${referral.commission.toLocaleString()}` : "Pending"}
                            </p>
                          </div>

                          {/* Status Badge (Key Metric, visible on all screens) */}
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            referral.status === "active"
                              ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
                              : "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300"
                          }`}>
                            {referral.status === "active" ? "Active" : "Pending"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <UserNav />
      </div>
    </div>
  );
}