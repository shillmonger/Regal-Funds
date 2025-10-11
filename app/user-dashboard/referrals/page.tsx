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

const referralData = {
  referralCode: "KING2025",
  referralLink: "https://platform.com/ref/KING2025",
  totalReferrals: 0,
  activeReferrals: 0,
  totalEarnings: 0,
  pendingEarnings: 0,
  commissionRate: 0,
};

export default function ReferralsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

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

  const shareVia = (platform: "facebook" | "twitter" | "whatsapp" | "email"): void => {
    const text = `Join me on this amazing investment platform and start earning! Use my referral code: ${referralData.referralCode}`;
    const url = referralData.referralLink;

    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, "_blank");
        break;
      case "email":
        window.location.href = `mailto:?subject=Join me on this investment platform&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
        break;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-20 md:pb-8 mb-[50px] md:mb-0">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Referral Program 🎁
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Invite friends and earn {referralData.commissionRate}% commission on their investments
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 opacity-80" />
                  <span className="text-xs bg-emerald-400/30 px-2 py-1 rounded-full">
                    {referralData.activeReferrals} Active
                  </span>
                </div>
                <p className="text-sm mb-1 text-gray-600 dark:text-gray-400">Total Referrals</p>
                <p className="text-3xl font-bold">{referralData.totalReferrals}</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-8 h-8 opacity-80" />
                  <span className="text-xs bg-emerald-400/30 px-2 py-1 rounded-full">
                    Rate: {referralData.commissionRate}%
                  </span>
                </div>
                <p className="text-sm mb-1 text-gray-600 dark:text-gray-400">Total Earnings</p>
                <p className="text-3xl font-bold">${referralData.totalEarnings.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <Gift className="w-8 h-8 opacity-80 mb-2" />
                <p className="text-sm mb-1 text-gray-600 dark:text-gray-400">Pending Earnings</p>
                <p className="text-3xl font-bold">${referralData.pendingEarnings.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <TrendingUp className="w-8 h-8 opacity-80 mb-2" />
                <p className="text-sm mb-1 text-gray-600 dark:text-gray-400">Commission Rate</p>
                <p className="text-3xl font-bold">{referralData.commissionRate}%</p>
              </CardContent>
            </Card>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Referral Link + Share Via */}
            <div className="space-y-6">
              {/* Referral Link */}
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
                  <div>
                    <p className="text-emerald-100 text-sm mb-2">Referral Code</p>
                    <div className="flex items-center gap-2 bg-white/20 p-3 rounded-lg">
                      <code className="flex-1 font-mono text-lg font-bold">{referralData.referralCode}</code>
                      <button
                        onClick={() => copyToClipboard(referralData.referralCode, "code")}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
                      >
                        {copiedCode ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-emerald-100 text-sm mb-2">Referral URL</p>
                    <div className="flex items-center gap-2 bg-white/20 p-3 rounded-lg">
                      <p className="flex-1 font-mono text-sm truncate">{referralData.referralLink}</p>
                      <button
                        onClick={() => copyToClipboard(referralData.referralLink, "link")}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
                      >
                        {copiedLink ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
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

              {/* Share Via */}
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
                  <button onClick={() => shareVia("facebook")} className="flex items-center justify-center gap-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium">
                    <Facebook className="w-5 h-5" /> Facebook
                  </button>
                  <button onClick={() => shareVia("twitter")} className="flex items-center justify-center gap-2 p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition font-medium">
                    <Twitter className="w-5 h-5" /> Twitter
                  </button>
                  <button onClick={() => shareVia("whatsapp")} className="flex items-center justify-center gap-2 p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium">
                    <MessageCircle className="w-5 h-5" /> WhatsApp
                  </button>
                  <button onClick={() => shareVia("email")} className="flex items-center justify-center gap-2 p-3 bg-gray-700 hover:bg-gray-800 text-white rounded-lg transition font-medium">
                    <Mail className="w-5 h-5" /> Email
                  </button>
                </CardContent>
              </Card>
            </div>

            {/* Right: How It Works + Program Rules */}
            <div className="space-y-6">
              {/* How It Works */}
              <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Share Your Link</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Send your referral link to friends and family.</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">They Sign Up</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">New users register using your referral link.</p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">You Earn {referralData.commissionRate}%</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Earn commissions on their initial investment.</p>
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              {/* Program Rules */}
              <Card className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-blue-900 dark:text-blue-100 text-base">Program Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                    <li>• Earn {referralData.commissionRate}% on first investment only</li>
                    <li>• Minimum referral investment: $100</li>
                    <li>• Commissions credited within 24 hours</li>
                    <li>• No limit on number of referrals</li>
                    <li>• Fraud results in account suspension</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <UserNav />
      </div>
    </div>
  );
}
