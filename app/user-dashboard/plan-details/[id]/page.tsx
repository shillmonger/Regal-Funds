"use client";

import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { toast } from "sonner"; // ✅ Import Sonner toast
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DollarSign,
  CheckCircle,
  Clock,
  TrendingUp,
  Copy,
  Check,
  ChevronDown,
  Info,
} from "lucide-react";

import Sidebar from "@/components/ui/user-sidebar";
import Header from "@/components/ui/user-header";
import UserNav from "@/components/ui/user-nav";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// 🎨 Color Schemes
const colorSchemes = {
  blue: {
    bg: "bg-blue-50/40 dark:bg-blue-950/10",
    border: "border-blue-200/80 dark:border-blue-900/50",
    text: "text-blue-600 dark:text-blue-400",
    button: "bg-blue-600 hover:bg-blue-500 text-white",
  },
  emerald: {
    bg: "bg-emerald-50/40 dark:bg-emerald-950/10",
    border: "border-emerald-200/80 dark:border-emerald-900/50",
    text: "text-emerald-600 dark:text-emerald-400",
    button: "bg-emerald-600 hover:bg-emerald-500 text-white",
  },
  purple: {
    bg: "bg-purple-50/40 dark:bg-purple-950/10",
    border: "border-purple-200/80 dark:border-purple-900/50",
    text: "text-purple-600 dark:text-purple-400",
    button: "bg-purple-600 hover:bg-purple-500 text-white",
  },
  orange: {
    bg: "bg-orange-50/40 dark:bg-orange-950/10",
    border: "border-orange-200/80 dark:border-orange-900/50",
    text: "text-orange-600 dark:text-orange-400",
    button: "bg-orange-600 hover:bg-orange-500 text-white",
  },
  amber: {
    bg: "bg-amber-50/40 dark:bg-amber-950/10",
    border: "border-amber-200/80 dark:border-amber-900/50",
    text: "text-amber-600 dark:text-amber-400",
    button: "bg-amber-600 hover:bg-amber-500 text-white",
  },
};

// 💰 Wallet Options
const paymentWallets = [
  {
    crypto: "Bitcoin (BTC)",
    address: "bc1qyywpvkqpepv3m5w858egclkpazcyy9ckyq2e2t",
    network: "Bitcoin Network",
    color: "text-orange-500",
  },
  {
    crypto: "Ethereum (ETH)",
    address: "0x40d72384cb6EDd9E362CEd310bA729548F10C72D",
    network: "ERC-20",
    color: "text-blue-500",
  },
  {
    crypto: "Tether (USDT)",
    address: "TM4zFPcdM35pbRyZmWGETVUgxXgX9CQ9U1",
    network: "TRC-20",
    color: "text-green-500",
  },
  {
    crypto: "BNB",
    address: "0x40d72384cb6EDd9E362CEd310bA729548F10C72D",
    network: "BEP-20",
    color: "text-yellow-500",
  },
];

// 🧭 Plans
const investmentPlans = [
  {
    id: 1,
    name: "Starter Plan",
    minInvestment: 100,
    maxInvestment: 999,
    roi: 10,
    duration: 30,
    description: "Perfect for beginners looking to start their crypto journey",
    color: "blue",
  },
  {
    id: 2,
    name: "Silver Plan",
    minInvestment: 1000,
    maxInvestment: 4999,
    roi: 10,
    duration: 30,
    description: "Ideal for balanced growth and medium risk.",
    color: "emerald",
  },
  {
    id: 3,
    name: "Gold Plan",
    minInvestment: 5000,
    maxInvestment: 9999,
    roi: 10,
    duration: 30,
    description: "Premium plan for experienced investors.",
    color: "purple",
  },
  {
    id: 4,
    name: "Platinum Plan",
    minInvestment: 10000,
    maxInvestment: 24999,
    roi: 10,
    duration: 30,
    description: "High-value plan with maximum returns.",
    color: "orange",
  },
  {
    id: 5,
    name: "Diamond Plan",
    minInvestment: 25000,
    maxInvestment: 50000,
    roi: 10,
    duration: 30,
    description: "Ultimate portfolio maximization plan.",
    color: "amber",
  },
];

export default function PlanDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const customAmount = searchParams.get("amount");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const plan =
    id === "custom"
      ? {
          name: "Custom Investment Plan",
          description: "Flexible investment based on your chosen amount",
          roi: 10,
          duration: 30,
          minInvestment: Number(customAmount) || 100,
          maxInvestment: null,
          color: "emerald",
        }
      : investmentPlans.find((p) => p.id === Number(id));

  const [amount, setAmount] = useState(Number(customAmount) || plan?.minInvestment || 100);
  const [selectedWalletIndex, setSelectedWalletIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedWallet = useMemo(
    () => paymentWallets[selectedWalletIndex],
    [selectedWalletIndex]
  );

  if (!plan) {
    return (
      <div className="p-8 text-center text-gray-500">
        Invalid Plan ID. Please go back and select a valid plan.
      </div>
    );
  }

  const colors = colorSchemes[plan.color as keyof typeof colorSchemes];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ Validate and Submit
  const handlePaymentSubmit = () => {
    if (amount < plan.minInvestment) {
      toast.error(`Minimum investment for ${plan.name} is $${plan.minInvestment}`);
      return;
    }

    if (plan.maxInvestment && amount > plan.maxInvestment) {
      toast.error(`Maximum investment for ${plan.name} is $${plan.maxInvestment}`);
      return;
    }

    const query = new URLSearchParams({
      name: plan.name,
      amount: String(amount),
      roi: String(plan.roi),
      duration: String(plan.duration),
      id: String(id),
    }).toString();

    toast.success("Redirecting to verification gate...");
    setTimeout(() => {
      router.push(`/user-dashboard/submit-payment?${query}`);
    }, 1000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50 dark:bg-[#080d17] transition-colors duration-200">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-15 md:pb-8 mb-[50px] md:mb-0">
          {/* Master Responsive Container: Side-by-Side Grid on LG (Large Screen), Stacked vertically on Mobile */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
            
            {/* 💳 LEFT SIDE: Plan Info Action Card */}
            <Card className={`border border-gray-200/80 dark:border-white/[0.06] bg-white dark:bg-[#0f1623] rounded-2xl shadow-sm overflow-hidden`}>
              <div className={`p-6 border-b border-gray-100 dark:border-white/[0.04] ${colors.bg}`}>
                <CardTitle className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {plan.description}
                </CardDescription>
              </div>

              <CardContent className="p-6 space-y-6">
                {/* Stats Matrix Grid Layout */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="flex flex-col items-center justify-center p-3.5 bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/[0.04] rounded-xl text-center">
                    <TrendingUp className={`w-4 h-4 ${colors.text} mb-1`} />
                    <span className="font-bold text-gray-900 dark:text-white text-base">{plan.roi}%</span>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-slate-500">ROI Return</p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3.5 bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/[0.04] rounded-xl text-center">
                    <Clock className={`w-4 h-4 ${colors.text} mb-1`} />
                    <span className="font-bold text-gray-900 dark:text-white text-base">{plan.duration} Days</span>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-slate-500">Duration</p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3.5 bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/[0.04] rounded-xl text-center">
                    <DollarSign className={`w-4 h-4 ${colors.text} mb-1`} />
                    <span className="font-bold text-gray-900 dark:text-white text-base">
                      ${plan.minInvestment.toLocaleString()}
                    </span>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-slate-500">Min Limit</p>
                  </div>
                  {plan.maxInvestment && (
                    <div className="flex flex-col items-center justify-center p-3.5 bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/[0.04] rounded-xl text-center">
                      <DollarSign className={`w-4 h-4 ${colors.text} mb-1`} />
                      <span className="font-bold text-gray-900 dark:text-white text-base">
                        ${plan.maxInvestment.toLocaleString()}
                      </span>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-slate-500">Max Limit</p>
                    </div>
                  )}
                </div>

                {/* Amount Input Frame */}
                <div>
                  <Label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">
                    Enter Amount to Invest (USD)
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min={plan.minInvestment}
                      max={plan.maxInvestment || undefined}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full h-11 px-3.5 text-sm bg-gray-50/50 dark:bg-white/[0.01] border border-gray-200 dark:border-white/[0.06] text-gray-900 dark:text-white rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:ring-offset-0 focus-visible:border-gray-300 transition-all"
                    />
                  </div>
                </div>

                {/* Wallet Dropdown Structure */}
                <div className="space-y-2">
                  <Label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">
                    Choose Crypto Settlement Network
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full h-11 flex justify-between bg-gray-50/50 dark:bg-white/[0.01] border border-gray-200 dark:border-white/[0.06] rounded-xl text-gray-800 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-white/[0.04] transition-all px-4"
                      >
                        <span className={`${selectedWallet.color} font-bold text-sm`}>
                          {selectedWallet.crypto}
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full min-w-[var(--radix-dropdown-menu-trigger-width)] bg-white dark:bg-[#0f1623] border border-gray-100 dark:border-white/[0.06] rounded-xl shadow-lg p-1">
                      {paymentWallets.map((wallet, index) => (
                        <DropdownMenuItem
                          key={index}
                          onSelect={() => setSelectedWalletIndex(index)}
                          className={`cursor-pointer px-3 py-2.5 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors ${
                            selectedWalletIndex === index ? "bg-gray-50 dark:bg-white/[0.04] font-bold" : ""
                          }`}
                        >
                          <span className={`${wallet.color} font-medium`}>{wallet.crypto}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Wallet Info Display Container */}
                  <div className="p-4 bg-gray-50/50 dark:bg-white/[0.01] border border-gray-200 dark:border-white/[0.04] rounded-xl space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                        Target Secure Address
                      </span>
                      <span
                        className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md ${selectedWallet.color} bg-white dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.02] shadow-sm`}
                      >
                        {selectedWallet.network}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        readOnly
                        value={selectedWallet.address}
                        className="flex-1 h-10 text-xs font-mono bg-white dark:bg-[#080d17] border border-gray-200 dark:border-white/[0.06] text-gray-700 dark:text-slate-300 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 select-all"
                      />
                      <Button
                        type="button"
                        onClick={() => copyToClipboard(selectedWallet.address)}
                        className={`${colors.button} px-4 h-10 rounded-xl transition-all font-bold shrink-0 shadow-md shadow-black/5 cursor-pointer`}
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Final Execution Button: Full width everywhere */}
                <div className="pt-2">
                  <Button
                    type="button"
                    onClick={handlePaymentSubmit}
                    className={`w-full ${colors.button} font-bold h-12 text-sm flex items-center justify-center gap-2 rounded-xl transition-all shadow-lg shadow-black/5 cursor-pointer`}
                  >
                    <CheckCircle className="w-4 h-4" /> I Have Made This Payment
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 🧭 RIGHT SIDE INFO: Instructional Sideboard Panel */}
            <div className="bg-white dark:bg-[#0f1623] border border-gray-200/80 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 dark:border-white/[0.04]">
                <Info className="w-4 h-4 text-blue-500 shrink-0" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                  Payment Framework Protocol
                </h2>
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                Follow the standard manual pipeline checkpoints below to authorize and update your ledger asset profiles correctly.
              </p>
              <ol className="text-xs space-y-3.5 text-gray-600 dark:text-slate-400 list-none pl-0">
                <li className="flex gap-2.5 items-start">
                  <span className="flex items-center justify-center w-5 h-5 rounded-md bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.02] text-[10px] font-bold text-gray-500 dark:text-slate-400 shrink-0 mt-0.5">1</span>
                  <span>Input the exact desired allocation funds configuration parameters into the target field array.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="flex items-center justify-center w-5 h-5 rounded-md bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.02] text-[10px] font-bold text-gray-500 dark:text-slate-400 shrink-0 mt-0.5">2</span>
                  <span>Isolate and choose the currency layer node index mechanism matching your external wallet.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="flex items-center justify-center w-5 h-5 rounded-md bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.02] text-[10px] font-bold text-gray-500 dark:text-slate-400 shrink-0 mt-0.5">3</span>
                  <span>Extract the generated address hash directly and execute your transfer via an external device.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <span className="flex items-center justify-center w-5 h-5 rounded-md bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.02] text-[10px] font-bold text-gray-500 dark:text-slate-400 shrink-0 mt-0.5">4</span>
                  <span> Trigger the submission indicator to cache status metrics and pass verification data upstream.</span>
                </li>
              </ol>
              
              <div className="pt-3 border-t border-gray-100 dark:border-white/[0.04] text-[11px] text-gray-400 dark:text-slate-500 italic leading-relaxed">
                💡 Warning: Verify that blockchain networks match identically before completing actions. Mismatched channels result in unrecoverable network loss.
              </div>
            </div>

          </div>
        </main>

        <UserNav />
      </div>
    </div>
  );
}