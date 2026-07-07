"use client";

import React, { useState } from "react";
import { Wallet, Link as LinkIcon, Check, Copy, ExternalLink, ShieldCheck } from "lucide-react";
import UserHeader from "@/components/ui/user-header";
import UserSidebar from "@/components/ui/user-sidebar";
import UserNav from "@/components/ui/user-nav";
import Link from "next/link";

interface Wallet {
  id: string;
  name: string;
  icon: string;
  description: string;
  connected: boolean;
  address?: string;
  color: string;
}

const mockWallets: Wallet[] = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "https://i.postimg.cc/fTbxp2yb/Meta-Mask.jpg",
    description:
      "Securely connect your MetaMask wallet to access Ethereum, BNB Chain, Polygon, Arbitrum, Base, and other EVM-compatible blockchain networks.",
    connected: false,
    color: "#F6851B",
  },
  {
    id: "trustwallet",
    name: "Trust Wallet",
    icon: "https://i.postimg.cc/DwHdqr2f/Trust-Wallet.jpg",
    description:
      "Connect your Trust Wallet to securely manage cryptocurrencies across multiple blockchain networks with seamless Web3 and DeFi support.",
    connected: false,
    color: "#3375BB",
  },
  {
    id: "phantom",
    name: "Phantom",
    icon: "https://i.postimg.cc/qRdsFp6k/phantom.jpg",
    description:
      "Connect your Phantom wallet to access the Solana ecosystem, manage digital assets, stake tokens, and interact with decentralized applications.",
    connected: false,
    color: "#AB9FF2",
  },
  {
    id: "okx",
    name: "OKX",
    icon: "https://i.postimg.cc/nzyh2LXz/OKX.jpg",
    description:
      "Connect your OKX Wallet to securely access multi-chain assets, decentralized exchanges, NFT marketplaces, and DeFi protocols in one place.",
    connected: false,
    color: "#1A1A1A",
  },
  {
    id: "solflare",
    name: "Solflare",
    icon: "https://i.postimg.cc/T2N9dMZd/Solflare.jpg",
    description:
      "Connect your Solflare wallet to securely manage Solana assets, stake SOL, explore NFTs, and interact with Web3 applications effortlessly.",
    connected: false,
    color: "#00FFA3",
  },
];
export default function LinkWalletPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wallets, setWallets] = useState<Wallet[]>(mockWallets);

  const handleDisconnect = (walletId: string) => {
    setWallets(wallets.map(w => 
      w.id === walletId 
        ? { ...w, connected: false, address: undefined }
        : w
    ));
  };

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50 dark:bg-[#080d17]">
      <UserSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <UserHeader setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto pb-25 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex items-center gap-3 mb-2">
              {/* <div className="p-2 bg-[#229ED9]/10 rounded-lg">
                <Wallet className="w-6 h-6 text-[#229ED9]" />
              </div> */}
              <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  Link Your Wallet
                </h1>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                  Connect your crypto wallets to enable seamless deposits and withdrawals
                </p>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
              {/* <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" /> */}
              <div>
                <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-400 mb-1">
                  Secure Connection
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-500">
                  Your wallet addresses are encrypted and stored securely. We never have access to your private keys.
                </p>
              </div>
            </div>

            {/* Wallet Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className="bg-white dark:bg-[#0f1623] border border-gray-200 dark:border-white/[0.06] rounded-2xl p-6 hover:border-[#229ED9]/50 dark:hover:border-[#229ED9]/30 transition-all group"
                >
                  {/* Wallet Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden"
                        style={{ backgroundColor: `${wallet.color}15` }}
                      >
                        <img src={wallet.icon} alt={wallet.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{wallet.name}</h3>
                        {wallet.connected && (
                          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                            <Check className="w-3 h-3" />
                            <span>Connected</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {wallet.connected && (
                      <button
                        onClick={() => handleDisconnect(wallet.id)}
                        className="text-xs text-gray-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 font-medium"
                      >
                        Disconnect
                      </button>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-500 dark:text-slate-500 mb-4 line-clamp-2">
                    {wallet.description}
                  </p>

                  {/* Connected State */}
                  {wallet.connected && wallet.address ? (
                    <div className="bg-gray-50 dark:bg-white/[0.04] rounded-xl p-3 mb-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 dark:text-slate-500 font-medium">
                          {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                        </p>
                        <button
                          onClick={() => copyToClipboard(wallet.address!)}
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/[0.1] rounded-lg transition-colors"
                        >
                          <Copy className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {/* Action Button */}
                  {wallet.connected ? (
                    <button className="w-full py-3 bg-emerald-500/10 cursor-pointer text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      Connected
                    </button>
                  ) : (
                    <Link
                      href={`/user-dashboard/link-wallet/${wallet.id}`}
                      className="w-full py-3 bg-[#229ED9] cursor-pointer hover:bg-[#1a7ab8] text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                      Connect Wallet
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      <UserNav />
    </div>
  );
}
