// Financial Reports Types

export interface OverviewMetric {
  id: string;
  label: string;
  value: number;
  trend: number;
  trendDirection: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}

export interface CashFlowData {
  date: string;
  income: number;
  expense: number;
}

export interface CategorySpending {
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface AssetAllocation {
  assetType: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  value: number;
  percentage: number;
}

export interface AssetGrowthData {
  date: string;
  value: number;
}

export interface FinancialGoalProgress {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  progress: number;
  status: 'onTrack' | 'delayed' | 'completed';
  icon: string;
  color: string;
}

export interface SmartInsight {
  id: string;
  type: 'warning' | 'success' | 'info';
  title: string;
  description: string;
  icon: string;
}

export interface WalletAnalysis {
  wallet: {
    id: string;
    name: string;
    type: 'cash' | 'bank' | 'credit' | 'ewallet';
    icon: string;
    color: string;
  };
  balance: number;
  monthlySpending: number;
  transactionCount: number;
  percentage: number;
}

export interface TransactionSummary {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  wallet: {
    id: string;
    name: string;
  };
  date: string;
  time: string;
}

export interface TransactionGroup {
  date: string;
  label: string;
  transactions: TransactionSummary[];
}

export interface FilterOptions {
  timeRange: 'today' | '7days' | '30days' | 'thisMonth' | 'thisYear' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
  walletId?: string;
  assetTypeId?: string;
  categoryId?: string;
  transactionType?: 'all' | 'income' | 'expense';
}

export interface FinancialReportsData {
  overview: OverviewMetric[];
  cashFlow: CashFlowData[];
  spendingByCategory: CategorySpending[];
  assetAllocation: AssetAllocation[];
  assetGrowth: AssetGrowthData[];
  financialGoals: FinancialGoalProgress[];
  insights: SmartInsight[];
  recentTransactions: TransactionGroup[];
  walletAnalysis: WalletAnalysis[];
}