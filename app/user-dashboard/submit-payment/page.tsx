"use client";

import React, { useState, useMemo, Suspense } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
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
  Upload,
  Copy,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Check,
  DollarSign,
  Package,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// --- THEME UTILITIES MATTER MATCHING ---
const colorSchemes = {
  emerald: {
    bg: "bg-emerald-50/40 dark:bg-emerald-950/10",
    border: "border-emerald-200/80 dark:border-emerald-900/50",
    text: "text-emerald-600 dark:text-emerald-400",
    button: "bg-emerald-600 hover:bg-emerald-500 text-white",
  },
};

// --- STATIC CONFIG DATA ---
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

const statusTypes = {
  pending: {
    icon: Clock,
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50/40 dark:bg-yellow-950/10",
    border: "border-yellow-200 dark:border-yellow-900/50",
    title: "Pending Review",
    message:
      "Your payment proof is being reviewed by our team. This usually takes 10-30 minutes. You will be notified when the status changes.",
  },
  approved: {
    icon: CheckCircle,
    color: "text-emerald-600 dark:text-emerald-500",
    bg: "bg-emerald-50/40 dark:bg-emerald-950/10",
    border: "border-emerald-200 dark:border-emerald-900/50",
    title: "Payment Approved",
    message:
      "Your payment has been verified! Your investment is now active and earning returns.",
  },
  rejected: {
    icon: XCircle,
    color: "text-red-600 dark:text-red-500",
    bg: "bg-red-50/40 dark:bg-red-950/10",
    border: "border-red-200 dark:border-red-900/50",
    title: "Payment Rejected",
    message:
      "Your payment proof was rejected. Please check the details and resubmit with correct information or contact support.",
  },
};

// --- CORE INTERFACE VIEW WITH HOOK BOUNDARIES ---
function PaymentFormContent() {
  const params = useSearchParams();
  const colors = colorSchemes.emerald; // Styled matching color baseline matches
  
  const selectedPlan = useMemo(() => ({
    name: params.get("name") || "Selected Plan",
    amount: Number(params.get("amount")) || 0,
    roi: Number(params.get("roi")) || 10,
    duration: Number(params.get("duration")) || 30,
    id: params.get("id") || undefined,
  }), [params]);

  const [selectedCryptoIndex, setSelectedCryptoIndex] = useState(0);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [notes, setNotes] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [submitStatus, setSubmitStatus] = useState<"pending" | "approved" | "rejected" | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const selectedWallet = useMemo(() => paymentWallets[selectedCryptoIndex], [selectedCryptoIndex]);
  const currentStatus = submitStatus ? statusTypes[submitStatus] : null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5000000) {
      setUploadedFile(file);
    } else {
      toast.error("File size must be under 5MB.");
      setUploadedFile(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.size <= 5000000) {
      setUploadedFile(file);
    } else {
      toast.error("File size must be less than 5MB");
      setUploadedFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile && !transactionId.trim()) {
      toast.error("Please provide either a transaction ID or upload a payment proof");
      return;
    }

    try {
      setSubmitStatus("pending");
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedPlan.amount,
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          roi: selectedPlan.roi,
          duration: selectedPlan.duration,
          crypto: selectedWallet.crypto,
          walletAddress: selectedWallet.address,
          transactionId: transactionId || undefined,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Payment submit failed", err);
        toast.error("Failed to submit payment proof. Please try again.");
        setSubmitStatus(null);
        return;
      }

      toast.success("Payment proof submitted successfully! Your submission is pending review.");
      setTransactionId("");
      setNotes("");
      setUploadedFile(null);
    } catch (error) {
      console.error("Payment submit error", error);
      toast.error("An error occurred while submitting your payment proof");
      setSubmitStatus(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
      {/* 💳 LEFT SIDE: Action & Verification Card */}
      <div className="space-y-6">
        <Card className="border border-gray-200/80 dark:border-white/[0.06] bg-white dark:bg-[#0f1623] rounded-2xl shadow-sm overflow-hidden">
          <div className={`p-6 border-b border-gray-100 dark:border-white/[0.04] ${colors.bg}`}>
            <CardTitle className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <Package className={`w-5 h-5 ${colors.text}`} />
              {selectedPlan.name} Setup
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Verify your active allocation requirements and select crypto settlement channel.
            </CardDescription>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Stats Matrix Grid Layout */}
            <div className="grid grid-cols-3 gap-3.5">
              <div className="flex flex-col items-center justify-center p-3.5 bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/[0.04] rounded-xl text-center">
                <DollarSign className={`w-4 h-4 ${colors.text} mb-1`} />
                <span className="font-bold text-gray-900 dark:text-white text-base">
                  ${selectedPlan.amount.toLocaleString()}
                </span>
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-slate-500">Order Amount</p>
              </div>
              <div className="flex flex-col items-center justify-center p-3.5 bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/[0.04] rounded-xl text-center">
                <Clock className={`w-4 h-4 ${colors.text} mb-1`} />
                <span className="font-bold text-gray-900 dark:text-white text-base">{selectedPlan.duration} Days</span>
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-slate-500">Duration</p>
              </div>
              <div className="flex flex-col items-center justify-center p-3.5 bg-gray-50 dark:bg-white/[0.01] border border-gray-100 dark:border-white/[0.04] rounded-xl text-center">
                <CheckCircle className={`w-4 h-4 ${colors.text} mb-1`} />
                <span className="font-bold text-gray-900 dark:text-white text-base">{selectedPlan.roi}%</span>
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-slate-500">ROI Rate</p>
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
                      onSelect={() => setSelectedCryptoIndex(index)}
                      className={`cursor-pointer px-3 py-2.5 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors ${
                        index === selectedCryptoIndex ? "bg-gray-50 dark:bg-white/[0.04] font-bold" : ""
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
                    type="text"
                    readOnly
                    value={selectedWallet.address}
                    className="flex-1 h-10 text-xs font-mono bg-white dark:bg-[#080d17] border border-gray-200 dark:border-white/[0.06] text-gray-700 dark:text-slate-300 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 select-all"
                  />
                  <Button
                    type="button"
                    onClick={() => copyToClipboard(selectedWallet.address)}
                    className={`${colors.button} px-4 h-10 rounded-xl transition-all font-bold shrink-0 shadow-md shadow-black/5 cursor-pointer`}
                  >
                    {copiedAddress ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-[11px] text-gray-400 dark:text-slate-500 italic mt-1">
                  ⚠️ Send exactly <span className="font-bold text-gray-900 dark:text-white">${selectedPlan.amount.toLocaleString()}</span> to the hash above.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 🧭 RIGHT SIDE INFO: Verification & Submission Pipeline */}
      <div className="space-y-6">
        {/* Real-time Toast/Status Card Indicator */}
        {submitStatus && currentStatus && (
          <Card className={`${currentStatus.bg} border ${currentStatus.border} rounded-2xl overflow-hidden p-5 shadow-sm space-y-2`}>
            <div className="flex items-center gap-2">
              {(() => {
                const StatusIcon = currentStatus.icon;
                return <StatusIcon className={`h-5 w-5 ${currentStatus.color}`} />;
              })()}
              <h3 className={`text-sm font-bold uppercase tracking-wider ${currentStatus.color}`}>
                {currentStatus.title}
              </h3>
            </div>
            <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">{currentStatus.message}</p>
          </Card>
        )}

        {submitStatus !== "approved" && (
          <Card className="bg-white dark:bg-[#0f1623] border border-gray-200/80 dark:border-white/[0.06] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100 dark:border-white/[0.04]">
              <Upload className={`w-4 h-4 ${colors.text} shrink-0`} />
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                Proof Submission
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File Dropzone Upload Area */}
              <div>
                <Label className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">
                  Upload Asset Receipt (Max 5MB)
                </Label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex flex-col justify-center items-center h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all 
                    ${isDragging ? "border-emerald-500 bg-gray-50/50 dark:bg-white/[0.02]" : "border-gray-200 dark:border-white/[0.06] hover:border-emerald-500 dark:hover:border-emerald-500"} 
                    ${uploadedFile ? "border-emerald-500 bg-emerald-50/10" : ""}`}
                >
                  <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*, .pdf" />
                  <label htmlFor="file-upload" className="w-full text-center cursor-pointer px-4">
                    {uploadedFile ? (
                      <span className={`${colors.text} text-xs font-semibold flex items-center justify-center gap-2`}>
                        <FileText className="h-4 w-4" />
                        <span className="truncate max-w-[180px]">{uploadedFile.name}</span>
                      </span>
                    ) : (
                      <div className="space-y-1">
                        <Upload className="mx-auto h-6 w-6 text-gray-400" />
                        <p className="text-xs text-gray-600 dark:text-slate-400">
                          Drag file here or <span className={colors.text}>browse</span>
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-slate-500">PNG, JPG, PDF asset files</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Transaction ID Fields */}
              <div>
                <Label htmlFor="tx-id" className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">
                  Transaction Hash Code / ID
                </Label>
                <Input
                  id="tx-id"
                  type="text"
                  placeholder="e.g., 0xabcdef1234567890..."
                  className="w-full h-11 px-3.5 text-xs bg-gray-50/50 dark:bg-white/[0.01] border border-gray-200 dark:border-white/[0.06] text-gray-900 dark:text-white rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
              </div>

              {/* Textarea Notes fields */}
              <div>
                <Label htmlFor="notes" className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-slate-500 mb-2">
                  Memo Log Notes (Optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Exchange name node, time tracking stamp metadata..."
                  className="w-full px-3.5 py-2 text-xs bg-gray-50/50 dark:bg-white/[0.01] border border-gray-200 dark:border-white/[0.06] text-gray-900 dark:text-white rounded-xl focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Form Submission Action trigger */}
              <Button
                type="submit"
                disabled={submitStatus === "pending"}
                className={`w-full ${colors.button} font-bold h-11 text-xs flex items-center justify-center gap-2 rounded-xl transition-all shadow-lg shadow-black/5 cursor-pointer`}
              >
                {submitStatus === "pending" ? "Validating Frame Node..." : "Submit Payment Proof"}
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}

// --- MAIN PAGE WRAPPER WITH SUSPENSE DECORATION ---
export default function SubmitPaymentPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50 dark:bg-[#080d17] transition-colors duration-200">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 pb-24 md:pb-8 mb-[50px] md:mb-0">
          <div className="max-w-6xl mx-auto mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Submit Payment Proof
            </h1>
          </div>

          <Suspense fallback={<div className="text-gray-500 text-sm p-8 text-center">Loading allocation frameworks...</div>}>
            <PaymentFormContent />
          </Suspense>
        </main>

        <UserNav />
      </div>
    </div>
  );
}