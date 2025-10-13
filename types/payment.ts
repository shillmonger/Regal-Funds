export interface Payment {
  _id?: string;
  userId: string; // Mongo _id as string
  userEmail: string;
  userName?: string;
  amount: number;
  planId?: string | number | null;
  planName: string;
  roi: number;
  duration: number; // in days
  crypto: string;
  walletAddress: string;
  transactionId?: string | null;
  notes?: string | null;
  status: "Pending" | "Approved" | "Rejected"; // Approved indicates paid
  createdAt: string; // ISO string
  paidAt?: string; // ISO when approved
}
