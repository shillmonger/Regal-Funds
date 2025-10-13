export interface User {
  _id?: string;
  name: string;
  email: string;
  passwordHash: string;
  walletAddress?: string;
  role?: "user" | "admin";
  status?: "active" | "blocked" | "banned";
  createdAt?: Date;
  balance?: number;
  totalInvested?: number;
  totalEarnings?: number;
  welcomeBonusGranted?: boolean;
}
