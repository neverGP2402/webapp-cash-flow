import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import {
  Box,
  Container,
  useTheme,
  alpha,
  Skeleton,
} from '@mui/material';

import { DashboardHero } from 'src/components/dashboard-hero';
import { QuickActions } from 'src/components/quick-actions';
import { useFinancialReports } from 'src/hooks/useFinancialReports';

import { OverviewCards } from 'src/pages/financial-reports/components/overview-cards';
import { CashFlowChart } from 'src/pages/financial-reports/components/cash-flow-chart';
import { SpendingAnalysis } from 'src/pages/financial-reports/components/spending-analysis';
import { AssetAllocation } from 'src/pages/financial-reports/components/asset-allocation';
import { AssetGrowthChart } from 'src/pages/financial-reports/components/asset-growth-chart';
import { FinancialGoalsSection } from 'src/pages/financial-reports/components/financial-goals-section';
import { SmartInsights } from 'src/pages/financial-reports/components/smart-insights';
import { TransactionFeed } from 'src/pages/financial-reports/components/transaction-feed';
import { WalletAnalysis } from 'src/pages/financial-reports/components/wallet-analysis';
import { FilterBar } from 'src/pages/financial-reports/components/filter-bar';

import type { FilterOptions } from 'src/types/financial-reports';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const { t } = useTranslation('financialReports');
  const theme = useTheme();
  const [dateFilter, setDateFilter] = useState<FilterOptions['timeRange']>('thisMonth');

  const {
    data,
    loading,
    filters,
    updateFilters,
  } = useFinancialReports();

  // Extract hero data from overview metrics
  const heroData = useMemo(() => {
    if (!data) return null;
    
    const totalAssets = data.overview.find(m => m.id === 'netWorth')?.value || 0;
    const monthlyChange = data.overview.find(m => m.id === 'profit')?.trend || 0;
    const netWorth = data.overview.find(m => m.id === 'netWorth')?.value || 0;
    const totalCash = data.overview.find(m => m.id === 'savings')?.value || 0;
    const totalDebt = data.overview.find(m => m.id === 'debt')?.value || 0;

    return {
      totalAssets,
      monthlyChange,
      netWorth,
      totalCash,
      totalDebt,
    };
  }, [data]);

  const handleDateFilterChange = (newFilter: FilterOptions['timeRange']) => {
    setDateFilter(newFilter);
    updateFilters({ timeRange: newFilter });
  };

  const overviewCardsSkeleton = useMemo(
    () => (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 4,
        }}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              p: 3,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Skeleton variant="text" width={80} height={20} />
            </Box>
            <Skeleton variant="text" width="60%" height={36} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="40%" height={20} />
          </Box>
        ))}
      </Box>
    ),
    [theme]
  );

  return (
    <Container maxWidth="xl" sx={{ p: { xs: 2, md: 3 } }}>
      {/* Hero Section - Fintech Style */}
      <Box sx={{ mb: 4 }}>
        {loading ? (
          <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 4 }} />
        ) : (
          heroData && (
            <DashboardHero
              userName="Minh Đức"
              totalAssets={heroData.totalAssets}
              monthlyChange={heroData.monthlyChange}
              netWorth={heroData.netWorth}
              totalCash={heroData.totalCash}
              totalDebt={heroData.totalDebt}
              isLoading={loading}
            />
          )
        )}
      </Box>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={updateFilters}
        dateFilter={dateFilter}
        onDateFilterChange={handleDateFilterChange}
      />

      {/* Overview Cards */}
      {loading ? (
        overviewCardsSkeleton
      ) : (
        data && <OverviewCards metrics={data.overview} />
      )}

      {/* Smart Insights */}
      {loading ? (
        <Skeleton variant="rectangular" width="100%" height={120} sx={{ mb: 4, borderRadius: 3 }} />
      ) : (
        data && data.insights.length > 0 && <SmartInsights insights={data.insights} />
      )}

      {/* Cash Flow Chart & Spending Analysis */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 3,
          mb: 4,
        }}
      >
        {loading ? (
          <>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
          </>
        ) : (
          <>
            {data && <CashFlowChart data={data.cashFlow} />}
            {data && <SpendingAnalysis categories={data.spendingByCategory} />}
          </>
        )}
      </Box>

      {/* Asset Allocation & Financial Goals */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 3,
          mb: 4,
        }}
      >
        {loading ? (
          <>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
          </>
        ) : (
          <>
            {data && <AssetAllocation allocation={data.assetAllocation} />}
            {data && <FinancialGoalsSection goals={data.financialGoals} />}
          </>
        )}
      </Box>

      {/* Asset Growth Chart */}
      <Box sx={{ mb: 4 }}>
        {loading ? (
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
        ) : (
          data && <AssetGrowthChart data={data.assetGrowth} />
        )}
      </Box>

      {/* Transaction Feed & Wallet Analysis */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 3,
        }}
      >
        {loading ? (
          <>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
          </>
        ) : (
          <>
            {data && <TransactionFeed transactions={data.recentTransactions} />}
            {data && <WalletAnalysis wallets={data.walletAnalysis} />}
          </>
        )}
      </Box>

      {/* Quick Actions FAB */}
      <QuickActions
        onAddTransaction={() => console.log('Add transaction')}
        onAddWallet={() => console.log('Add wallet')}
        onAddAsset={() => console.log('Add asset')}
        onAddDebt={() => console.log('Add debt')}
        onAddGoal={() => console.log('Add goal')}
      />
    </Container>
  );
}