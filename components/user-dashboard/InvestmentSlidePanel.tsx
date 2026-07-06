import React from 'react';
import { X, Calendar, DollarSign, TrendingUp, Clock } from 'lucide-react';

type InvestmentStatus = "Active" | "Completed" | "Expired";

interface ProfitHistory {
  date: string;
  rate: number;
  amount: number;
}

interface Investment {
  _id: string;
  userId: string;
  userEmail: string;
  userName: string;
  planId: string;
  planName: string;
  amount: number;
  roi: number;
  duration: number;
  approvedAt: string | Date;
  status: InvestmentStatus;
  earnings: number;
  durationDays: number;
  dailyPercent: number;
  daysAccrued: number;
  lastAccruedAt: string | Date;
  canWithdraw: boolean;
  firstPayoutDate: string | Date | null;
  // Computed fields (not in DB)
  id: string;
  roiRate: number;
  investmentAmount: number;
  daysPassed: number;
  profitEarned: number;
  completionPercentage: number;
  endDate: string | Date;
  lastProfitDate?: string | Date;
  profitHistory: ProfitHistory[];
}

interface InvestmentSlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  investments: Investment[];
}

export const InvestmentSlidePanel: React.FC<InvestmentSlidePanelProps> = ({
  isOpen,
  onClose,
  investments
}) => {
  if (!isOpen) return null;

  // Sort investments: Active first, then Completed, then Expired
  const sortedInvestments = [...investments].sort((a, b) => {
    const statusOrder = { Active: 0, Completed: 1, Expired: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[400]"
        onClick={onClose}
      />

      {/* Slide Panel */}
      <div
        className={`fixed top-0 right-0 h-full bg-white dark:bg-[#0f1623] border-l border-gray-200/80 dark:border-white/[0.06] shadow-2xl z-[400] transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          w-full lg:w-[30%]
        `}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-[#0f1623] border-b border-gray-100 dark:border-white/[0.05] p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-black uppercase tracking-tighter text-gray-900 dark:text-white">
              All Investments
            </h2>
            <p className="text-xs text-gray-500 dark:text-slate-500">
              {sortedInvestments.length} investment{sortedInvestments.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/[0.08] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-full pb-20">
          {sortedInvestments.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-gray-500 dark:text-slate-500">No investments found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-white/[0.04]">
              {sortedInvestments.map((inv) => (
                <div key={inv._id.toString()} className="p-4 space-y-4">
                  {/* Investment Header */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                        {inv.planName}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider ${
                          inv.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : inv.status === 'Completed'
                            ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>

                    <div className="text-2xl font-black text-gray-900 dark:text-white">
                      ${inv.amount.toLocaleString()}
                    </div>
                  </div>

                  {/* Investment Details */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-slate-500">
                      <Calendar className="w-3 h-3" />
                      <span>{inv.durationDays} days</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{inv.daysAccrued}/{inv.durationDays} days</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-slate-500">
                      <TrendingUp className="w-3 h-3" />
                      <span>{inv.roi}% daily</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                      <DollarSign className="w-3 h-3" />
                      <span>${inv.earnings.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-[9px] uppercase tracking-wider text-gray-400 dark:text-slate-600 mb-1">
                      <span>Progress</span>
                      <span className="text-gray-900 dark:text-white">{((inv.daysAccrued / inv.durationDays) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 dark:bg-white/[0.08] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-900 dark:bg-white rounded-full transition-all"
                        style={{ width: `${(inv.daysAccrued / inv.durationDays) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
