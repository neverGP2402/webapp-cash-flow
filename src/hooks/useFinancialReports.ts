import { useState, useEffect, useCallback, useMemo } from 'react';
import type { FinancialReportsData, FilterOptions } from 'src/types/financial-reports';

// Mock data generator - in real app, this would come from API
const generateMockData = (filters: FilterOptions): FinancialReportsData => {
  const now = new Date();
  const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  // Generate cash flow data
  const cashFlowData = Array.from({ length: 30 }, (_, i) => {
    const date = daysAgo(29 - i);
    return {
      date: date.toISOString().split('T')[0],
      income: Math.floor(Math.random() * 5000000) + 1000000,
      expense: Math.floor(Math.random() * 3000000) + 500000,
    };
  });

  // Generate asset growth data
  const assetGrowthData = Array.from({ length: 90 }, (_, i) => {
    const date = daysAgo(89 - i);
    const baseValue = 50000000;
    const growth = i * 500000 + Math.random() * 1000000;
    return {
      date: date.toISOString().split('T')[0],
      value: baseValue + growth,
    };
  });

  return {
    overview: [
      {
        id: 'income',
        label: 'totalIncome',
        value: 45000000,
        trend: 15,
        trendDirection: 'up',
        icon: 'solar:arrow-down-bold-duotone',
        color: '#10B981',
      },
      {
        id: 'expense',
        label: 'totalExpense',
        value: 32000000,
        trend: 8,
        trendDirection: 'up',
        icon: 'solar:arrow-up-bold-duotone',
        color: '#EF4444',
      },
      {
        id: 'netWorth',
        label: 'netWorth',
        value: 125000000,
        trend: 12,
        trendDirection: 'up',
        icon: 'solar:wallet-money-bold-duotone',
        color: '#3B82F6',
      },
      {
        id: 'profit',
        label: 'profit',
        value: 13000000,
        trend: 23,
        trendDirection: 'up',
        icon: 'solar:chart-bold-duotone',
        color: '#8B5CF6',
      },
      {
        id: 'debt',
        label: 'debt',
        value: 5000000,
        trend: 5,
        trendDirection: 'down',
        icon: 'solar:danger-circle-bold-duotone',
        color: '#F59E0B',
      },
      {
        id: 'savings',
        label: 'savings',
        value: 8500000,
        trend: 18,
        trendDirection: 'up',
        icon: 'solar:piggy-bank-bold-duotone',
        color: '#06B6D4',
      },
    ],
    cashFlow: cashFlowData,
    spendingByCategory: [
      {
        category: { id: 'food', name: 'Food & Dining', icon: 'solar:utensils-bold', color: '#FF6B6B' },
        amount: 8500000,
        percentage: 26.6,
        transactionCount: 45,
      },
      {
        category: { id: 'transport', name: 'Transportation', icon: 'solar:car-bold', color: '#4ECDC4' },
        amount: 4200000,
        percentage: 13.1,
        transactionCount: 28,
      },
      {
        category: { id: 'shopping', name: 'Shopping', icon: 'solar:bag-bold', color: '#45B7D1' },
        amount: 6800000,
        percentage: 21.3,
        transactionCount: 22,
      },
      {
        category: { id: 'entertainment', name: 'Entertainment', icon: 'solar:film-bold', color: '#96CEB4' },
        amount: 3200000,
        percentage: 10.0,
        transactionCount: 15,
      },
      {
        category: { id: 'utilities', name: 'Utilities', icon: 'solar:lightning-bold', color: '#FFEAA7' },
        amount: 2800000,
        percentage: 8.8,
        transactionCount: 8,
      },
    ],
    assetAllocation: [
      {
        assetType: { id: 'cash', name: 'assetAllocation.cash', icon: 'solar:cash-bold', color: '#10B981' },
        value: 25000000,
        percentage: 20,
      },
      {
        assetType: { id: 'gold', name: 'assetAllocation.gold', icon: 'solar:gem-bold', color: '#F59E0B' },
        value: 35000000,
        percentage: 28,
      },
      {
        assetType: { id: 'crypto', name: 'assetAllocation.crypto', icon: 'solar:bitcoin-bold', color: '#8B5CF6' },
        value: 20000000,
        percentage: 16,
      },
      {
        assetType: { id: 'usd', name: 'assetAllocation.usd', icon: 'solar:banknote-bold', color: '#3B82F6' },
        value: 15000000,
        percentage: 12,
      },
      {
        assetType: { id: 'others', name: 'assetAllocation.others', icon: 'solar:box-bold', color: '#6B7280' },
        value: 30000000,
        percentage: 24,
      },
    ],
    assetGrowth: assetGrowthData,
    financialGoals: [
      {
        id: '1',
        name: 'Emergency Fund',
        targetAmount: 50000000,
        currentAmount: 35000000,
        deadline: '2024-12-31',
        progress: 70,
        status: 'onTrack',
        icon: 'solar:shield-check-bold',
        color: '#10B981',
      },
      {
        id: '2',
        name: 'Car Purchase',
        targetAmount: 500000000,
        currentAmount: 150000000,
        deadline: '2025-06-30',
        progress: 30,
        status: 'delayed',
        icon: 'solar:car-bold',
        color: '#EF4444',
      },
      {
        id: '3',
        name: 'Travel Fund',
        targetAmount: 80000000,
        currentAmount: 60000000,
        deadline: '2024-08-15',
        progress: 75,
        status: 'onTrack',
        icon: 'solar:plane-bold',
        color: '#3B82F6',
      },
    ],
    insights: [
      {
        id: '1',
        type: 'warning',
        title: 'spendingIncrease',
        description: 'Your spending this month is 15% higher than last month. Consider reviewing discretionary expenses.',
        icon: 'solar:warning-circle-bold',
      },
      {
        id: '2',
        type: 'success',
        title: 'savingBetter',
        description: 'Great job! You\'ve saved 20% more than last month. Keep up the good work!',
        icon: 'solar:check-circle-bold',
      },
      {
        id: '3',
        type: 'info',
        title: 'categoryWarning',
        description: 'Food & Dining category is taking 27% of your budget. This is above the recommended 15-20%.',
        icon: 'solar:info-circle-bold',
      },
    ],
    recentTransactions: [
      {
        date: new Date().toISOString().split('T')[0],
        label: 'today',
        transactions: [
          {
            id: '1',
            name: 'Coffee & Breakfast',
            amount: 150000,
            type: 'expense',
            category: { id: 'food', name: 'Food & Dining', icon: 'solar:utensils-bold', color: '#FF6B6B' },
            wallet: { id: 'cash', name: 'Cash' },
            date: new Date().toISOString().split('T')[0],
            time: '08:30',
          },
          {
            id: '2',
            name: 'Freelance Payment',
            amount: 5000000,
            type: 'income',
            category: { id: 'income', name: 'Income', icon: 'solar:arrow-down-bold', color: '#10B981' },
            wallet: { id: 'bank', name: 'Bank Account' },
            date: new Date().toISOString().split('T')[0],
            time: '10:15',
          },
        ],
      },
      {
        date: daysAgo(1).toISOString().split('T')[0],
        label: 'yesterday',
        transactions: [
          {
            id: '3',
            name: 'Grocery Shopping',
            amount: 850000,
            type: 'expense',
            category: { id: 'food', name: 'Food & Dining', icon: 'solar:utensils-bold', color: '#FF6B6B' },
            wallet: { id: 'card', name: 'Credit Card' },
            date: daysAgo(1).toISOString().split('T')[0],
            time: '18:45',
          },
        ],
      },
    ],
    walletAnalysis: [
      {
        wallet: { id: 'cash', name: 'Cash', type: 'cash', icon: 'solar:cash-bold', color: '#10B981' },
        balance: 5000000,
        monthlySpending: 8500000,
        transactionCount: 45,
        percentage: 15,
      },
      {
        wallet: { id: 'bank', name: 'Bank Account', type: 'bank', icon: 'solar:bank-bold', color: '#3B82F6' },
        balance: 25000000,
        monthlySpending: 15000000,
        transactionCount: 28,
        percentage: 35,
      },
      {
        wallet: { id: 'card', name: 'Credit Card', type: 'credit', icon: 'solar:card-bold', color: '#8B5CF6' },
        balance: -3000000,
        monthlySpending: 12000000,
        transactionCount: 35,
        percentage: 30,
      },
      {
        wallet: { id: 'ewallet', name: 'E-Wallet', type: 'ewallet', icon: 'solar:wallet-bold', color: '#06B6D4' },
        balance: 2000000,
        monthlySpending: 4500000,
        transactionCount: 22,
        percentage: 20,
      },
    ],
  };
};

export function useFinancialReports(initialFilters?: Partial<FilterOptions>) {
  const [data, setData] = useState<FinancialReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterOptions>({
    timeRange: 'thisMonth',
    ...initialFilters,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, this would be an API call
      const mockData = generateMockData(filters);
      setData(mockData);
    } catch (err) {
      setError('Failed to fetch financial reports data');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const summary = useMemo(() => {
    if (!data) return null;

    const totalIncome = data.overview.find(m => m.id === 'income')?.value || 0;
    const totalExpense = data.overview.find(m => m.id === 'expense')?.value || 0;
    const netWorth = data.overview.find(m => m.id === 'netWorth')?.value || 0;
    const savings = data.overview.find(m => m.id === 'savings')?.value || 0;

    return {
      totalIncome,
      totalExpense,
      netWorth,
      savings,
      savingsRate: totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0,
    };
  }, [data]);

  return {
    data,
    loading,
    error,
    filters,
    updateFilters,
    refresh,
    summary,
  };
}