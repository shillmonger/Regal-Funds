"use client";

import React, { useState } from "react";
import Sidebar from "@/components/ui/user-sidebar";
import Header from "@/components/ui/user-header";
import UserNav from "@/components/ui/user-nav";
import { useRouter } from "next/navigation";
import Link from "next/link";


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DollarSign,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ColorKey = keyof typeof colorSchemes;

interface InvestmentTier {
  min: number;
  max: number;
  planId: number;
  planName: string;
  roi: number;
  duration: number;
  color: ColorKey;
  perks: string[];
}

const investmentTiers: InvestmentTier[] = [
  {
    min: 200,
    max: 999,
    planId: 1,
    planName: "Starter Plan",
    roi: 10,
    duration: 30,
    color: "blue",
    perks: [
      "Daily ROI payouts",
      "24/7 customer support",
      "Basic market insights",
    ],
  },
  {
    min: 1000,
    max: 4999,
    planId: 2,
    planName: "Silver Plan",
    roi: 10,
    duration: 30,
    color: "emerald",
    perks: [
      "Higher daily ROI",
      "Priority customer support",
      "Advanced market analysis",
      "Dedicated account manager",
    ],
  },
  {
    min: 5000,
    max: 9999,
    planId: 3,
    planName: "Gold Plan",
    roi: 10,
    duration: 30,
    color: "purple",
    perks: [
      "Premium ROI rates",
      "VIP customer support",
      "Expert trading signals",
      "Personal investment advisor",
      "Referral bonus boost",
    ],
  },
  {
    min: 10000,
    max: 24999,
    planId: 4,
    planName: "Platinum Plan",
    roi: 10,
    duration: 30,
    color: "orange",
    perks: [
      "Maximum ROI potential",
      "White-glove support",
      "Institutional-grade analytics",
      "Exclusive investment opportunities",
      "Enhanced referral commissions",
      "Quarterly profit sharing",
    ],
  },
  {
    min: 25000,
    max: 50000,
    planId: 5,
    planName: "Diamond Plan",
    roi: 10,
    duration: 30,
    color: "amber",
    perks: [
      "Highest ROI guarantee",
      "Concierge investment service",
      "Custom trading strategies",
      "Direct access to fund managers",
      "Premium events invitations",
      "Profit share in platform growth",
      "Priority withdrawal processing",
    ],
  },
];

const colorSchemes = {
  blue: {
    bg: "bg-blue-50/40 dark:bg-blue-950/10",
    border: "border-blue-200/80 dark:border-blue-900/40",
    text: "text-blue-600 dark:text-blue-400",
    button: "bg-blue-600 hover:bg-blue-500 text-white",
  },
  emerald: {
    bg: "bg-emerald-50/40 dark:bg-emerald-950/10",
    border: "border-emerald-200/80 dark:border-emerald-900/40",
    text: "text-emerald-600 dark:text-emerald-400",
    button: "bg-emerald-600 hover:bg-emerald-500 text-white",
  },
  purple: {
    bg: "bg-purple-50/40 dark:bg-purple-950/10",
    border: "border-purple-200/80 dark:border-purple-900/40",
    text: "text-purple-600 dark:text-purple-400",
    button: "bg-purple-600 hover:bg-purple-500 text-white",
  },
  orange: {
    bg: "bg-orange-50/40 dark:bg-orange-950/10",
    border: "border-orange-200/80 dark:border-orange-900/40",
    text: "text-orange-600 dark:text-orange-400",
    button: "bg-orange-600 hover:bg-orange-500 text-white",
  },
  amber: {
    bg: "bg-amber-50/40 dark:bg-amber-950/10",
    border: "border-amber-200/80 dark:border-amber-900/40",
    text: "text-amber-600 dark:text-amber-400",
    button: "bg-amber-600 hover:bg-amber-500 text-white",
  },
};

export default function InvestmentPlansPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState<number | string>("");
  const router = useRouter();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setInvestmentAmount("");
      return;
    }
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setInvestmentAmount(numValue);
    }
  };

  const minAmount = 200;
  const maxAmount = 50000;
  const currentAmount = Number(investmentAmount) || 0;
  const isValidAmount = currentAmount >= minAmount && currentAmount <= maxAmount;

  const matchingTier = investmentTiers.find(
    (tier) => currentAmount >= tier.min && currentAmount <= tier.max
  );

  const handleInvest = () => {
    if (!isValidAmount || !matchingTier) return;
    router.push(`/user-dashboard/plan-details/${matchingTier.planId}?amount=${currentAmount}`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50 dark:bg-[#080d17] transition-colors duration-200">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-15 md:pb-8 mb-[50px] md:mb-0">
          
          {/* Header Layout */}
          <div className="max-w-6xl mx-auto mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Smart Investment Portal
              </h1>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                Enter your investment amount to unlock tier-based benefits and maximize your returns.
              </p>
            </div>
          </div>

          {/* Smart Investment Input Section */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Investment Input Card */}
            <Card className="bg-white dark:bg-[#0f1623] border border-gray-200/80 dark:border-white/[0.06] rounded-2xl p-6 shadow-sm">
              <div className="mb-5 pb-4 border-b border-gray-100 dark:border-white/[0.04]">
                <CardTitle className="text-lg font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                  Dynamic Investment Allocator
                </CardTitle>
                <CardDescription className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  Enter your investment amount to discover your tier and unlock exclusive benefits.
                </CardDescription>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="investment-amount" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">
                    Investment Amount (USD)
                  </Label>
                  <Input
                    id="investment-amount"
                    type="number"
                    min={minAmount}
                    max={maxAmount}
                    placeholder="Enter amount"
                    value={investmentAmount}
                    onChange={handleAmountChange}
                    className="w-full h-11 px-3.5 text-sm bg-gray-50/50 dark:bg-white/[0.01] border border-gray-200 dark:border-white/[0.06] text-gray-900 dark:text-white rounded-xl focus-visible:ring-2 focus-visible:ring-emerald-500/20"
                  />
                </div>

                {investmentAmount && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/[0.04] rounded-xl">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">ROI Rate</span>
                      <span className="text-sm font-bold text-emerald-500">
                        {matchingTier ? `${matchingTier.roi}%` : "-"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/[0.04] rounded-xl">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">Dur</span>
                      <span className="text-sm font-bold text-gray-800 dark:text-slate-200">
                        {matchingTier ? `${matchingTier.duration} Days` : "-"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    onClick={handleInvest}
                    disabled={!isValidAmount}
                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-40"
                  >
                    {matchingTier ? `Invest $${currentAmount.toLocaleString()} - ${matchingTier.planName}` : "Enter Valid Amount"}
                  </Button>
                  {!isValidAmount && investmentAmount && (
                    <p className="text-[11px] text-red-500 font-medium italic mt-2.5">
                      * Investment amount must be between ${minAmount.toLocaleString()} and ${maxAmount.toLocaleString()}.
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Dynamic Perks Display Card */}
            <Card className="bg-white dark:bg-[#0f1623] border border-gray-200/80 dark:border-white/[0.06] rounded-2xl p-6 shadow-sm">
              <div className="mb-5 pb-4 border-b border-gray-100 dark:border-white/[0.04]">
                <CardTitle className="text-lg font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  Tier Benefits Preview
                </CardTitle>
                <CardDescription className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  {matchingTier
                    ? `You qualify for ${matchingTier.planName} benefits`
                    : "Enter an amount to see your tier benefits"}
                </CardDescription>
              </div>

              <div className="space-y-3">
                {matchingTier ? (
                  <>
                    <div className={`p-3 rounded-xl border ${colorSchemes[matchingTier.color].bg} ${colorSchemes[matchingTier.color].border}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold uppercase tracking-wider ${colorSchemes[matchingTier.color].text}`}>
                          Your Tier: {matchingTier.planName}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-slate-400">
                        Investment Range: ${matchingTier.min.toLocaleString()} - ${matchingTier.max.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-3">
                        Allocation Perks
                      </h4>
                      <ul className="space-y-2">
                        {matchingTier.perks.map((perk, index) => (
                          <li key={index} className="flex items-start gap-2 text-xs text-gray-600 dark:text-slate-400">
                            <CheckCircle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${colorSchemes[matchingTier.color].text}`} />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Enter your investment amount to unlock tier benefits
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>


          {/* Bottom Info Banner Assistance Card */}
          <div className="max-w-6xl mx-auto">
            <Card className="bg-gradient-to-r from-emerald-50/30 to-blue-50/30 dark:from-slate-900/40 dark:to-slate-900/20 border border-emerald-100 dark:border-white/[0.04] rounded-2xl overflow-hidden shadow-sm">
              <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Need Strategy Assistance?
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 leading-relaxed max-w-2xl">
                    Our technical node fund monitoring advisors remain available 24/7/365 to evaluate your capital track constraints or select customized institutional pools.
                  </p>
                </div>
                <Link href="https://t.me/+cX9cZuER651hOGZk">
                  <Button className="h-11 px-6 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm shrink-0 whitespace-nowrap cursor-pointer">
                    Contact Support Node
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

        </main>

        <UserNav />
      </div>
    </div>
  );
}