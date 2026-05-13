import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Container,
  Grid,
  useTheme,
  useMediaQuery,
  alpha,
  CircularProgress,
  Typography,
} from '@mui/material';

import { AssetHeroOverview } from './asset-hero-overview';
import { AssetStatisticGrid } from './asset-statistic-grid';
import { AssetPerformanceChart } from './asset-performance-chart';
import { AssetAllocationCard } from './asset-allocation-card';
import { AssetTimeline } from './asset-timeline';
import { AssetTransactionList } from './asset-transaction-list';
import { AssetInsightSection } from './asset-insight-section';
import { AssetQuickAction } from './asset-quick-action';
import { AssetEmptyState } from './asset-empty-state';

import type { 
  AssetDetailData, 
  AssetChartPeriod, 
  AssetQuickAction as AssetQuickActionType 
} from 'src/types/asset-detail';

interface AssetDetailPageProps {
  assetId: string;
  data?: AssetDetailData;
  isLoading?: boolean;
  onPeriodChange?: (period: AssetChartPeriod) => void;
  onActionClick?: (action: AssetQuickActionType['action']) => void;
  onAddTransaction?: () => void;
}

export function AssetDetailPage({
  assetId,
  data,
  isLoading = false,
  onPeriodChange,
  onActionClick,
  onAddTransaction,
}: AssetDetailPageProps) {
  const { t } = useTranslation('assetDetail');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedPeriod, setSelectedPeriod] = useState<AssetChartPeriod>('30D');

  useEffect(() => {
    if (onPeriodChange) {
      onPeriodChange(selectedPeriod);
    }
  }, [selectedPeriod, onPeriodChange]);

  // Mock data for demonstration
  const mockData: AssetDetailData = useMemo(() => ({
    asset: {
      id: assetId,
      name: 'Vàng SJC 9999',
      symbol: 'Vàng SJC',
      type: 'gold',
      icon: 'solar:cart-3-bold',
      color: theme.palette.warning.main,
      holdingAmount: 5.2,
      averageBuyPrice: 7500000,
      currentMarketPrice: 8200000,
      totalInvested: 39000000,
      currentValue: 42640000,
      unrealizedProfit: 3640000,
      realizedProfit: 1200000,
      profitPercentage: 9.33,
      status: 'profit',
      lastUpdated: new Date().toISOString(),
      createdAt: '2024-01-15T00:00:00Z',
    },
    performance: {
      averageBuyPrice: 7500000,
      currentMarketPrice: 8200000,
      totalInvested: 39000000,
      currentValue: 42640000,
      unrealizedProfit: 3640000,
      realizedProfit: 1200000,
      profitPercentage: 9.33,
      dayChange: 50000,
      dayChangePercentage: 0.61,
      weekChange: 120000,
      weekChangePercentage: 1.49,
      monthChange: 350000,
      monthChangePercentage: 4.46,
      yearChange: 1200000,
      yearChangePercentage: 17.14,
    },
    chartData: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const baseValue = 7500000 + (i * 23333);
      const randomVariation = (Math.random() - 0.5) * 200000;
      const value = baseValue + randomVariation;
      const profit = (value - 7500000) * 5.2;
      
      return {
        timestamp: date.toISOString(),
        value: Math.round(value),
        profit: Math.round(profit),
        profitPercentage: Math.round((profit / 39000000) * 10000) / 100,
      };
    }),
    allocation: {
      assetValue: 42640000,
      totalPortfolioValue: 250000000,
      allocationPercentage: 17.06,
      rank: 2,
      totalAssets: 8,
    },
    timeline: [
      {
        id: '1',
        type: 'buy',
        title: 'Mua thêm Vàng SJC',
        amount: 15600000,
        quantity: 2,
        price: 7800000,
        wallet: 'Ví Tiền Mặt',
        note: 'Mua tại tiệm vàng',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        icon: 'solar:cart-add-bold',
        color: theme.palette.success.main,
      },
      {
        id: '2',
        type: 'price_update',
        title: 'Cập nhật giá Vàng SJC',
        amount: 8200000,
        wallet: 'Thị trường',
        note: 'Giá mới nhất từ SJC',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        icon: 'solar:refresh-circle-bold',
        color: theme.palette.info.main,
      },
    ],
    transactions: [
      {
        id: '1',
        type: 'buy',
        quantity: 3,
        price: 7300000,
        totalValue: 21900000,
        wallet: 'Ví Tiền Mặt',
        timestamp: '2024-01-15T10:30:00Z',
        note: 'Mua ban đầu',
        currentValue: 24600000,
        profit: 2700000,
        profitPercentage: 12.33,
      },
      {
        id: '2',
        type: 'buy',
        quantity: 2.2,
        price: 7800000,
        totalValue: 17160000,
        wallet: 'Ví Tiền Mặt',
        timestamp: '2024-03-10T14:20:00Z',
        note: 'Mua thêm',
        currentValue: 18040000,
        profit: 880000,
        profitPercentage: 5.13,
      },
    ],
    insights: [
      {
        id: '1',
        type: 'performance',
        title: 'Hiệu suất vượt trội',
        description: 'Tài sản này có hiệu suất tốt nhất trong danh mục của bạn',
        value: 3640000,
        percentage: 9.33,
        icon: 'solar:chart-square-bold',
        color: theme.palette.success.main,
        priority: 'high',
      },
      {
        id: '2',
        type: 'growth',
        title: 'Tăng trưởng ổn định',
        description: 'Giá trị tăng 17.14% trong năm nay',
        percentage: 17.14,
        icon: 'solar:rocket-bold',
        color: theme.palette.info.main,
        priority: 'medium',
      },
      {
        id: '3',
        type: 'recommendation',
        title: 'Gợi ý đầu tư',
        description: 'Có thể xem xét mua thêm khi giá giảm',
        icon: 'solar:lightbulb-bold',
        color: theme.palette.secondary.main,
        priority: 'low',
      },
    ],
  }), [assetId, theme]);

  const currentData = data || mockData;
  const hasData = currentData && currentData.asset;

  // Quick actions configuration
  const quickActions: AssetQuickActionType[] = useMemo(() => [
    {
      id: 'buy',
      label: t('actions.buy'),
      icon: 'solar:cart-add-bold',
      action: 'buy',
    },
    {
      id: 'sell',
      label: t('actions.sell'),
      icon: 'solar:cart-remove-bold',
      action: 'sell',
    },
    {
      id: 'update_price',
      label: t('actions.updatePrice'),
      icon: 'solar:refresh-circle-bold',
      action: 'update_price',
    },
    {
      id: 'view_history',
      label: t('actions.viewHistory'),
      icon: 'solar:clock-circle-bold',
      action: 'view_history',
    },
    {
      id: 'transfer',
      label: t('actions.transfer'),
      icon: 'solar:arrow-right-up-bold',
      action: 'transfer',
    },
  ], [t]);

  const handlePeriodChange = (period: AssetChartPeriod) => {
    setSelectedPeriod(period);
  };

  const handleActionClick = (action: AssetQuickActionType['action']) => {
    if (onActionClick) {
      onActionClick(action);
    }
  };

  // Loading state
  if (isLoading && !hasData) {
    return (
      <Container maxWidth="xl">
        <Box
          sx={{
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            {t('loading')}
          </Typography>
        </Box>
      </Container>
    );
  }

  // Empty state
  if (!hasData) {
    return <AssetEmptyState onAddTransaction={onAddTransaction} />;
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        {/* Hero Overview */}
        <Box sx={{ mb: 4 }}>
          <AssetHeroOverview asset={currentData.asset} isLoading={isLoading} />
        </Box>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Left Column - Main Analytics */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Performance Statistics */}
              <AssetStatisticGrid performance={currentData.performance} isLoading={isLoading} />

              {/* Performance Chart */}
              <AssetPerformanceChart
                chartData={currentData.chartData}
                selectedPeriod={selectedPeriod}
                onPeriodChange={handlePeriodChange}
                isLoading={isLoading}
              />

              {/* Timeline */}
              <AssetTimeline events={currentData.timeline} isLoading={isLoading} />

              {/* Transaction List */}
              <AssetTransactionList transactions={currentData.transactions} isLoading={isLoading} />
            </Box>
          </Grid>

          {/* Right Column - Sidebar */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Asset Allocation */}
              <AssetAllocationCard allocation={currentData.allocation} isLoading={isLoading} />

              {/* Quick Actions */}
              {!isMobile && (
                <AssetQuickAction
                  actions={quickActions}
                  onActionClick={handleActionClick}
                  disabled={isLoading}
                  isMobile={isMobile}
                />
              )}

              {/* Insights */}
              <AssetInsightSection insights={currentData.insights} isLoading={isLoading} />
            </Box>
          </Grid>
        </Grid>

        {/* Mobile Quick Actions */}
        {isMobile && (
          <Box sx={{ mt: 4 }}>
            <AssetQuickAction
              actions={quickActions}
              onActionClick={handleActionClick}
              disabled={isLoading}
              isMobile={isMobile}
            />
          </Box>
        )}
      </Box>
    </Container>
  );
}
