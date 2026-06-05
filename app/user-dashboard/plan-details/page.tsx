"use client";

import React, { useState } from "react";
import Sidebar from "@/components/ui/user-sidebar";
import Header from "@/components/ui/user-header";
import UserNav from "@/components/ui/user-nav";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ColorKey = keyof typeof colorSchemes;
interface Plan {
  id: number;
  name: string;
  minInvestment: number;
  maxInvestment: number | null;
  roi: number;
  duration: number;
  description: string;
  category: "short" | "medium" | "long";
  perks: string[];
  recommended: boolean;
  color: ColorKey;
}

const investmentPlans: Plan[] = [
  {
    id: 1,
    name: "Starter Plan",
    minInvestment: 100,
    maxInvestment: 999,
    roi: 10,
    duration: 30,
    description: "Perfect for beginners looking to start their crypto investment journey",
    category: "short",
    perks: [
      "Daily ROI payouts",
      "24/7 customer support",
      "Basic market insights",
      "Withdraw anytime after 30 days",
    ],
    recommended: false,
    color: "blue",
  },
  {
    id: 2,
    name: "Silver Plan",
    minInvestment: 1000,
    maxInvestment: 4999,
    roi: 10,
    duration: 30,
    description: "Ideal for growing your portfolio with balanced risk and returns",
    category: "medium",
    perks: [
      "Higher daily ROI",
      "Priority customer support",
      "Advanced market analysis",
      "Dedicated account manager",
      "Withdraw anytime after 30 days",
    ],
    recommended: false,
    color: "emerald",
  },
  {
    id: 3,
    name: "Gold Plan",
    minInvestment: 5000,
    maxInvestment: 9999,
    roi: 10,
    duration: 30,
    description: "Premium plan for serious investors seeking substantial growth",
    category: "medium",
    perks: [
      "Premium ROI rates",
      "VIP customer support",
      "Expert trading signals",
      "Personal investment advisor",
      "Referral bonus boost",
      "Withdraw anytime after 30 days",
    ],
    recommended: true,
    color: "purple",
  },
  {
    id: 4,
    name: "Platinum Plan",
    minInvestment: 10000,
    maxInvestment: 24999,
    roi: 10,
    duration: 30,
    description: "Elite plan with maximum returns for high-value investors",
    category: "long",
    perks: [
      "Maximum ROI potential",
      "White-glove support",
      "Institutional-grade analytics",
      "Exclusive investment opportunities",
      "Enhanced referral commissions",
      "Quarterly profit sharing",
      "Withdraw anytime after 30 days",
    ],
    recommended: false,
    color: "orange",
  },
  {
    id: 5,
    name: "Diamond Plan",
    minInvestment: 25000,
    maxInvestment: 50000,
    roi: 10,
    duration: 30,
    description: "Ultimate investment package for portfolio maximization",
    category: "long",
    perks: [
      "Highest ROI guarantee",
      "Concierge investment service",
      "Custom trading strategies",
      "Direct access to fund managers",
      "Premium events invitations",
      "Profit share in platform growth",
      "Priority withdrawal processing",
      "Withdraw anytime after 30 days",
    ],
    recommended: false,
    color: "amber",
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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [customAmount, setCustomAmount] = useState<number | string>(100);
  const router = useRouter();

  const filteredPlans = investmentPlans.filter(
    (plan) => selectedCategory === "all" || plan.category === selectedCategory
  );

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setCustomAmount("");
      return;
    }
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setCustomAmount(numValue);
    }
  };

  const minAmount = 100;
  const currentCustomAmount = Number(customAmount) || 0;
  const isCustomPlanValid = currentCustomAmount >= minAmount;

  const matchingPlan = investmentPlans.find(
    (plan) =>
      currentCustomAmount >= plan.minInvestment &&
      (plan.maxInvestment === null || currentCustomAmount <= plan.maxInvestment)
  );

  const isCoveredByPlan = !!matchingPlan;
  const customROI = isCoveredByPlan ? null : 10;
  const customDuration = isCoveredByPlan ? null : 30;

  const handleSelectPlan = (id: number) => {
    router.push(`/user-dashboard/plan-details/${id}`);
  };

  const handleCustomInvest = () => {
    if (!isCustomPlanValid) return;
    if (matchingPlan) {
      router.push(`/user-dashboard/plan-details/${matchingPlan.id}`);
    } else {
      router.push(`/user-dashboard/plan-details/custom?amount=${currentCustomAmount}`);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50 dark:bg-[#080d17] transition-colors duration-200">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-24 md:pb-8 mb-[50px] md:mb-0">
          
          {/* Header Layout */}
          <div className="max-w-6xl mx-auto mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Investment Plans
              </h1>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                Choose the perfect asset portfolio track to maximize financial growth yields.
              </p>
            </div>

            {/* Filter Dropdown Option matching global components style */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 bg-white dark:bg-[#0f1623] border border-gray-200 dark:border-white/[0.06] rounded-xl text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-slate-300 px-4 flex items-center gap-2">
                  Category: {selectedCategory}
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white dark:bg-[#0f1623] border border-gray-100 dark:border-white/[0.06] rounded-xl shadow-lg p-1 min-w-[140px]">
                {["all", "short", "medium", "long"].map((cat) => (
                  <DropdownMenuItem
                    key={cat}
                    onSelect={() => setSelectedCategory(cat)}
                    className={`cursor-pointer px-3 py-2 text-xs font-semibold rounded-lg uppercase tracking-wider ${
                      selectedCategory === cat ? "bg-gray-50 dark:bg-white/[0.04] text-emerald-500" : "text-gray-600 dark:text-slate-400"
                    }`}
                  >
                    {cat}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Core Plans Grid Layout */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredPlans.map((plan) => {
              const colors = colorSchemes[plan.color];
              return (
                <Card
                  key={plan.id}
                  className="relative overflow-hidden border border-gray-200/80 dark:border-white/[0.06] bg-white dark:bg-[#0f1623] rounded-2xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
                >
                  {plan.recommended && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-bl-xl shadow-sm">
                      RECOMMENDED
                    </div>
                  )}

                  <div>
                    <CardHeader className={`p-5 border-b border-gray-100 dark:border-white/[0.04] ${colors.bg}`}>
                      <CardTitle className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="text-xs text-gray-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-5 space-y-4">
                      {/* Matrix Grid Row Indicators */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/[0.04] rounded-xl">
                          <div className="flex items-center gap-2">
                            <TrendingUp className={`w-4 h-4 ${colors.text}`} />
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">ROI Rate</span>
                          </div>
                          <span className={`text-base font-bold ${colors.text}`}>{plan.roi}%</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/[0.04] rounded-xl">
                          <div className="flex items-center gap-2">
                            <Clock className={`w-4 h-4 ${colors.text}`} />
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">Duration</span>
                          </div>
                          <span className="text-sm font-bold text-gray-800 dark:text-slate-200">{plan.duration} Days</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/[0.04] rounded-xl">
                          <div className="flex items-center gap-2">
                            <DollarSign className={`w-4 h-4 ${colors.text}`} />
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">Limits Bracket</span>
                          </div>
                          <span className="text-xs font-bold text-gray-800 dark:text-slate-200">
                            ${plan.minInvestment.toLocaleString()} - {plan.maxInvestment ? `$${plan.maxInvestment.toLocaleString()}` : "∞"}
                          </span>
                        </div>
                      </div>

                      {/* Benefits Perks list view */}
                      <div className="pt-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">
                          Allocation Perks
                        </h4>
                        <ul className="space-y-1.5">
                          {plan.perks.map((perk, index) => (
                            <li key={index} className="flex items-start gap-2 text-xs text-gray-600 dark:text-slate-400">
                              <CheckCircle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${colors.text}`} />
                              <span>{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </div>

                  <div className="p-5 pt-0">
                    <Button
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`w-full ${colors.button} h-11 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-black/5 cursor-pointer`}
                    >
                      Select Plan
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Custom Investment Calculator Area Section */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 gap-6 mb-8">
            <Card className="bg-white dark:bg-[#0f1623] border border-gray-200/80 dark:border-white/[0.06] rounded-2xl p-6 shadow-sm">
              <div className="mb-5 pb-4 border-b border-gray-100 dark:border-white/[0.04]">
                <CardTitle className="text-lg font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-500" />
                  Custom Allocation Workspace
                </CardTitle>
                <CardDescription className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  Adjust custom parameter metrics. Baseline entry floor starts at ${minAmount.toLocaleString()} USD.
                </CardDescription>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div>
                  <Label htmlFor="custom-amount" className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">
                    Investment Base (USD)
                  </Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    min={minAmount}
                    placeholder={`Minimum ${minAmount}`}
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className="w-full h-11 px-3.5 text-sm bg-gray-50/50 dark:bg-white/[0.01] border border-gray-200 dark:border-white/[0.06] text-gray-900 dark:text-white rounded-xl focus-visible:ring-2 focus-visible:ring-emerald-500/20"
                  />
                </div>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/[0.04] rounded-xl">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">Calculated Yield Matrix</span>
                    <span className={`text-sm font-bold ${customROI ? "text-amber-500" : "text-emerald-500"}`}>
                      {customROI ? `${customROI}% Yield Floor` : "Plan Managed Yield"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/[0.04] rounded-xl">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500">Contract Lock Window</span>
                    <span className="text-sm font-bold text-gray-800 dark:text-slate-200">
                      {customDuration ? `${customDuration} Days Term` : "Tier Contract Auto"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-2">
                <Button
                  onClick={handleCustomInvest}
                  disabled={!isCustomPlanValid}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-40"
                >
                  {isCoveredByPlan ? `Covered Tier: ${matchingPlan?.name}` : "Initialize Custom Route Plan"}
                </Button>
                {!isCustomPlanValid && (
                  <p className="text-[11px] text-red-500 font-medium italic mt-2.5">
                    * Minimum portfolio initialization floor requires an amount of ${minAmount.toLocaleString()} or above.
                  </p>
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
                <Button className="h-11 px-6 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm shrink-0 whitespace-nowrap cursor-pointer">
                  Contact Support Node
                </Button>
              </CardContent>
            </Card>
          </div>

        </main>

        <UserNav />
      </div>
    </div>
  );
}