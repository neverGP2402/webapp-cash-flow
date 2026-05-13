import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

import {
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  alpha,
  useTheme,
  Fade,
  CircularProgress,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { Asset } from 'src/types/asset-detail';

interface AssetHeroOverviewProps {
  asset: Asset;
  isLoading?: boolean;
}

export function AssetHeroOverview({ asset, isLoading = false }: AssetHeroOverviewProps) {
  const { t } = useTranslation('assetDetail');
  const theme = useTheme();
  const [animatedValue, setAnimatedValue] = useState(0);
  const [animatedProfit, setAnimatedProfit] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      const valueTimer = setInterval(() => {
        setAnimatedValue((prev) => {
          const next = prev + (asset.currentValue - prev) * 0.1;
          return Math.abs(next - asset.currentValue) < 100 ? asset.currentValue : next;
        });
      }, 50);

      const profitTimer = setInterval(() => {
        setAnimatedProfit((prev) => {
          const next = prev + (asset.unrealizedProfit - prev) * 0.1;
          return Math.abs(next - asset.unrealizedProfit) < 10 ? asset.unrealizedProfit : next;
        });
      }, 50);

      return () => {
        clearInterval(valueTimer);
        clearInterval(profitTimer);
      };
    }
  }, [asset, isLoading]);

  const getStatusColor = (status: Asset['status']) => {
    switch (status) {
      case 'profit':
        return theme.palette.success.main;
      case 'loss':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getStatusIcon = (status: Asset['status']) => {
    switch (status) {
      case 'profit':
        return 'eva:trending-up-fill';
      case 'loss':
        return 'eva:trending-down-fill';
      default:
        return 'solar:check-circle-bold';
    }
  };

  if (isLoading) {
    return (
      <Card
        sx={{
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.dark, 0.1)})`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          minHeight: 280,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={60} />
      </Card>
    );
  }

  return (
    <Fade in={!isLoading} timeout={800}>
      <Card
        sx={{
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.dark, 0.1)})`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${getStatusColor(asset.status)}, ${alpha(getStatusColor(asset.status), 0.3)})`,
          },
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Asset Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                background: alpha(theme.palette.primary.main, 0.2),
                mr: 3,
                color: theme.palette.primary.main,
              }}
            >
              <Iconify 
                icon={asset.icon || 'solar:cart-3-bold'} 
                width={32} 
                height={32} 
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h3" fontWeight={700} sx={{ mb: 0.5 }}>
                {asset.name}
              </Typography>
              <Typography variant="h5" color="text.secondary" fontWeight={500}>
                {asset.symbol}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 1 }}>
                <Iconify 
                  icon={getStatusIcon(asset.status)} 
                  width={20} 
                  sx={{ mr: 1, color: getStatusColor(asset.status) }}
                />
                <Typography 
                  variant="h6" 
                  fontWeight={600}
                  color={getStatusColor(asset.status)}
                >
                  {t(`heroOverview.status.${asset.status}`)}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {t('heroOverview.lastUpdated', { time: new Date(asset.lastUpdated).toLocaleString('vi-VN') })}
              </Typography>
            </Box>
          </Box>

          {/* Main Metrics */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('heroOverview.totalHolding')}
            </Typography>
            <Typography variant="h2" fontWeight={700} sx={{ mb: 3 }}>
              {asset.holdingAmount.toLocaleString('vi-VN')} {asset.symbol}
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {t('heroOverview.currentValue')}
                </Typography>
                <Typography variant="h3" fontWeight={700} color="primary.main">
                  {animatedValue.toLocaleString('vi-VN')}₫
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {t('heroOverview.totalProfit')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
                  <Typography 
                    variant="h3" 
                    fontWeight={700}
                    color={getStatusColor(asset.status)}
                    sx={{ mr: 2 }}
                  >
                    {animatedProfit.toLocaleString('vi-VN')}₫
                  </Typography>
                  <Typography 
                    variant="h5" 
                    fontWeight={600}
                    color={getStatusColor(asset.status)}
                  >
                    {asset.profitPercentage > 0 ? '+' : ''}{asset.profitPercentage.toFixed(2)}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Progress Bar */}
          <Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, Math.max(0, asset.profitPercentage + 100))}
              sx={{
                height: 8,
                borderRadius: 4,
                background: alpha(theme.palette.grey[300], 0.3),
                '& .MuiLinearProgress-bar': {
                  background: `linear-gradient(90deg, ${getStatusColor(asset.status)}, ${alpha(getStatusColor(asset.status), 0.7)})`,
                  borderRadius: 4,
                }
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
}
