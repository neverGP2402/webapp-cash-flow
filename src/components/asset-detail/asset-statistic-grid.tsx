import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  Box,
  Typography,
  alpha,
  useTheme,
  Grid,
  Fade,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { AssetPerformance } from 'src/types/asset-detail';

interface AssetStatisticGridProps {
  performance: AssetPerformance;
  isLoading?: boolean;
}

export function AssetStatisticGrid({ performance, isLoading = false }: AssetStatisticGridProps) {
  const { t } = useTranslation('assetDetail');
  const theme = useTheme();

  const formatCurrency = (value: number) => {
    return value.toLocaleString('vi-VN');
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const getChangeColor = (value: number) => {
    if (value > 0) return theme.palette.success.main;
    if (value < 0) return theme.palette.error.main;
    return theme.palette.grey[500];
  };

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    color,
    trend,
    isLoading 
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: string;
    color: string;
    trend?: number;
    isLoading?: boolean;
  }) => (
    <Fade in={!isLoading} timeout={600}>
      <Card
        sx={{
          p: 2,
          borderRadius: 3,
          border: `1px solid ${alpha(color, 0.2)}`,
          background: alpha(color, 0.05),
          height: '100%',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[8],
            background: alpha(color, 0.08),
          }
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: alpha(color, 0.2),
                mr: 2,
                color
              }}
            >
              <Iconify icon={icon as any} width={24} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {title}
              </Typography>
              <Typography variant="h6" fontWeight={600} noWrap>
                {typeof value === 'number' ? formatCurrency(value) : value}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
          </Box>
          {trend !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Iconify 
                icon={(trend > 0 ? 'solar:trending-up-bold' : trend < 0 ? 'solar:trending-down-bold' : 'solar:minus-circle-bold') as any} 
                width={16} 
                sx={{ mr: 1, color: getChangeColor(trend) }}
              />
              <Typography 
                variant="body2" 
                fontWeight={600}
                color={getChangeColor(trend)}
              >
                {formatPercentage(trend)}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Fade>
  );

  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {[...Array(6)].map((_, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ p: 2, borderRadius: 3, height: 140 }}>
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Loading...
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatCard
          title={t('performance.averageBuyPrice')}
          value={performance.averageBuyPrice}
          subtitle="₫/đơn vị"
          icon="solar:cart-3-bold"
          color={theme.palette.info.main}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatCard
          title={t('performance.currentMarketPrice')}
          value={performance.currentMarketPrice}
          subtitle="₫/đơn vị"
          icon="solar:chart-square-bold"
          color={theme.palette.primary.main}
          trend={performance.dayChangePercentage}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatCard
          title={t('performance.totalInvested')}
          value={performance.totalInvested}
          icon="solar:wallet-money-bold"
          color={theme.palette.warning.main}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatCard
          title={t('performance.currentValue')}
          value={performance.currentValue}
          icon="solar:banknote-2-bold"
          color={theme.palette.success.main}
          trend={performance.dayChangePercentage}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatCard
          title={t('performance.unrealizedProfit')}
          value={performance.unrealizedProfit}
          icon="solar:trending-up-bold"
          color={performance.unrealizedProfit > 0 ? theme.palette.success.main : theme.palette.error.main}
          trend={performance.dayChangePercentage}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatCard
          title={t('performance.realizedProfit')}
          value={performance.realizedProfit}
          icon="solar:check-circle-bold"
          color={theme.palette.secondary.main}
        />
      </Grid>
    </Grid>
  );
}
