import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';

import {
  Box,
  Typography,
  Container,
  useTheme,
  alpha,
  Skeleton,
  Paper,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { useFinancialReports } from 'src/hooks/useFinancialReports';

import { OverviewCards } from './components/overview-cards';
import { CashFlowChart } from './components/cash-flow-chart';
import { SpendingAnalysis } from './components/spending-analysis';
import { AssetAllocation } from './components/asset-allocation';
import { AssetGrowthChart } from './components/asset-growth-chart';
import { FinancialGoalsSection } from './components/financial-goals-section';
import { SmartInsights } from './components/smart-insights';
import { TransactionFeed } from './components/transaction-feed';
import { WalletAnalysis } from './components/wallet-analysis';
import { FilterBar } from './components/filter-bar';

import type { FilterOptions } from 'src/types/financial-reports';

// ----------------------------------------------------------------------

export default function FinancialReportsPage() {
  const { t } = useTranslation('financialReports');
  const theme = useTheme();
  const [dateFilter, setDateFilter] = useState<FilterOptions['timeRange']>('thisMonth');

  const {
    data,
    loading,
    filters,
    updateFilters,
  } = useFinancialReports();

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
          <Paper
            key={index}
            sx={{
              p: 3,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Skeleton variant="text" width={80} height={20} />
            </Box>
            <Skeleton variant="text" width="60%" height={36} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="40%" height={20} />
          </Paper>
        ))}
      </Box>
    ),
    [theme]
  );

  if (loading && !data) {
    return (
      <Container maxWidth="xl" sx={{ p: { xs: 2, md: 3 } }}>
        {/* Header Skeleton */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={48} height={48} sx={{ mr: 2 }} />
            <Box>
              <Skeleton variant="text" width={200} height={40} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width={300} height={24} />
            </Box>
          </Box>
        </Box>

        {/* Filter Bar Skeleton */}
        <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 4, borderRadius: 2 }} />

        {overviewCardsSkeleton}

        {/* Charts Skeleton */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: 3,
            mb: 4,
          }}
        >
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify icon={'solar:graph-up-bold' as any} width={28} />
          </Box>
          <Box>
            <Typography variant="h3" fontWeight={700} sx={{ mb: 0.5 }}>
              {t('pageTitle')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('subtitle')}
            </Typography>
          </Box>
        </Box>
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
    </Container>
  );
}