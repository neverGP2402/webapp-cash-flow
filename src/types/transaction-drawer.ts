export type TransactionDrawerMode = 'create' | 'edit';

export type TransactionType = 'income' | 'expense';

export interface TransactionDetailItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface TransactionFormData {
  id?: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  walletId: string;
  date: string;
  description?: string;
  note?: string;
  referenceCode?: string;
  tags?: string[];
  receiptImage?: File | string | null;
  detailItems?: TransactionDetailItem[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Wallet {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'credit' | 'ewallet';
  balance: number;
  currency: string;
  icon: string;
  color: string;
}

export interface TransactionDrawerProps {
  open: boolean;
  mode: TransactionDrawerMode;
  transaction?: TransactionFormData;
  onClose: () => void;
  onSave: (data: TransactionFormData) => Promise<void>;
}

export interface ValidationErrors {
  amount?: string;
  category?: string;
  wallet?: string;
  date?: string;
  description?: string;
  referenceCode?: string;
  tags?: string;
}

export interface TransactionDrawerState {
  formData: TransactionFormData;
  errors: ValidationErrors;
  isSubmitting: boolean;
  isUploading: boolean;
}
