"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Wallet,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Info,
  HelpCircle,
  Rocket,
} from "lucide-react";

import Sidebar from "@/components/ui/user-sidebar";
import Header from "@/components/ui/user-header";
import UserNav from "@/components/ui/user-nav";

// 💰 Wallet Options (Addresses)
const paymentWallets = [
  {
    crypto: "Bitcoin (BTC)",
    network: "Bitcoin Network",
    key: "btc",
  },
  {
    crypto: "Ethereum (ETH)",
    network: "ERC-20",
    key: "eth",
  },
  {
    crypto: "Tether (USDT)",
    network: "TRC-20 / ERC-20",
    key: "usdt",
  },
  {
    crypto: "BNB",
    network: "BEP-20",
    key: "bnb",
  },
];

// 🎨 Theme Constants
const cardBg = "bg-white dark:bg-gray-900";
const textDark = "text-gray-900 dark:text-gray-100";
const textMedium = "text-gray-600 dark:text-gray-300";
const inputBg = "bg-gray-50 dark:bg-gray-800";
const inputBorder = "border-gray-200 dark:border-gray-700";
const focusBorder = "focus:border-emerald-500 dark:focus:border-emerald-400";

export default function ConnectWalletPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(paymentWallets[0]);
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedWallets, setSavedWallets] = useState<Record<string, string>>({});

  // Load saved wallets
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/users/me", { cache: "no-store" });
        const data = await res.json();
        if (res.ok) {
          setSavedWallets(data.wallets || {});
        }
      } catch {}
    })();
  }, []);

  const handleSubmit = async () => {
    if (!walletAddress.trim()) {
      toast.error("Please enter or select your wallet address before submitting.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/users/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: selectedAddress.key, address: walletAddress.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save wallet");
      toast.success(`${selectedAddress.crypto} address saved`);
      setWalletAddress("");
    } catch (e: any) {
      toast.error(e.message || "Could not save wallet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-20 md:pb-8 mb-[50px] md:mb-0">
          <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* 🔹 Right Section — Wallet Connect Form */}
            <div>
              <Card className={`w-full border-2 border-emerald-200 dark:border-emerald-800 ${cardBg} rounded-2xl shadow-xl`}>
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center mb-3">
                    <Wallet className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <CardTitle className={`text-2xl font-bold ${textDark}`}>
                    Connect Your Wallet
                  </CardTitle>
                  <p className={`${textMedium} text-sm mt-2`}>
                    Select your crypto type and enter your own wallet address. We never auto-fill addresses.
                  </p>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* 🔸 Address Dropdown */}
                  <div>
                    <Label className={`${textDark} mb-2 block`}>Select Address</Label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full flex justify-between items-center ${inputBg} ${inputBorder} ${focusBorder}`}
                        >
                          <span>{selectedAddress.crypto}</span>
                          <ChevronDown className="w-4 h-4 opacity-70" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {paymentWallets.map((wallet) => (
                          <DropdownMenuItem
                            key={wallet.key}
                            onSelect={() => {
                              setSelectedAddress(wallet);
                              const fromDb = (savedWallets as any)[wallet.key] as string | undefined;
                              setWalletAddress(fromDb || "");
                            }}
                            className={`cursor-pointer ${
                              selectedAddress.key === wallet.key
                                ? "bg-emerald-100 dark:bg-emerald-900/20"
                                : ""
                            }`}
                          >
                            <div>
                              <div className="font-semibold">{wallet.crypto}</div>
                              <div className="text-xs text-gray-500">{wallet.network}</div>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* 🔸 Wallet Address Input */}
                  <div>
                    <Label className={`${textDark} mb-2 block`}>Wallet Address</Label>
                    <Input
                      placeholder="Enter your wallet address"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className={`${inputBg} ${inputBorder} ${focusBorder}`}
                    />
                  </div>

                  {/* 🔸 Submit Button */}
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-[10px] font-semibold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-[10px] animate-spin cursor-pointer" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Connect Address
                      </>
                    )}
                  </Button>

                  {/* 🔸 Security Notice */}
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
                    <AlertCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      Your connection is secure. We never store your private keys or seed phrases.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* 🟢 New Card: Connected Wallets (Now Outside) */}
              {Object.keys(savedWallets).length > 0 && (
                <Card className={`mt-6 border-2 border-emerald-200 dark:border-emerald-800 ${cardBg} rounded-2xl shadow-md`}>
                  <CardHeader>
                    <CardTitle className={`text-lg font-semibold ${textDark}`}>
                      Connected Wallets
                    </CardTitle>
                    <p className={`${textMedium} text-sm`}>
                      These are the wallet addresses linked to your account.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-xs">
                      {(["btc", "eth", "usdt", "bnb"] as const).map((k) =>
                        savedWallets[k] ? (
                          <div
                            key={k}
                            className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-1"
                          >
                            <span className="uppercase font-semibold text-emerald-700 dark:text-emerald-300">
                              {k}
                            </span>
                            <span className="font-mono text-gray-800 dark:text-gray-200 truncate">
                              {savedWallets[k]}
                            </span>
                          </div>
                        ) : null
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* 🔹 Left Section — Explanatory Cards */}
            <div className="space-y-6">
              <Card className={`${cardBg} border-2 border-emerald-200 dark:border-emerald-900 rounded-2xl shadow-md`}>
                <CardHeader className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <CardTitle className={`text-xl font-semibold ${textDark}`}>
                    What This Page Is About
                  </CardTitle>
                </CardHeader>
                <CardContent className={`text-sm ${textMedium} leading-relaxed`}>
                  This page allows you to securely link your preferred crypto wallet address
                  to your account for deposits, withdrawals, and transactions.
                </CardContent>
              </Card>

              <Card className={`${cardBg} border-2 border-emerald-200 dark:border-emerald-900 rounded-2xl shadow-md`}>
                <CardHeader className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <CardTitle className={`text-xl font-semibold ${textDark}`}>
                    How to Connect Your Address
                  </CardTitle>
                </CardHeader>
                <CardContent className={`text-sm ${textMedium} space-y-2`}>
                  <ol className="list-decimal ml-5 space-y-1">
                    <li>Select your crypto type (e.g. BTC, ETH, BNB).</li>
                    <li>Select your crypto, then type your own address into the input field.</li>
                    <li>Click <strong>Connect Address</strong> to confirm.</li>
                  </ol>
                </CardContent>
              </Card>

              <Card className={`${cardBg} border-2 border-emerald-200 dark:border-emerald-900 rounded-2xl shadow-md`}>
                <CardHeader className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <CardTitle className={`text-xl font-semibold ${textDark}`}>
                    After Connecting What’s Next?
                  </CardTitle>
                </CardHeader>
                <CardContent className={`text-sm ${textMedium} leading-relaxed`}>
                  Once your wallet is linked, you can proceed with transactions.
                  Ensure the wallet has sufficient funds for your next operation.
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
