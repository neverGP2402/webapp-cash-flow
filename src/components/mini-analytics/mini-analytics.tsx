import { useTranslation } from 'react-i18next';

import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Avatar,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

import type { CategorySpending, MonthlyStats } from 'src/types/transaction';

// ----------------------------------------------------------------------

interface MiniAnalyticsProps {
  monthlyStats: MonthlyStats;
  topCategories: CategorySpending[];
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

const StatCard = styled(Box)<{ color?: string }>(({ theme, color }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  backgroundColor: color || theme.palette.grey[50],
  border: `1px solid ${theme.palette.divider}`,
  height: '100%',
}));

const CategoryAvatar = styled(Avatar)<{ color?: string }>(({ theme, color }) => ({
  backgroundColor: color || theme.palette.primary.main,
  width: 32,
  height: 32,
}));

// ----------------------------------------------------------------------

export function MiniAnalytics({ monthlyStats, topCategories }: MiniAnalyticsProps) {
  const { t } = useTranslation('common');

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value)}%`;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Monthly Stats Overview */}
        <StyledCard>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              {t('transactionHistory.spendingOverview')}
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <StatCard>
                <Box display="flex" alignItems="center" mb={1}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'error.main',
                      mr: 1,
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {t('transactionHistory.monthlyExpense')}
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={600} color="error.main">
                  {formatAmount(monthlyStats.totalExpense)}
                </Typography>
              </StatCard>
              
              <StatCard>
                <Box display="flex" alignItems="center" mb={1}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'success.main',
                      mr: 1,
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {t('transactionHistory.monthlyIncome')}
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight={600} color="success.main">
                  {formatAmount(monthlyStats.totalIncome)}
                </Typography>
              </StatCard>
              
              <StatCard>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  {t('transactionHistory.totalTransactions')}
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {monthlyStats.totalTransactions}
                </Typography>
              </StatCard>
              
              <StatCard>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  {t('transactionHistory.largestExpense')}
                </Typography>
                <Typography variant="h6" fontWeight={600} color="error.main">
                  {formatAmount(monthlyStats.largestExpense)}
                </Typography>
              </StatCard>
            </Box>
          </CardContent>
        </StyledCard>

        {/* Top Categories */}
        <StyledCard>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
              {t('transactionHistory.topCategories')}
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {topCategories.slice(0, 5).map((category, index) => (
                <Box key={category.category.id}>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Box display="flex" alignItems="center">
                      <CategoryAvatar color={category.category.color} sx={{ mr: 2 }}>
                        <Iconify icon="solar:cart-3-bold" width={16} />
                      </CategoryAvatar>
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {category.category.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {category.transactionCount} {t('transactionHistory.totalTransactions')}
                        </Typography>
                      </Box>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="body2" fontWeight={600}>
                        {formatAmount(category.amount)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatPercentage(category.percentage)}
                      </Typography>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={category.percentage}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        backgroundColor: category.category.color || 'primary.main',
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          </CardContent>
        </StyledCard>
      </Box>
    </Box>
  );
}
