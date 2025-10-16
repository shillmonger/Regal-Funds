"use client";

import React, { useEffect, useState } from "react";
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
import { toast } from "sonner";

type ReferralsMe = {
  referralCode: string;
  referralURL: string;
  totalReferrals: number;
  totalReferralEarnings: number;
};

export default function ReferralsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [ref, setRef] = useState<ReferralsMe | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const meRes = await fetch("/api/referrals/me", { cache: "no-store" });
        if (!meRes.ok) throw new Error("Failed to load referral info");
        const data = await meRes.json();
        setRef({
          referralCode: data.referralCode,
          referralURL: data.referralURL,
          totalReferrals: Number(data.totalReferrals) || 0,
          totalReferralEarnings: Number(data.totalReferralEarnings) || 0,
        });
      } catch (e: any) {
        toast.error(e?.message || "Unable to load referral info");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
    const code = ref?.referralCode || "";
    const url = ref?.referralURL || "";
    const text = `Join me on this amazing investment platform and start earning! Use my referral code: ${code}`;

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
              Share your unique referral link and earn $10 when your referral buys a plan.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-6 mb-8">
            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 opacity-80" />
                  <span className="text-xs bg-emerald-400/30 px-2 py-1 rounded-full">Referrals</span>
                </div>
                <p className="text-sm mb-1 text-gray-600 dark:text-gray-400">Total Referrals</p>
                <p className="text-3xl font-bold">{ref?.totalReferrals ?? 0}</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2"><DollarSign className="w-8 h-8 opacity-80" /></div>
                <p className="text-sm mb-1 text-gray-600 dark:text-gray-400">Total Earnings</p>
                <p className="text-3xl font-bold">{`$${(ref?.totalReferralEarnings ?? 0).toLocaleString()}`}</p>
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
                      <code className="flex-1 font-mono text-lg font-bold">{ref?.referralCode || (loading ? "Loading..." : "-")}</code>
                      <button
                        onClick={() => ref?.referralCode && copyToClipboard(ref.referralCode, "code")}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
                      >
                        {copiedCode ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-emerald-100 text-sm mb-2">Referral URL</p>
                    <div className="flex items-center gap-2 bg-white/20 p-3 rounded-lg">
                      <p className="flex-1 font-mono text-sm truncate">{ref?.referralURL || (loading ? "Loading..." : "-")}</p>
                      <button
                        onClick={() => ref?.referralURL && copyToClipboard(ref.referralURL, "link")}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
                      >
                        {copiedLink ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={() => ref?.referralURL && copyToClipboard(ref.referralURL, "link")}
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
                        <p className="font-medium text-gray-900 dark:text-gray-100">You Earn $10</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">When their first plan is approved.</p>
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
                    <li>• Earn $10 on your referral's first approved investment</li>
                    <li>• Minimum referral investment: $100</li>
                    <li>• Bonuses are credited after admin approval</li>
                    <li>• No limit on number of referrals</li>
                    <li>• Fraud results in account suspension</li>
                  </ul>
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
