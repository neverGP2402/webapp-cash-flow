import { useTranslation } from 'react-i18next';
import { useMemo, useState, useEffect } from 'react';

import {
  Card,
  CardContent,
  Box,
  Typography,
  alpha,
  useTheme,
  Skeleton,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { ExchangeRate } from 'src/types/asset-detail';

interface AssetExchangeRateCardProps {
  exchangeRate?: ExchangeRate;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function AssetExchangeRateCard({ 
  exchangeRate, 
  isLoading = false,
  onRefresh,
}: AssetExchangeRateCardProps) {
  const { t } = useTranslation('assetDetail');
  const theme = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formatRate = (rate: number) => {
    return new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(rate);
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMinutes < 1) return t('common.justNow');
    if (diffMinutes < 60) return t('common.ago', { time: `${diffMinutes} ${t('common.hours')}` });
    if (diffHours < 24) return t('common.ago', { time: `${diffHours} ${t('common.hours')}` });
    
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return theme.palette.success.main;
      case 'down':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'eva:trending-up-fill';
      case 'down':
        return 'eva:trending-down-fill';
      default:
        return 'solar:check-circle-bold';
    }
  };

  const handleRefresh = async () => {
    if (!onRefresh || isRefreshing) return;
    
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Mock data for demonstration if not provided
  const mockExchangeRate: ExchangeRate = useMemo(() => ({
    id: '1',
    currency: 'XAU',
    currencyName: 'Vàng 9999',
    buyRate: 8200000,
    sellRate: 8250000,
    source: 'SJC',
    lastUpdated: new Date().toISOString(),
    trend: 'up',
    change: 50000,
    changePercentage: 0.61,
  }), []);

  const data = exchangeRate || mockExchangeRate;

  if (isLoading) {
    return (
      <Card
        sx={{
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width={120} height={28} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width={80} height={20} />
            </Box>
            <Skeleton variant="circular" width={32} height={32} />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            <Skeleton variant="text" width={120} height={60} />
            <Skeleton variant="text" width={120} height={60} />
          </Box>
          <Skeleton variant="text" width={200} height={20} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.03)}, ${alpha(theme.palette.info.main, 0.06)})`,
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: alpha(theme.palette.info.main, 0.1),
                mr: 2,
                color: theme.palette.info.main,
              }}
            >
              <Iconify icon="solar:coin-bold" width={24} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {t('exchangeRate.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {data.currencyName}
              </Typography>
            </Box>
          </Box>

          <Tooltip title={t('actions.updatePrice')}>
            <IconButton 
              size="small" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              sx={{
                color: theme.palette.info.main,
                '&.Mui-disabled': {
                  opacity: 0.5,
                },
              }}
            >
              <Iconify 
                icon="solar:restart-bold" 
                width={20} 
                sx={{
                  animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    from: { transform: 'rotate(0deg)' },
                    to: { transform: 'rotate(360deg)' },
                  },
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Rates */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5, mb: 3 }}>
          {/* Buy Rate */}
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: alpha(theme.palette.success.main, 0.06),
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 500 }}>
              {t('exchangeRate.buyRate')}
            </Typography>
            <Typography variant="h5" fontWeight={700} color="success.main" sx={{ lineHeight: 1.2 }}>
              {formatRate(data.buyRate)}₫
            </Typography>
          </Box>

          {/* Sell Rate */}
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              background: alpha(theme.palette.error.main, 0.06),
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontWeight: 500 }}>
              {t('exchangeRate.sellRate')}
            </Typography>
            <Typography variant="h5" fontWeight={700} color="error.main" sx={{ lineHeight: 1.2 }}>
              {formatRate(data.sellRate)}₫
            </Typography>
          </Box>
        </Box>

        {/* Trend & Change */}
        {data.trend && data.changePercentage !== undefined && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 1.5,
              borderRadius: 2,
              background: alpha(getTrendColor(data.trend), 0.06),
              mb: 2,
            }}
          >
            <Iconify 
              icon={getTrendIcon(data.trend)} 
              width={18} 
              sx={{ mr: 1, color: getTrendColor(data.trend) }}
            />
            <Typography 
              variant="body2" 
              fontWeight={700} 
              color={getTrendColor(data.trend)}
              sx={{ mr: 1 }}
            >
              {data.changePercentage >= 0 ? '+' : ''}{data.changePercentage.toFixed(2)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ({data.change !== undefined && data.change >= 0 ? '+' : ''}{formatRate(Math.abs(data.change || 0))}₫)
            </Typography>
          </Box>
        )}

        {/* Source & Last Updated */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
              {t('exchangeRate.source')}:
            </Typography>
            <Chip
              label={data.source}
              size="small"
              sx={{
                height: 22,
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                borderRadius: 1,
              }}
            />
          </Box>
          
          <Typography variant="caption" color="text.secondary">
            {t('exchangeRate.lastUpdated')}: {formatDateTime(data.lastUpdated)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}