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
  Gift,
  Link2,
  Facebook,
  Twitter,
  Mail,
  MessageCircle,
  AlertCircle,
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
      toast.success("Referral URL link copied to clipboard");
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedCode(true);
      toast.success("Referral code copied to clipboard");
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
    <div className="flex h-screen overflow-hidden bg-gray-50/50 dark:bg-[#080d17] transition-colors duration-200">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-15 md:pb-8 mb-[50px] md:mb-0">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-1.5">
              Affiliate Program
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Invite your network circles and secure direct rewards on verified system plans
            </p>
          </div>

          {/* Stats Section - Grid 2 on mobile */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8">
            <Card className="bg-white dark:bg-[#0f1623] border border-gray-200/80 dark:border-white/[0.06] shadow-sm">
              <CardContent className="p-4 md:p-6 flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-3 md:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Users className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="min-w-0 w-full">
                  <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white truncate">
                    {loading ? "..." : (ref?.totalReferrals ?? 0)}
                  </p>
                  <p className="text-gray-400 dark:text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-0.5 truncate">Total Referrals</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-[#0f1623] border border-gray-200/80 dark:border-white/[0.06] shadow-sm">
              <CardContent className="p-4 md:p-6 flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-3 md:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <DollarSign className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="min-w-0 w-full">
                  <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white truncate">
                    {loading ? "..." : `$${(ref?.totalReferralEarnings ?? 0).toLocaleString()}`}
                  </p>
                  <p className="text-gray-400 dark:text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-0.5 truncate">Total Earnings</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Link Hub & Direct Sharing Options */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Primary Invitation Module */}
              <Card className="bg-white dark:bg-[#0f1623] border border-gray-200/80 dark:border-white/[0.06] shadow-sm overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/10 flex items-center justify-center rounded-xl text-emerald-600 dark:text-emerald-400">
                      <Link2 className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900 dark:text-white font-bold">
                        Invitation Credentials
                      </CardTitle>
                      <CardDescription className="text-xs text-gray-500 dark:text-slate-400">
                        Distribute these tokens to downline registrants to bind accounts
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-5">
                  {/* Code Snippet Box */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2.5">
                      Unique Code Token
                    </label>
                    <div className="flex items-center justify-between gap-3 p-3.5 bg-gray-50 dark:bg-white/[0.01] border border-gray-200 dark:border-white/[0.06] rounded-xl">
                      <code className="font-mono text-base font-bold tracking-wider text-gray-800 dark:text-slate-200 pl-1">
                        {loading ? "Retrieving token..." : (ref?.referralCode || "-")}
                      </code>
                      <button
                        type="button"
                        disabled={loading || !ref?.referralCode}
                        onClick={() => ref?.referralCode && copyToClipboard(ref.referralCode, "code")}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-white/[0.04] hover:bg-gray-100 dark:hover:bg-white/[0.08] border border-gray-200 dark:border-white/[0.08] text-gray-600 dark:text-slate-400 transition-colors cursor-pointer shrink-0 disabled:opacity-40"
                      >
                        {copiedCode ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* URL Snippet Box */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2.5">
                      Target Hyperlink Link
                    </label>
                    <div className="flex items-center justify-between gap-3 p-3.5 bg-gray-50 dark:bg-white/[0.01] border border-gray-200 dark:border-white/[0.06] rounded-xl">
                      <p className="font-mono text-xs text-gray-500 dark:text-slate-400 truncate pl-1 select-all">
                        {loading ? "Constructing secure url..." : (ref?.referralURL || "-")}
                      </p>
                      <button
                        type="button"
                        disabled={loading || !ref?.referralURL}
                        onClick={() => ref?.referralURL && copyToClipboard(ref.referralURL, "link")}
                        className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-white/[0.04] hover:bg-gray-100 dark:hover:bg-white/[0.08] border border-gray-200 dark:border-white/[0.08] text-gray-600 dark:text-slate-400 transition-colors cursor-pointer shrink-0 disabled:opacity-40"
                      >
                        {copiedLink ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    disabled={loading || !ref?.referralURL}
                    onClick={() => ref?.referralURL && copyToClipboard(ref.referralURL, "link")}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-6 rounded-xl text-sm font-bold tracking-wide transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
                  >
                    {copiedLink ? "Link Copied Successfully!" : "Copy Full Referral Link"}
                  </Button>
                </CardContent>
              </Card>

              {/* Social Channels Sheet */}
              <Card className="bg-white dark:bg-[#0f1623] border border-gray-200/80 dark:border-white/[0.06] shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 flex items-center justify-center rounded-xl text-blue-600 dark:text-blue-400">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold text-gray-900 dark:text-white">
                        Instant Network Sharing
                      </CardTitle>
                      <CardDescription className="text-xs text-gray-500 dark:text-slate-400">
                        Broadcast links cleanly via major external communication loops
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <button onClick={() => shareVia("facebook")} className="flex items-center justify-center gap-2 p-3 bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer">
                    <Facebook className="w-4 h-4" /> Facebook
                  </button>
                  <button onClick={() => shareVia("twitter")} className="flex items-center justify-center gap-2 p-3 bg-sky-500/90 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer">
                    <Twitter className="w-4 h-4" /> Twitter
                  </button>
                  <button onClick={() => shareVia("whatsapp")} className="flex items-center justify-center gap-2 p-3 bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer">
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </button>
                  <button onClick={() => shareVia("email")} className="flex items-center justify-center gap-2 p-3 bg-slate-700/90 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer">
                    <Mail className="w-4 h-4" /> Email
                  </button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Walkthrough Guide & Policy Protocol */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Pipeline Flow Guide */}
              <Card className="bg-white dark:bg-[#0f1623] border border-gray-200/80 dark:border-white/[0.06] shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-gray-900 dark:text-white">
                    Program Workflow Layout
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative space-y-5 pl-2">
                    {/* Vertical connector line */}
                    <div className="absolute left-[15px] top-2 bottom-2 w-[1px] bg-gray-100 dark:bg-white/[0.06]" />

                    <div className="relative flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/10 relative z-10 bg-white dark:bg-[#0f1623]">1</div>
                      <div className="min-w-0 pt-0.5">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-0.5">Share Credentials</h4>
                        <p className="text-[11px] text-gray-400 dark:text-slate-500 leading-normal">Publish your unique tracking code metadata out to prospective peers.</p>
                      </div>
                    </div>

                    <div className="relative flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/10 relative z-10 bg-white dark:bg-[#0f1623]">2</div>
                      <div className="min-w-0 pt-0.5">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-0.5">Downline Registration</h4>
                        <p className="text-[11px] text-gray-400 dark:text-slate-500 leading-normal">Invited prospects execute full account creation profiles linked to your node key.</p>
                      </div>
                    </div>

                    <div className="relative flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/10 relative z-10 bg-white dark:bg-[#0f1623]">3</div>
                      <div className="min-w-0 pt-0.5">
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white mb-0.5">Unlock Bonus Credits</h4>
                        <p className="text-[11px] text-gray-400 dark:text-slate-500 leading-normal">Gain an immediate flat **$10 cash injection** as soon as their initial plan allocation clears.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Policy Terms Card */}
              <Card className="bg-blue-500/[0.02] border border-blue-500/10 shadow-none rounded-xl">
                <CardHeader className="py-4">
                  <CardTitle className="text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-2 uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4" />
                    Affiliate Code of Conduct
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  <ul className="space-y-2 text-xs text-gray-500 dark:text-slate-400 leading-normal">
                    <li className="flex items-start gap-1.5">• Earn $10 on your referral's first approved investment</li>
                    <li className="flex items-start gap-1.5">• Minimum qualification threshold: downline purchase must equal or exceed $100</li>
                    <li className="flex items-start gap-1.5">• Settlement clearance: allocated bonuses activate immediately upon admin panel confirmation loops</li>
                    <li className="flex items-start gap-1.5">• Multi-accounting clusters or artificial syndicating results in permanent wallet lockup</li>
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