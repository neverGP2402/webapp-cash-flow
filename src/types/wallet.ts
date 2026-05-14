// Wallet Management Types

export interface Wallet {
  id: string;
  user_id: string;
  code: string;
  name: string;
  type: WalletType;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export type WalletType = 'bank' | 'ewallet' | 'cash' | 'investment' | 'crypto';

export interface WalletOverview {
  totalWallets: number;
  totalBalance: number;
  mostActiveWallet: string;
  totalTransactionsThisMonth: number;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  created_at: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface WalletFilterOptions {
  search: string;
  type: 'all' | WalletType;
  status: 'all' | 'active' | 'inactive';
}

export interface WalletFormData {
  name: string;
  code: string;
  type: WalletType;
  description?: string;
  is_active: boolean;
}

export interface WalletValidationErrors {
  name?: string;
  code?: string;
  type?: string;
}