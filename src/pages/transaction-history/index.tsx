import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Typography,
  Card,
  CardContent,
  Fab,
  Skeleton,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { TransactionCard } from 'src/components/transaction-card';
import { TransactionFilters } from 'src/components/transaction-filters';
import { MiniAnalytics } from 'src/components/mini-analytics';
import { QuickInsightsComponent } from 'src/components/quick-insights';
import { TransactionDrawer } from 'src/components/transaction-drawer';

import type { 
  Transaction, 
  TransactionGroup, 
  FilterOptions, 
  MonthlyStats, 
  CategorySpending, 
  QuickInsights 
} from 'src/types/transaction';

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    name: 'Coffee & Breakfast',
    description: 'Morning coffee at Starbucks',
    amount: 150000,
    type: 'expense',
    status: 'completed',
    category: { id: 'food', name: 'Food & Dining', icon: 'solar:cart-3-bold', color: '#FF6B6B' },
    wallet: { id: 'credit', name: 'Credit Card', type: 'credit', balance: 5000000, currency: 'VND' },
    date: '2024-01-15',
    time: '08:30',
    note: 'Meeting with client',
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-15T08:30:00Z',
  },
  {
    id: '2',
    name: 'Salary',
    description: 'Monthly salary',
    amount: 15000000,
    type: 'income',
    status: 'completed',
    category: { id: 'salary', name: 'Salary', icon: 'solar:cart-3-bold', color: '#4ECDC4' },
    wallet: { id: 'bank', name: 'Bank Account', type: 'bank', balance: 20000000, currency: 'VND' },
    date: '2024-01-15',
    time: '09:00',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
  },
  {
    id: '3',
    name: 'Grab Ride',
    description: 'Trip to office',
    amount: 85000,
    type: 'expense',
    status: 'completed',
    category: { id: 'transport', name: 'Transportation', icon: 'solar:cart-3-bold', color: '#4ECDC4' },
    wallet: { id: 'ewallet', name: 'Momo', type: 'ewallet', balance: 1500000, currency: 'VND' },
    date: '2024-01-15',
    time: '07:45',
    createdAt: '2024-01-15T07:45:00Z',
    updatedAt: '2024-01-15T07:45:00Z',
  },
  {
    id: '4',
    name: 'Shopping',
    description: 'Grocery shopping at Big C',
    amount: 1250000,
    type: 'expense',
    status: 'completed',
    category: { id: 'shopping', name: 'Shopping', icon: 'solar:cart-3-bold', color: '#FFD93D' },
    wallet: { id: 'cash', name: 'Cash', type: 'cash', balance: 3000000, currency: 'VND' },
    date: '2024-01-14',
    time: '18:30',
    createdAt: '2024-01-14T18:30:00Z',
    updatedAt: '2024-01-14T18:30:00Z',
  },
  {
    id: '5',
    name: 'Freelance Project',
    description: 'Website design payment',
    amount: 5000000,
    type: 'income',
    status: 'completed',
    category: { id: 'freelance', name: 'Freelance', icon: 'solar:cart-3-bold', color: '#6C63FF' },
    wallet: { id: 'bank', name: 'Bank Account', type: 'bank', balance: 20000000, currency: 'VND' },
    date: '2024-01-14',
    time: '14:20',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T14:20:00Z',
  },
  {
    id: '6',
    name: 'Netflix Subscription',
    description: 'Monthly subscription',
    amount: 260000,
    type: 'expense',
    status: 'completed',
    category: { id: 'entertainment', name: 'Entertainment', icon: 'solar:cart-3-bold', color: '#FF6B6B' },
    wallet: { id: 'credit', name: 'Credit Card', type: 'credit', balance: 5000000, currency: 'VND' },
    date: '2024-01-13',
    time: '12:00',
    createdAt: '2024-01-13T12:00:00Z',
    updatedAt: '2024-01-13T12:00:00Z',
  },
];

const mockMonthlyStats: MonthlyStats = {
  totalExpense: 8500000,
  totalIncome: 15000000,
  totalTransactions: 45,
  largestExpense: 2500000,
};

const mockTopCategories: CategorySpending[] = [
  {
    category: { id: 'food', name: 'Food & Dining', icon: 'solar:cart-3-bold', color: '#FF6B6B' },
    amount: 2500000,
    percentage: 29.4,
    transactionCount: 15,
  },
  {
    category: { id: 'transport', name: 'Transportation', icon: 'solar:cart-3-bold', color: '#4ECDC4' },
    amount: 1200000,
    percentage: 14.1,
    transactionCount: 8,
  },
  {
    category: { id: 'shopping', name: 'Shopping', icon: 'solar:cart-3-bold', color: '#FFD93D' },
    amount: 1800000,
    percentage: 21.2,
    transactionCount: 6,
  },
  {
    category: { id: 'entertainment', name: 'Entertainment', icon: 'solar:cart-3-bold', color: '#FF6B6B' },
    amount: 800000,
    percentage: 9.4,
    transactionCount: 4,
  },
];

const mockQuickInsights: QuickInsights = {
  highestSpendingDay: { date: '2024-01-14', amount: 3750000 },
  topSpendingCategory: mockTopCategories[0],
  largestTransaction: mockTransactions[4],
  spendingTrend: { trend: 'increasing', percentage: 15, period: 'this_month' },
};

export default function TransactionHistoryPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    timeFilter: 'all',
    categoryFilter: 'all',
    walletFilter: 'all',
    typeFilter: 'all',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Transaction Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
    setDrawerMode('create');
    setSelectedTransaction(null);
  };

  const handleEditTransaction = (transaction: any) => {
    setDrawerOpen(true);
    setDrawerMode('edit');
    setSelectedTransaction(transaction);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedTransaction(null);
  };

  const handleSaveTransaction = async (data: any) => {
    // Here you would normally save to API
    console.log('Saving transaction:', data);
    
    // For demo, just close drawer
    handleCloseDrawer();
    
    // You could also update the transaction list here
    // refreshTransactions();
  };

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const groupedTransactions = useMemo(() => {
  // Group transactions by date
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  const groups: TransactionGroup[] = [];
  
  // Get unique dates from transactions
  const uniqueDates = [...new Set(mockTransactions.map(transaction => transaction.date))].sort().reverse();
  
  uniqueDates.forEach(date => {
    const transactionsForDate = mockTransactions.filter(transaction => transaction.date === date);
    let label = date;
    
    if (date === today) {
      label = t('transactionHistory.todayGroup');
    } else if (date === yesterday) {
      label = t('transactionHistory.yesterdayGroup');
    } else {
      // Format date as "15 Jan 2024"
      const dateObj = new Date(date + 'T00:00:00');
      label = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    
    groups.push({
      date,
      label,
      transactions: transactionsForDate,
    });
  });
  
  return groups;
}, [t]);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight={700} sx={{ mb: 1 }}>
          {t('transactionHistory.pageTitle')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your financial journey and cash flow
        </Typography>
      </Box>

      {/* Filters */}
      <TransactionFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Mini Analytics */}
      <Box sx={{ mb: 4 }}>
        {isLoading ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {[1, 2].map((item) => (
              <Card key={item} sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 3 }}>
                  <Skeleton variant="text" width="60%" height={32} sx={{ mb: 3 }} />
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    {[1, 2, 3, 4].map((skeleton) => (
                      <Box key={skeleton}>
                        <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width="60%" height={28} />
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <MiniAnalytics 
            monthlyStats={mockMonthlyStats} 
            topCategories={mockTopCategories} 
          />
        )}
      </Box>

      {/* Quick Insights */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
          {t('transactionHistory.quickInsights')}
        </Typography>
        {isLoading ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 3 }}>
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Skeleton variant="circular" width={40} height={40} sx={{ mx: 'auto', mb: 2 }} />
                  <Skeleton variant="text" width="80%" height={16} sx={{ mx: 'auto', mb: 1 }} />
                  <Skeleton variant="text" width="60%" height={24} sx={{ mx: 'auto' }} />
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <QuickInsightsComponent insights={mockQuickInsights} />
        )}
      </Box>

      {/* Transaction Timeline */}
      <Box>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
          {t('transactionHistory.pageTitle')}
        </Typography>
        
        {isLoading ? (
          <Box>
            {[1, 2, 3].map((group) => (
              <Box key={group} sx={{ mb: 4 }}>
                <Skeleton variant="text" width="30%" height={24} sx={{ mb: 2 }} />
                {[1, 2].map((transaction) => (
                  <Card key={transaction} sx={{ borderRadius: 2, mb: 2 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center" flex={1}>
                          <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                          <Box flex={1}>
                            <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
                            <Skeleton variant="text" width="40%" height={16} />
                          </Box>
                        </Box>
                        <Box textAlign="right">
                          <Skeleton variant="text" width={80} height={24} />
                          <Skeleton variant="text" width={60} height={16} />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ))}
          </Box>
        ) : (
          <>
            {groupedTransactions.map((group) => (
              <Box key={group.date} sx={{ mb: 4 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: 'text.secondary' }}>
                  {group.label}
                </Typography>
                
                {group.transactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))}
              </Box>
            ))}

            {groupedTransactions.length === 0 && (
              <Card sx={{ textAlign: 'center', py: 6 }}>
                <CardContent>
                  <Iconify icon="eva:search-fill" width={64} sx={{ color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                    {t('transactionHistory.noTransactions')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('transactionHistory.noTransactionsDescription')}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </Box>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        onClick={handleOpenDrawer}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <Iconify icon="mingcute:add-line" width={24} />
      </Fab>

      {/* Transaction Drawer */}
      <TransactionDrawer
        open={drawerOpen}
        mode={drawerMode}
        transaction={selectedTransaction}
        onClose={handleCloseDrawer}
        onSave={handleSaveTransaction}
      />
    </Box>
  );
}
