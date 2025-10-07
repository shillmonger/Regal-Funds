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
} from "@/components/ui/dropdown-menu"; // 👈 Shadcn Dropdown Imports
import { Input } from "@/components/ui/input"; // 👈 Added Input for custom amount
import { Label } from "@/components/ui/label"; // 👈 Added Label for custom amount
import {
  TrendingUp,
  Clock,
  DollarSign,
  CheckCircle,
  Filter,
  ArrowUpDown,
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

// Investment plans data
const investmentPlans: Plan[] = [
  {
    id: 1,
    name: "Starter Plan",
    minInvestment: 100,
    maxInvestment: 999,
    roi: 10,
    duration: 30,
    description:
      "Perfect for beginners looking to start their crypto investment journey",
    category: "short",
    perks: [
      "Daily ROI payouts",
      "24/7 customer support",
      "Basic market insights",
      "Withdraw anytime after 7 days",
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
    description:
      "Ideal for growing your portfolio with balanced risk and returns",
    category: "medium",
    perks: [
      "Higher daily ROI",
      "Priority customer support",
      "Advanced market analysis",
      "Dedicated account manager",
      "Withdraw anytime after 14 days",
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
      "Withdraw anytime after 21 days",
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
    // 👇 Updated to include a maxInvestment
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
      "Withdraw anytime after 45 days",
    ],
    recommended: false,
    color: "amber",
  },
];

const colorSchemes = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
    button: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300",
    button: "bg-emerald-600 hover:bg-emerald-700 text-white",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-800",
    text: "text-purple-600 dark:text-purple-400",
    badge: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
    button: "bg-purple-600 hover:bg-purple-700 text-white",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-200 dark:border-orange-800",
    text: "text-orange-600 dark:text-orange-400",
    badge: "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300",
    button: "bg-orange-600 hover:bg-orange-700 text-white",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300",
    button: "bg-amber-600 hover:bg-amber-700 text-white",
  },
};

// Define sorting options
const sortOptions = [
    { value: "roi", label: "ROI (High to Low)" },
    { value: "duration", label: "Duration (Short to Long)" },
    { value: "minInvestment", label: "Min. Investment (Low to High)" },
];


export default function InvestmentPlansPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("roi");
  const [showFilters, setShowFilters] = useState(false);
  
  // 👈 State for the custom investment amount
  const [customAmount, setCustomAmount] = useState<number | string>(100); 

  // Filter and sort plans
  const filteredPlans = investmentPlans
    .filter(
      (plan) => selectedCategory === "all" || plan.category === selectedCategory
    )
    .sort((a, b) => {
      if (sortBy === "roi") return b.roi - a.roi;
      if (sortBy === "duration") return a.duration - b.duration;
      if (sortBy === "minInvestment") return a.minInvestment - b.minInvestment;
      return 0;
    });

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow empty string for temporary input, but convert to number for logic
        if (value === "") {
            setCustomAmount("");
            return;
        }
        const numValue = Number(value);
        if (!isNaN(numValue) && numValue >= 0) {
            setCustomAmount(numValue);
        }
    };

    // Calculate details for the custom plan section
    const minAmount = 100;
    const currentCustomAmount = Number(customAmount) || 0;
    const isCustomPlanValid = currentCustomAmount >= minAmount;

    // Check if the custom amount falls within any existing plan
    const isCoveredByPlan = investmentPlans.some(
        (plan) =>
            currentCustomAmount >= plan.minInvestment &&
            (plan.maxInvestment === null || currentCustomAmount <= plan.maxInvestment)
    );

    const customROI = isCoveredByPlan ? null : 10;
    const customDuration = isCoveredByPlan ? null : 30; // 1 month = 30 days

  const router = useRouter();

  const handleSelectPlan = (id: number) => {
    router.push(`/user-dashboard/plan-details/${id}`);
  };

  const handleCustomInvest = () => {
    if (!isCustomPlanValid) return;
    const matchingPlan = investmentPlans.find(
      (plan) =>
        currentCustomAmount >= plan.minInvestment &&
        (plan.maxInvestment === null || currentCustomAmount <= plan.maxInvestment)
    );
    if (matchingPlan) {
      router.push(`/user-dashboard/plan-details/${matchingPlan.id}`);
    } else {
      router.push(`/user-dashboard/plan-details/custom?amount=${currentCustomAmount}`);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Plans Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-20 md:pb-8 mb-[50px] md:mb-0">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Investment Plans
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Choose the perfect plan to grow your wealth with guaranteed returns
            </p>
          </div>

          {/* Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 text-sm mb-1">Total Plans</p>
                    <p className="text-2xl font-bold">
                      {investmentPlans.length}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Highest ROI</p>
                    <p className="text-2xl font-bold">85%</p>
                  </div>
                  <DollarSign className="w-8 h-8 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm mb-1">Min. Duration</p>
                    <p className="text-2xl font-bold">7 Days</p>
                  </div>
                  <Clock className="w-8 h-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

         


          {/* Filters and Sort */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-2 items-center flex-wrap">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      selectedCategory === "all"
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    All Plans
                  </button>
                  <button
                    onClick={() => setSelectedCategory("short")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      selectedCategory === "short"
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    Short Term
                  </button>
                  <button
                    onClick={() => setSelectedCategory("medium")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      selectedCategory === "medium"
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    Medium Term
                  </button>
                  <button
                    onClick={() => setSelectedCategory("long")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      selectedCategory === "long"
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    Long Term
                  </button>
                </div>
              </div>

              {/* 🚀 SHADCN DROPDOWN IMPLEMENTATION 🚀 */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-gray-500" />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="flex items-center justify-between gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-2 focus:ring-emerald-500 w-[220px]"
                        >
                            {sortOptions.find(option => option.value === sortBy)?.label || sortOptions[0].label}
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    {/* Width adjustment for consistency */}
                    <DropdownMenuContent style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}>
                        {sortOptions.map((option) => (
                            <DropdownMenuItem
                                key={option.value}
                                onSelect={() => setSortBy(option.value)}
                                className={`cursor-pointer ${
                                    sortBy === option.value 
                                        ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                                        : ""
                                }`}
                            >
                                {option.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {/* 🚀 END DROPDOWN IMPLEMENTATION 🚀 */}
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {filteredPlans.map((plan) => {
              const colors = colorSchemes[plan.color];
              return (
                <Card
                  key={plan.id}
                  className={`relative overflow-hidden border-2 ${colors.border} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                >
                  {plan.recommended && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      RECOMMENDED
                    </div>
                  )}

                  <CardHeader className={`${colors.bg} pb-4`}>
                    <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {plan.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-6">
                    {/* Key Metrics */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <TrendingUp className={`w-5 h-5 ${colors.text}`} />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            ROI
                          </span>
                        </div>
                        <span className={`text-xl font-bold ${colors.text}`}>
                          {plan.roi}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Clock className={`w-5 h-5 ${colors.text}`} />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Duration
                          </span>
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {plan.duration} Days
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2">
                          <DollarSign className={`w-5 h-5 ${colors.text}`} />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Min Investment
                          </span>
                        </div>
                        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          ${plan.minInvestment.toLocaleString()}
                        </span>
                      </div>

                      {plan.maxInvestment !== null && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-2">
                            <DollarSign className={`w-5 h-5 ${colors.text}`} />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Max Investment
                            </span>
                          </div>
                          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            ${plan.maxInvestment.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Perks */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        Plan Benefits:
                      </h4>
                      <ul className="space-y-2">
                        {plan.perks.map((perk, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                          >
                            <CheckCircle
                              className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colors.text}`}
                            />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => handleSelectPlan(plan.id)}
                      className={`w-full ${colors.button} font-semibold py-6 text-base transition-all duration-300`}
                    >
                      Select {plan.name}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>


 {/* Custom Investment Section */}
 <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 mb-6">
            <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-emerald-500"/>
                    Custom Investment Amount
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                    Enter the amount you wish to invest. Minimum investment is ${minAmount.toLocaleString()}.
                </CardDescription>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                    <Label htmlFor="custom-amount" className="text-gray-900 dark:text-gray-100">
                        Investment Amount (USD)
                    </Label>
                    <Input
                        id="custom-amount"
                        type="number"
                        min={minAmount}
                        placeholder={`Minimum ${minAmount}`}
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        className="mt-1"
                    />
                </div>

                <div className="md:col-span-2 space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Calculated ROI
                        </span>
                        <span className={`text-lg font-bold ${customROI ? 'text-red-500' : 'text-emerald-500'}`}>
                           {customROI ? `${customROI}% (Default)` : 'Covered by Plan'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Duration
                        </span>
                        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            {customDuration ? `${customDuration} Days (Default)` : 'As per Plan'}
                        </span>
                    </div>
                    <Button
                        onClick={handleCustomInvest}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 text-base transition-all duration-300"
                        disabled={!isCustomPlanValid}
                    >
                        {isCoveredByPlan ? `Covered by Plan: ${investmentPlans.find(p => currentCustomAmount >= p.minInvestment && (p.maxInvestment === null || currentCustomAmount <= p.maxInvestment))?.name}` : "Invest with Custom Amount"}
                    </Button>
                    {!isCustomPlanValid && (
                        <p className="text-xs text-red-500 mt-2">
                            Please enter an amount of ${minAmount.toLocaleString()} or more.
                        </p>
                    )}
                </div>
            </div>
          </Card>


          {/* Bottom Info Banner */}
          <Card className="mt-8 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-900 border border-emerald-200 dark:border-emerald-800">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Need Help Choosing?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Our investment advisors are available 24/7 to help you select
                    the perfect plan for your financial goals.
                  </p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-base font-medium whitespace-nowrap">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>

        {/* Mobile Bottom Navigation */}
        <UserNav />
      </div>
    </div>
  );
}