import { useTranslation } from 'react-i18next';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

import type { QuickInsights } from 'src/types/transaction';

// ----------------------------------------------------------------------

interface QuickInsightsProps {
  insights: QuickInsights;
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
  },
}));

const InsightAvatar = styled(Avatar)<{ color?: string }>(({ theme, color }) => ({
  backgroundColor: color || theme.palette.primary.main,
  width: 40,
  height: 40,
}));

const TrendChip = styled(Chip)<{ trend: 'increasing' | 'decreasing' | 'stable' }>(({ theme, trend }) => {
  const getColor = () => {
    switch (trend) {
      case 'increasing':
        return { bg: theme.palette.error.light, color: theme.palette.error.dark };
      case 'decreasing':
        return { bg: theme.palette.success.light, color: theme.palette.success.dark };
      case 'stable':
        return { bg: theme.palette.info.light, color: theme.palette.info.dark };
      default:
        return { bg: theme.palette.grey[200], color: theme.palette.grey[700] };
    }
  };

  const colors = getColor();

  return {
    backgroundColor: colors.bg,
    color: colors.color,
    fontSize: '0.75rem',
    height: 24,
    fontWeight: 600,
  };
});

// ----------------------------------------------------------------------

export function QuickInsightsComponent({ insights }: QuickInsightsProps) {
  const { t } = useTranslation();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const getTrendIcon = (trend: 'increasing' | 'decreasing' | 'stable') => {
    switch (trend) {
      case 'increasing':
        return 'eva:trending-up-fill';
      case 'decreasing':
        return 'eva:trending-down-fill';
      case 'stable':
        return 'eva:arrow-ios-forward-fill';
      default:
        return 'eva:arrow-ios-forward-fill';
    }
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 3 }}>
      {/* Highest Spending Day */}
      <StyledCard>
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <InsightAvatar color="#FF6B6B" sx={{ mx: 'auto', mb: 2 }}>
            <Iconify icon="solar:clock-circle-outline" width={20} />
          </InsightAvatar>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            {t('transactionHistory.highestSpendingDay')}
          </Typography>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
            {formatDate(insights.highestSpendingDay.date)}
          </Typography>
          <Typography variant="body2" color="error.main" fontWeight={500}>
            {formatAmount(insights.highestSpendingDay.amount)}
          </Typography>
        </CardContent>
      </StyledCard>

      {/* Top Spending Category */}
      <StyledCard>
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <InsightAvatar color="#4ECDC4" sx={{ mx: 'auto', mb: 2 }}>
            <Iconify icon="solar:cart-3-bold" width={20} />
          </InsightAvatar>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            {t('transactionHistory.topSpendingCategory')}
          </Typography>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
            {insights.topSpendingCategory.category.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {formatAmount(insights.topSpendingCategory.amount)}
          </Typography>
        </CardContent>
      </StyledCard>

      {/* Largest Transaction */}
      <StyledCard>
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <InsightAvatar color="#FFD93D" sx={{ mx: 'auto', mb: 2 }}>
            <Iconify icon="solar:cart-3-bold" width={20} />
          </InsightAvatar>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            {t('transactionHistory.largestTransaction')}
          </Typography>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
            {insights.largestTransaction.name}
          </Typography>
          <Typography variant="body2" color="error.main" fontWeight={500}>
            {formatAmount(insights.largestTransaction.amount)}
          </Typography>
        </CardContent>
      </StyledCard>

      {/* Spending Trend */}
      <StyledCard>
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <InsightAvatar color="#6C63FF" sx={{ mx: 'auto', mb: 2 }}>
            <Iconify icon={getTrendIcon(insights.spendingTrend.trend)} width={20} />
          </InsightAvatar>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
            {t('transactionHistory.spendingTrend')}
          </Typography>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 0.5 }}>
            {t(`transactionHistory.${insights.spendingTrend.trend}`)}
          </Typography>
          <TrendChip
            trend={insights.spendingTrend.trend}
            label={`${Math.abs(insights.spendingTrend.percentage)}%`}
            size="small"
          />
        </CardContent>
      </StyledCard>
    </Box>
  );
}
