export type TransactionType = 'income' | 'expense';

export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Wallet {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'credit' | 'ewallet';
  balance: number;
  currency: string;
}

export interface TransactionProduct {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Transaction {
  id: string;
  name: string;
  description?: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  category: Category;
  wallet: Wallet;
  date: string;
  time: string;
  receiptImage?: string;
  note?: string;
  products?: TransactionProduct[];
  createdAt: string;
  updatedAt: string;
}

export interface TransactionGroup {
  date: string;
  label: string;
  transactions: Transaction[];
}

export interface MonthlyStats {
  totalExpense: number;
  totalIncome: number;
  totalTransactions: number;
  largestExpense: number;
  largestExpenseTransaction?: Transaction;
}

export interface CategorySpending {
  category: Category;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface SpendingTrend {
  trend: 'increasing' | 'decreasing' | 'stable';
  percentage: number;
  period: string;
}

export interface QuickInsights {
  highestSpendingDay: {
    date: string;
    amount: number;
  };
  topSpendingCategory: CategorySpending;
  largestTransaction: Transaction;
  spendingTrend: SpendingTrend;
}

export interface FilterOptions {
  searchTerm: string;
  timeFilter: string;
  categoryFilter: string;
  walletFilter: string;
  typeFilter: string;
}

export type TimeFilter = 'all' | 'today' | 'yesterday' | 'thisWeek' | 'thisMonth' | 'lastMonth';

export type TypeFilter = 'all' | 'income' | 'expense';
