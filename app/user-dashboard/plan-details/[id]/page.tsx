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
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    text: "text-blue-600 dark:text-blue-400",
    button: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    text: "text-emerald-600 dark:text-emerald-400",
    button: "bg-emerald-600 hover:bg-emerald-700 text-white",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-800",
    text: "text-purple-600 dark:text-purple-400",
    button: "bg-purple-600 hover:bg-purple-700 text-white",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-200 dark:border-orange-800",
    text: "text-orange-600 dark:text-orange-400",
    button: "bg-orange-600 hover:bg-orange-700 text-white",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    text: "text-amber-600 dark:text-amber-400",
    button: "bg-amber-600 hover:bg-amber-700 text-white",
  },
};

// 💰 Wallet Options
const paymentWallets = [
  {
    crypto: "Bitcoin (BTC)",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    network: "Bitcoin Network",
    color: "text-orange-500",
  },
  {
    crypto: "Ethereum (ETH)",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    network: "ERC-20",
    color: "text-blue-500",
  },
  {
    crypto: "Tether (USDT)",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    network: "TRC-20 / ERC-20",
    color: "text-green-500",
  },
  {
    crypto: "BNB",
    address: "bnb1xy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
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

  const [amount, setAmount] = useState(plan?.minInvestment || 100);
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

    toast.success("Redirecting...");
    setTimeout(() => {
      router.push(`/user-dashboard/submit-payment?${query}`);
    }, 1000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-20 md:pb-8 mb-[50px] md:mb-0">
          <div className="max-w-6xl mx-auto grid md:grid-cols-[2fr_1fr] gap-6">
            {/* 💳 LEFT SIDE: Plan Info */}
            <Card className={`border-2 ${colors.border} ${colors.bg} rounded-2xl shadow-lg`}>
              <CardHeader>
                <CardTitle className={`text-3xl font-bold ${colors.text}`}>
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <TrendingUp className={`w-5 h-5 ${colors.text} mb-1`} />
                    <span className="font-semibold text-lg">{plan.roi}%</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">ROI</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Clock className={`w-5 h-5 ${colors.text} mb-1`} />
                    <span className="font-semibold text-lg">{plan.duration} days</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <DollarSign className={`w-5 h-5 ${colors.text} mb-1`} />
                    <span className="font-semibold text-lg">
                      ${plan.minInvestment.toLocaleString()}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Min</p>
                  </div>
                  {plan.maxInvestment && (
                    <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <DollarSign className={`w-5 h-5 ${colors.text} mb-1`} />
                      <span className="font-semibold text-lg">
                        ${plan.maxInvestment.toLocaleString()}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Max</p>
                    </div>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <Label className="font-medium text-gray-900 dark:text-gray-100">
                    Enter Amount to Invest (USD)
                  </Label>
                  <Input
                    type="number"
                    min={plan.minInvestment}
                    max={plan.maxInvestment || undefined}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="mt-2 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  />
                </div>

                {/* Wallet Dropdown */}
                <div className="space-y-4">
                  <Label className="font-medium text-gray-900 dark:text-gray-100">
                    Choose Crypto Wallet
                  </Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full flex justify-between bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                      >
                        <span className={`${selectedWallet.color} font-medium`}>
                          {selectedWallet.crypto}
                        </span>
                        <ChevronDown className="h-4 w-4 opacity-60" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-full">
                      {paymentWallets.map((wallet, index) => (
                        <DropdownMenuItem
                          key={index}
                          onSelect={() => setSelectedWalletIndex(index)}
                          className={`cursor-pointer ${
                            selectedWalletIndex === index ? `${colors.bg} font-semibold` : ""
                          }`}
                        >
                          <span className={wallet.color}>{wallet.crypto}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Wallet Info */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {selectedWallet.crypto} Address
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${selectedWallet.color} bg-gray-100 dark:bg-gray-800`}
                      >
                        {selectedWallet.network}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <Input
                        readOnly
                        value={selectedWallet.address}
                        className="flex-1 text-sm mr-2 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                      />
                      <Button
                        onClick={() => copyToClipboard(selectedWallet.address)}
                        className={`${colors.button} px-3 h-10`}
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Confirm */}
                <Button
                  onClick={handlePaymentSubmit}
                  className={`w-full ${colors.button} font-semibold py-5 text-md flex items-center justify-center gap-2 rounded-[10px]`}
                >
                  <CheckCircle className="w-5 h-5" /> I Have Made This Payment
                </Button>
              </CardContent>
            </Card>

            {/* 🧭 RIGHT SIDE INFO */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm h-fit">
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  How to Complete Your Investment
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                This page allows you to make payment for your selected investment plan.
                Carefully follow the steps below to complete your transaction successfully.
              </p>
              <ol className="list-decimal list-inside text-sm space-y-3 text-gray-700 dark:text-gray-300">
                <li>Enter the amount you wish to invest in the amount field.</li>
                <li>Choose your preferred crypto wallet (e.g., Bitcoin, Ethereum, USDT, or BNB).</li>
                <li>Copy the wallet address displayed and make your payment to that address.</li>
                <li>
                  After sending the payment, click the{" "}
                  <span className="font-semibold text-blue-500">
                    “I Have Made This Payment”
                  </span>{" "}
                  button to confirm your transaction.
                </li>
                <li>
                  You’ll then be redirected to the payment submission page to verify and confirm your
                  payment.
                </li>
              </ol>
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 italic">
                💡 Tip: Always double-check the crypto network and address before making your transfer.
              </div>
            </div>
          </div>
        </main>

        <UserNav />
      </div>
    </div>
  );
}
