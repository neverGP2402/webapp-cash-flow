import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Card,
  CardContent,
  Fab,
  Skeleton,
  Typography,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { MiniAnalytics } from 'src/components/mini-analytics';
import { QuickInsightsComponent } from 'src/components/quick-insights';
import { TransactionCard } from 'src/components/transaction-card';
import { TransactionDrawer } from 'src/components/transaction-drawer';
import { TransactionFilters } from 'src/components/transaction-filters';

import { useToast } from 'src/components/toast';
import { TransactionData, transactionService } from 'src/services/transaction-service';
import type {
  FilterOptions,
  TransactionGroup
} from 'src/types/transaction';

export default function TransactionHistoryPage() {
  const { t } = useTranslation('common');
  const { showSuccess, showError } = useToast();

  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    timeFilter: 'all',
    categoryFilter: 'all',
    walletFilter: 'all',
    typeFilter: 'all',
  });

  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Transaction Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionData | null>(null);

  const handleOpenDrawer = () => {
    setDrawerOpen(true);
    setDrawerMode('create');
    setSelectedTransaction(null);
  };

  const handleEditTransaction = (transaction: TransactionData) => {
    setDrawerOpen(true);
    setDrawerMode('edit');
    setSelectedTransaction(transaction);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedTransaction(null);
  };

  const handleSaveTransaction = async (data: any) => {
    try {
      if (drawerMode === 'create') {
        await transactionService.createTransaction(data);
        showSuccess(t('transactionHistory.createSuccess'));
      } else if (selectedTransaction) {
        await transactionService.updateTransaction(selectedTransaction.id, data);
        showSuccess(t('transactionHistory.updateSuccess'));
      }
      handleCloseDrawer();
      fetchTransactions();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Action failed');
    }
  };

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await transactionService.getTransactions({
        page,
        limit: 10,
        type: filters.typeFilter !== 'all' ? filters.typeFilter.toUpperCase() : undefined,
        wallet_id: filters.walletFilter !== 'all' ? filters.walletFilter : undefined,
        // Note: Map other filters if API supports them
      });
      
      // API response structure based on doc: { data: { data: [...], pagination: {...} } }
      // Our service returns result.data which is the inner object
      setTransactions(response.data || []);
      setTotalItems(response.pagination?.total || 0);
    } catch (error) {
      showError('Failed to fetch transactions');
      console.error(error);
    } finally {
      // Simulate a bit of loading for UX or use real status
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [page, filters, showSuccess, showError]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const groupedTransactions = useMemo(() => {
  // Group transactions by date
  if (!transactions.length) return [];

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  const groups: TransactionGroup[] = [];
  
  // Get unique dates from transactions
  const uniqueDates = [...new Set(transactions.map(transaction => transaction.date))].sort().reverse();
  
  uniqueDates.forEach(date => {
    const transactionsForDate = transactions.filter(transaction => transaction.date === date);
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
      transactions: transactionsForDate as any,
    });
  });
  
  return groups;
}, [t, transactions]);

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setPage(1);
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
            // These might need real API endpoints for analytics
            // Temporarily using empty or partial data until those APIs are integrated
            monthlyStats={{ totalExpense: 0, totalIncome: 0, totalTransactions: totalItems, largestExpense: 0 }} 
            topCategories={[]} 
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
          <QuickInsightsComponent
            insights={{
              highestSpendingDay: {
                date: transactions.length > 0 ? transactions[0].date : new Date().toISOString(),
                amount: 0,
              },
              topSpendingCategory: {
                category: { id: '', name: 'N/A', icon: '📁', color: '#ccc' },
                amount: 0,
                percentage: 0,
                transactionCount: 0,
              },
              largestTransaction: (transactions[0] || {}) as any,
              spendingTrend: { trend: 'stable', percentage: 0, period: 'this_month' },
            }}
          />
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
                    transaction={transaction as any}
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
        transaction={selectedTransaction as any}
        onClose={handleCloseDrawer}
        onSave={handleSaveTransaction}
      />
    </Box>
  );
}
