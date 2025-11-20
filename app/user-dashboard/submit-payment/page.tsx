"use client";

import React, { useState, useMemo } from "react";
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
import { Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// 👈 SHADCN DROPDOWN IMPORTS
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// --- THEME UTILITIES (Replaces old hardcoded styles) ---

// Utility function for background and border, simplifying the main file.
const getCardClasses = (additionalClasses = "") =>
  `bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 ${additionalClasses}`;

// Utility function for input fields
const getInputClasses = () =>
  `bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 focus:ring-emerald-500 focus:border-emerald-500`;

// Accent colors (Emerald for Success/Primary Action)
const ACCENT_MAIN =
  "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600";
const TEXT_ACCENT = "text-emerald-600 dark:text-emerald-500";
const TEXT_PRIMARY = "text-gray-900 dark:text-gray-100";
const TEXT_SECONDARY = "text-gray-600 dark:text-gray-400";
// --------------------------------------------------------

// Selected plan comes from URL

// Payment wallets
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

// Status types (Adjusted background classes for light/dark)
const statusTypes = {
  pending: {
    icon: Clock,
    color: "text-yellow-600 dark:text-yellow-400",
    bg: "bg-yellow-50 dark:bg-yellow-950/40",
    border: "border-yellow-400 dark:border-yellow-800",
    title: "Pending Review",
    message:
      "Your payment proof is being reviewed by our team. This usually takes 10-30 minutes. You will be notified when the status changes.",
  },
  approved: {
    icon: CheckCircle,
    color: "text-emerald-600 dark:text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    border: "border-emerald-500 dark:border-emerald-800",
    title: "Payment Approved",
    message:
      "Your payment has been verified! Your investment is now active and earning returns.",
  },
  rejected: {
    icon: XCircle,
    color: "text-red-600 dark:text-red-500",
    bg: "bg-red-50 dark:bg-red-950/40",
    border: "border-red-500 dark:border-red-800",
    title: "Payment Rejected",
    message:
      "Your payment proof was rejected. Please check the details and resubmit with correct information or contact support.",
  },
};

export default function SubmitPaymentPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const params = useSearchParams();
  const selectedPlan = {
    name: params.get("name") || "Selected Plan",
    amount: Number(params.get("amount")) || 0,
    roi: Number(params.get("roi")) || 10,
    duration: Number(params.get("duration")) || 30,
    id: params.get("id") || undefined,
  } as const;
  // State for the selected crypto index remains the same
  const [selectedCryptoIndex, setSelectedCryptoIndex] = useState(0); 
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [notes, setNotes] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [submitStatus, setSubmitStatus] = useState<
    "pending" | "approved" | "rejected" | null
  >(null);
  const [isDragging, setIsDragging] = useState(false);

  const selectedWallet = useMemo(
    () => paymentWallets[selectedCryptoIndex],
    [selectedCryptoIndex]
  );
  const currentStatus = submitStatus ? statusTypes[submitStatus] : null;

  // Copy wallet address
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  // File upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5000000) {
      setUploadedFile(file);
    } else {
      // Keep UI calm; optionally show toast later
      setUploadedFile(null);
    }
  };

  // Drag/drop
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
      alert("File size must be less than 5MB");
      setUploadedFile(null);
    }
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFile && !transactionId) {
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

      // Show success toast
      toast.success("Payment proof submitted successfully! Your submission is pending review.");
      // Keep status as pending; admin will approve/reject from dashboard
    } catch (error) {
      console.error("Payment submit error", error);
      toast.error("An error occurred while submitting your payment proof");
      setSubmitStatus(null);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Header */}
<div>
  <Header setSidebarOpen={setSidebarOpen} />
</div>


        <main className="flex-1 mb-[100px] md:mb-0">
          <div className="px-4 sm:px-6 lg:px-8 py-5 w-full max-w-9xl mx-auto">
            {/* Page header */}
            <div className="mb-6">
              <h1 className={`text-2xl md:text-3xl ${TEXT_PRIMARY} font-bold`}>
                Submit Payment Proof
              </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-1 space-y-8">
                {/* Plan Info */}
                <Card className={getCardClasses()}>
                  <CardHeader>
                    <CardTitle className={TEXT_PRIMARY}>
                      <Package className={`${TEXT_ACCENT} inline h-5 w-5 mr-2`} />
                      Investment Details
                    </CardTitle>
                    <CardDescription className={TEXT_SECONDARY}>
                      Verify the plan you are paying for.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className={TEXT_SECONDARY}>Plan Name:</span>
                      <span className={`font-semibold ${TEXT_PRIMARY}`}>
                        {selectedPlan.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={TEXT_SECONDARY}>Amount:</span>
                      <span className={`font-bold ${TEXT_ACCENT}`}>
                        ${selectedPlan.amount.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Wallet */}
                <Card className={getCardClasses()}>
                  <CardHeader>
                    <CardTitle className={TEXT_PRIMARY}>
                      <DollarSign className={`${TEXT_ACCENT} inline h-5 w-5 mr-2`} />
                      Payment Wallet
                    </CardTitle>
                    <CardDescription className={TEXT_SECONDARY}>
                      Select the crypto you sent and find the official wallet
                      address.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
<Label htmlFor="crypto-select" className={`${TEXT_PRIMARY} mb-2`}>
                      Crypto Type
                    </Label>

                    {/* 🚀 SHADCN DROPDOWN MENU IMPLEMENTATION 🚀 */}
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button
      variant="outline"
      className={`w-full justify-between h-10 ${getInputClasses()}`}
    >
      <span className={`${selectedWallet.color} font-medium`}>
        {selectedWallet.crypto}
      </span>
      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </DropdownMenuTrigger>
  {/* 👇 FIX: Added w-[var(--radix-dropdown-menu-trigger-width)] class */}
  <DropdownMenuContent 
    className="w-full"
    style={{ width: 'var(--radix-dropdown-menu-trigger-width)' }}
  >
    {paymentWallets.map((wallet, index) => (
      <DropdownMenuItem
        key={index}
        onSelect={() => setSelectedCryptoIndex(index)}
        className={`cursor-pointer ${
          index === selectedCryptoIndex
            ? TEXT_ACCENT + " font-semibold bg-gray-100 dark:bg-gray-800"
            : ""
        }`}
      >
        <span className={wallet.color}>
          {wallet.crypto}
        </span>
      </DropdownMenuItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>
                    {/* 🚀 END DROPDOWN MENU IMPLEMENTATION 🚀 */}

                    <div
                      className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-2`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${TEXT_PRIMARY}`}>
                          {selectedWallet.crypto} Address
                        </span>
                        <div
                          className={`text-xs font-medium px-2 py-1 rounded-full ${selectedWallet.color} bg-gray-100 dark:bg-gray-800`}
                        >
                          {selectedWallet.network}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Input
                          type="text"
                          readOnly
                          value={selectedWallet.address}
                          className={`flex-1 overflow-x-auto text-sm mr-2 ${getInputClasses()} h-10`}
                        />
                        <Button
                          onClick={() => copyToClipboard(selectedWallet.address)}
                          className={`h-10 px-3 flex-shrink-0 ${ACCENT_MAIN}`}
                        >
                          {copiedAddress ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className={`text-xs ${TEXT_SECONDARY}`}>
                        I Sent exactly ${selectedPlan.amount.toLocaleString()} to
                        this address.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-1 space-y-8">
                {/* Status Notification */}
                {submitStatus && currentStatus && (
                  <Card
                    className={`${currentStatus.bg} border ${currentStatus.border} border-l-4`}
                  >
                    <CardHeader>
                      <CardTitle
                        className={`${currentStatus.color} flex items-center`}
                      >
                        {(() => {
                          const StatusIcon = currentStatus.icon;
                          return <StatusIcon className="h-6 w-6 mr-2" />;
                        })()}
                        {currentStatus.title}
                      </CardTitle>
                      <CardDescription className={TEXT_SECONDARY}>
                        {currentStatus.message}
                      </CardDescription>
                    </CardHeader>
                    {submitStatus === "pending" && (
                      <CardContent>
                        <div className="text-sm italic text-gray-500">
                          This status will automatically update upon admin
                          review.
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )}

                {/* Proof Submission Form */}
                {submitStatus !== "approved" && (
                  <Card className={getCardClasses()}>
                    <CardHeader>
                      <CardTitle className={TEXT_PRIMARY}>
                        <Upload
                          className={`${TEXT_ACCENT} inline h-5 w-5 mr-2`}
                        />
                        Proof Submission
                      </CardTitle>
                      <CardDescription className={TEXT_SECONDARY}>
                        Upload a screenshot or provide the transaction ID to
                        verify your payment.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* File Upload */}
                        <div>
                          <Label className={TEXT_PRIMARY}>
                            Upload Screenshot (Max 5MB)
                          </Label>
                          <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`mt-1 flex justify-center items-center h-32 border-2 border-dashed rounded-lg cursor-pointer transition 
                                ${
                                  isDragging
                                    ? "border-emerald-500 bg-gray-50 dark:bg-gray-900"
                                    : "border-gray-300 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500"
                                } 
                                ${uploadedFile ? "border-emerald-500" : ""}`}
                          >
                            <input
                              id="file-upload"
                              type="file"
                              className="hidden"
                              onChange={handleFileChange}
                              accept="image/*, .pdf"
                            />
                            <label
                              htmlFor="file-upload"
                              className={`text-center ${TEXT_SECONDARY}`}
                            >
                              {uploadedFile ? (
                                <span
                                  className={`${TEXT_ACCENT} flex items-center justify-center`}
                                >
                                  <FileText className="h-5 w-5 mr-2" />
                                  {uploadedFile.name}
                                </span>
                              ) : (
                                <span className="space-y-1">
                                  <Upload
                                    className={`mx-auto h-8 w-8 ${TEXT_ACCENT}`}
                                  />
                                  <p className="text-sm">
                                    Drag and drop or{" "}
                                    <span className={TEXT_ACCENT}>
                                      click to browse
                                    </span>
                                  </p>
                                  <p className="text-xs">
                                    PNG, JPG, PDF up to 5MB
                                  </p>
                                </span>
                              )}
                            </label>
                          </div>
                        </div>

                        {/* Transaction ID */}
                        <div>
                          <Label htmlFor="tx-id" className={TEXT_PRIMARY}>
                            Transaction Hash / ID (Required if no file)
                          </Label>
                          <Input
                            id="tx-id"
                            type="text"
                            placeholder="e.g., 0xabcdef1234567890..."
                            className={`mt-1 ${getInputClasses()}`}
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                          />
                        </div>

                        {/* Notes */}
                        <div>
                          <Label htmlFor="notes" className={TEXT_PRIMARY}>
                            Notes (Exchange Name, Time Sent, etc.)
                          </Label>
                          <Textarea
                            id="notes"
                            placeholder="Optional: Mention the exchange you used or any specific details."
                            className={`mt-1 ${getInputClasses()}`}
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                          />
                        </div>

                        {/* Submit */}
                        <Button
                          type="submit"
                          className={`w-full py-2 text-white font-semibold cursor-pointer ${ACCENT_MAIN}`}
                          disabled={submitStatus === "pending"}
                        >
                          {submitStatus === "pending"
                            ? "Submitting & Waiting..."
                            : "Submit Proof"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <UserNav />
      </div>
      {/* <Toaster position="top-center" richColors closeButton /> */}
    </div>
  );
}