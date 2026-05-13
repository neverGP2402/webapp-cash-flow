import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

import {
  Card,
  CardContent,
  Box,
  Typography,
  alpha,
  useTheme,
  Grid,
  Skeleton,
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

  const formatCurrency = useMemo(() => (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(value));
  }, []);

  const formatPercentage = useMemo(() => (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  }, []);

  const getChangeColor = (value: number) => {
    if (value > 0) return theme.palette.success.main;
    if (value < 0) return theme.palette.error.main;
    return theme.palette.grey[500];
  };

  const statCards = useMemo(() => [
    {
      id: 'averageBuyPrice',
      title: t('performance.averageBuyPrice'),
      value: performance.averageBuyPrice,
      subtitle: '₫/đơn vị',
      icon: 'solar:cart-3-bold',
      color: theme.palette.info.main,
    },
    {
      id: 'currentMarketPrice',
      title: t('performance.currentMarketPrice'),
      value: performance.currentMarketPrice,
      subtitle: '₫/đơn vị',
      icon: 'solar:chart-square-bold',
      color: theme.palette.primary.main,
      trend: performance.dayChangePercentage,
      trendLabel: t('performance.dayChange'),
    },
    {
      id: 'totalInvested',
      title: t('performance.totalInvested'),
      value: performance.totalInvested,
      icon: 'solar:wallet-money-bold',
      color: theme.palette.warning.main,
    },
    {
      id: 'currentValue',
      title: t('performance.currentValue'),
      value: performance.currentValue,
      icon: 'solar:coin-bold',
      color: theme.palette.success.main,
      trend: performance.dayChangePercentage,
      trendLabel: t('performance.dayChange'),
    },
    {
      id: 'unrealizedProfit',
      title: t('performance.unrealizedProfit'),
      value: performance.unrealizedProfit,
      icon: performance.unrealizedProfit >= 0 ? 'eva:trending-up-fill' : 'eva:trending-down-fill',
      color: performance.unrealizedProfit >= 0 ? theme.palette.success.main : theme.palette.error.main,
      trend: performance.dayChangePercentage,
      trendLabel: t('performance.dayChange'),
    },
    {
      id: 'realizedProfit',
      title: t('performance.realizedProfit'),
      value: performance.realizedProfit,
      icon: 'solar:check-circle-bold',
      color: theme.palette.secondary.main,
    },
  ], [performance, t, theme]);

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    color,
    trend,
    trendLabel,
  }: {
    title: string;
    value: number;
    subtitle?: string;
    icon: string;
    color: string;
    trend?: number;
    trendLabel?: string;
  }) => (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        border: `1px solid ${alpha(color, 0.15)}`,
        background: `linear-gradient(135deg, ${alpha(color, 0.03)}, ${alpha(color, 0.06)})`,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${alpha(color, 0.15)}`,
          background: `linear-gradient(135deg, ${alpha(color, 0.05)}, ${alpha(color, 0.08)})`,
          '& .stat-icon': {
            transform: 'scale(1.1) rotate(5deg)',
          },
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.3)})`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Box
            className="stat-icon"
            sx={{
              p: 2,
              borderRadius: 2.5,
              background: alpha(color, 0.12),
              mr: 2.5,
              color,
              transition: 'transform 0.3s ease',
              flexShrink: 0,
            }}
          >
            <Iconify icon={icon as any} width={28} height={28} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                display: 'block',
                mb: 0.5,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h5" 
              fontWeight={700} 
              sx={{ 
                lineHeight: 1.2,
                color: 'text.primary',
              }}
            >
              {formatCurrency(value)}₫
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
        
        {trend !== undefined && (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              pt: 2,
              borderTop: `1px solid ${alpha(color, 0.1)}`,
              mt: 1,
            }}
          >
            <Iconify 
              icon={(trend > 0 ? 'eva:trending-up-fill' : trend < 0 ? 'eva:trending-down-fill' : 'solar:minus-circle-bold') as any} 
              width={16} 
              sx={{ mr: 1, color: getChangeColor(trend) }}
            />
            <Typography 
              variant="body2" 
              fontWeight={700}
              color={getChangeColor(trend)}
              sx={{ mr: 1 }}
            >
              {formatPercentage(trend)}
            </Typography>
            {trendLabel && (
              <Typography variant="caption" color="text.secondary">
                {trendLabel}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Grid container spacing={2.5}>
        {[...Array(6)].map((_, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ borderRadius: 3, height: 160 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Skeleton variant="circular" width={44} height={44} sx={{ mr: 2 }} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width={120} height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width={80} height={28} />
                  </Box>
                </Box>
                <Skeleton variant="text" width={100} height={20} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={2.5}>
      {statCards.map((card) => (
        <Grid key={card.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
            color={card.color}
            trend={card.trend}
            trendLabel={card.trendLabel}
          />
        </Grid>
      ))}
    </Grid>
  );
}