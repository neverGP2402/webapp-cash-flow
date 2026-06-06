export type CategoryType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: number;
  code: string;
  name: string;
  type: CategoryType;
  is_deleted: boolean;
  description?: string;
}

export type WalletType = 'BANK' | 'E_WALLET' | 'CASH' | 'INVESTMENT' | 'CRYPTO';

export interface Wallet {
  id: number;
  user_id: number;
  code: string;
  name: string;
  type: WalletType;
  is_deleted: boolean;
  description?: string;
  balance?: number;
}