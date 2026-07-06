"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Wallet,
  CheckCircle,
  AlertCircle,
  Info,
  HelpCircle,
  Rocket,
  ShieldCheck,
} from "lucide-react";

import Sidebar from "@/components/ui/user-sidebar";
import Header from "@/components/ui/user-header";
import UserNav from "@/components/ui/user-nav";

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

export default function ConnectWalletPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(paymentWallets[0]);
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedWallets, setSavedWallets] = useState<Record<string, string>>({});

  // Load saved wallets securely
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/users/me", { cache: "no-store" });
        const data = await res.json();
        if (res.ok) {
          setSavedWallets(data.wallets || {});
          // Preload the current selected wallet input if it exists
          const initialWallet = data.wallets?.[paymentWallets[0].key];
          if (initialWallet) setWalletAddress(initialWallet);
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
      
      // Real-time local state synchronize
      setSavedWallets(prev => ({
        ...prev,
        [selectedAddress.key]: walletAddress.trim()
      }));
      setWalletAddress("");
    } catch (e: any) {
      toast.error(e.message || "Could not save wallet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50 dark:bg-[#080d17] transition-colors duration-200">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-15 md:pb-8 mb-[50px] md:mb-0">
          <div className="mb-8">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-1.5">
              Wallet Settings
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Securely bind crypto payout destinations to your personal account profile
            </p>
          </div>

          <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* 🔹 Left/Main Column — Wallet Setup Form */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="bg-white dark:bg-[#0f1623] border border-gray-200/80 dark:border-white/[0.06] shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/10 flex items-center justify-center rounded-xl text-emerald-600 dark:text-emerald-400">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900 dark:text-white font-bold">
                        Link Address Gateway
                      </CardTitle>
                      <CardDescription className="text-xs text-gray-500 dark:text-slate-400">
                        Specify structural public keys to tie together automated network withdrawals
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  {/* Modernized Interactive Grid Selector (Replaces Dropdown) */}
                  <div>
                    <Label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2.5">
                      Select Cryptographic Currency
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {paymentWallets.map((wallet) => {
                        const isSelected = selectedAddress.key === wallet.key;
                        return (
                          <button
                            type="button"
                            key={wallet.key}
                            onClick={() => {
                              setSelectedAddress(wallet);
                              const fromDb = savedWallets[wallet.key];
                              setWalletAddress(fromDb || "");
                            }}
                            className={`p-3 rounded-xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-500/[0.03] shadow-sm shadow-emerald-500/5"
                                : "border-gray-200 dark:border-white/[0.06] bg-gray-50/50 dark:bg-white/[0.01] hover:bg-gray-100/50 dark:hover:bg-white/[0.03]"
                            }`}
                          >
                            <div>
                              <span className="font-semibold text-gray-900 dark:text-white text-sm block">
                                {wallet.crypto}
                              </span>
                              <span className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{wallet.network}</span>
                            </div>
                            {isSelected && (
                              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Wallet Input Block */}
                  <div>
                    <Label htmlFor="wallet-address" className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2.5">
                      {selectedAddress.crypto} Public Target Key
                    </Label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/[0.05] flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                      </div>
                      <Input
                        id="wallet-address"
                        type="text"
                        placeholder={`Paste your verified ${selectedAddress.network} address here`}
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        className="w-full pl-14 pr-4 py-6 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.08] rounded-xl text-gray-900 dark:text-white font-mono text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500/80 transition-all"
                      />
                    </div>
                  </div>

                  {/* Submit Transaction Action */}
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-6 rounded-xl text-sm font-bold tracking-wide transition-all shadow-md shadow-emerald-600/10 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Updating Smart Node Security Address...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Securely Bind Wallet Address</span>
                      </>
                    )}
                  </Button>

                  {/* Security Clearance Alert Banner */}
                  <div className="p-3 bg-emerald-500/[0.04] border border-emerald-500/10 rounded-xl flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-600 dark:text-slate-400 leading-normal">
                      Security Protocol: Encrypted mapping profiles execute strictly matching validation schemas. Private signature keys/seed components are never collected or processed.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Connected Active Wallet Registries Block */}
              {Object.keys(savedWallets).length > 0 && (
                <Card className="bg-white dark:bg-[#0f1623] border border-gray-200/80 dark:border-white/[0.06] shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-gray-900 dark:text-white font-bold uppercase tracking-wider text-slate-400">
                      Active Bound Registries
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y divide-gray-100 dark:divide-white/[0.04]">
                      {(["btc", "eth", "usdt", "bnb"] as const).map((k) =>
                        savedWallets[k] ? (
                          <div key={k} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 first:pt-0 last:pb-0">
                            <span className="uppercase font-bold text-xs bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/10 shrink-0">
                              {k} Gateway
                            </span>
                            <span className="font-mono text-xs text-gray-600 dark:text-slate-300 break-all select-all sm:text-right w-full sm:max-w-md truncate">
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

            {/* 🔹 Right Column — Dynamic Explanatory Grid Cards */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="bg-white dark:bg-[#0f1623] border border-gray-200/80 dark:border-white/[0.06] shadow-sm">
                <CardHeader className="pb-2 flex flex-row items-center gap-2.5 space-y-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <Info className="w-4 h-4" />
                  </div>
                  <CardTitle className="text-sm font-bold text-gray-900 dark:text-white">
                    What This Configuration Handles
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                  This administrative panel establishes fixed ledger linkage targets for automated asset clearance. Linking an internal key provides verified transaction nodes across continuous system runs.
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-[#0f1623] border border-gray-200/80 dark:border-white/[0.06] shadow-sm">
                <CardHeader className="pb-2 flex flex-row items-center gap-2.5 space-y-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <CardTitle className="text-sm font-bold text-gray-900 dark:text-white">
                    Linkage Process Steps
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-gray-500 dark:text-slate-400">
                  <ol className="list-decimal pl-4 space-y-2">
                    <li>Toggle your preferred targeted block index network (e.g., ERC-20 vs. native chains).</li>
                    <li>Verify character maps out of primary custody layers, and paste inside the target field.</li>
                    <li>Trigger validation sequence via the <strong className="text-gray-700 dark:text-slate-300">Bind Address</strong> switch action.</li>
                  </ol>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-[#0f1623] border border-gray-200/80 dark:border-white/[0.06] shadow-sm">
                <CardHeader className="pb-2 flex flex-row items-center gap-2.5 space-y-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Rocket className="w-4 h-4" />
                  </div>
                  <CardTitle className="text-sm font-bold text-gray-900 dark:text-white">
                    Post-Connection Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                  Upon baseline confirmation across live state loops, these addresses will reflect instantly as auto-verified endpoints inside the main withdrawal dashboards, clearing settlement execution delays.
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