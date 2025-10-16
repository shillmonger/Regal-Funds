export type WithdrawalStatus = "Pending" | "Approved" | "Rejected";

export interface Withdrawal {
  _id?: string;
  userId: string;
  userEmail: string;
  userName?: string;
  amount: number;
  walletAddress: string;
  crypto: string;
  status: WithdrawalStatus;
  requestedAt: string; // ISO
  approvedAt?: string | null; // ISO
  txHash?: string | null;
  adminNote?: string | null;
  investmentId?: string | null; // optional link to completed investment
}
