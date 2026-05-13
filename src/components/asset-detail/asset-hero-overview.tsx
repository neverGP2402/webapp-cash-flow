import { useTranslation } from 'react-i18next';
import { useState, useEffect, useMemo } from 'react';

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
  Chip,
  Skeleton,
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
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  // Count-up animation for values
  useEffect(() => {
    if (!isLoading) {
      const duration = 1500;
      const frameRate = 60;
      const totalFrames = duration / (1000 / frameRate);
      let frame = 0;

      const startValue = animatedValue || 0;
      const startProfit = animatedProfit || 0;
      const startPercentage = animatedPercentage || 0;

      const animate = () => {
        frame++;
        const progress = frame / totalFrames;
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

        setAnimatedValue(startValue + (asset.currentValue - startValue) * easeProgress);
        setAnimatedProfit(startProfit + (asset.unrealizedProfit - startProfit) * easeProgress);
        setAnimatedPercentage(startPercentage + (asset.profitPercentage - startPercentage) * easeProgress);

        if (frame < totalFrames) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
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

  const formatCurrency = useMemo(() => (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(value));
  }, []);

  const formatRelativeTime = useMemo(() => (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return t('common.justNow');
    if (diffMinutes < 60) return t('common.ago', { time: `${diffMinutes} ${t('common.hours')}` });
    if (diffHours < 24) return t('common.ago', { time: `${diffHours} ${t('common.hours')}` });
    if (diffDays < 30) return t('common.ago', { time: `${diffDays} ${t('common.days')}` });
    
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [t]);

  const getAssetTypeLabel = (type: Asset['type']) => {
    const typeLabels: Record<Asset['type'], string> = {
      gold: 'Vàng',
      crypto: 'Tiền điện tử',
      currency: 'Tiền mặt',
      diamond: 'Kim cương',
      silver: 'Bạc',
      cash: 'Tiền mặt',
      bank_account: 'Tài khoản ngân hàng',
      other: 'Khác',
    };
    return typeLabels[type] || type;
  };

  if (isLoading) {
    return (
      <Card
        sx={{
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.dark, 0.1)})`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          minHeight: 280,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Skeleton variant="circular" width={64} height={64} sx={{ mr: 3 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width={200} height={40} sx={{ mb: 1 }} />
              <Skeleton variant="text" width={120} height={28} />
            </Box>
            <Skeleton variant="text" width={100} height={32} />
          </Box>
          <Skeleton variant="text" width={150} height={24} sx={{ mb: 1 }} />
          <Skeleton variant="text" width={300} height={48} sx={{ mb: 3 }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
            <Skeleton variant="text" width={200} height={60} />
            <Skeleton variant="text" width={200} height={60} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Fade in={!isLoading} timeout={800}>
      <Card
        sx={{
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.dark, 0.12)})`,
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
          '&::after': {
            content: '""',
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: alpha(getStatusColor(asset.status), 0.05),
          },
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 5 } }}>
          {/* Asset Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: 3,
                background: alpha(theme.palette.primary.main, 0.15),
                color: theme.palette.primary.main,
                flexShrink: 0,
              }}
            >
              <Iconify 
                icon={asset.icon || 'solar:cart-3-bold'} 
                width={36} 
                height={36} 
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5, flexWrap: 'wrap' }}>
                <Typography variant="h3" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                  {asset.name}
                </Typography>
                <Chip
                  label={getAssetTypeLabel(asset.type)}
                  size="small"
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    fontSize: '12px',
                    height: 24,
                  }}
                />
              </Box>
              <Typography variant="h5" color="text.secondary" fontWeight={500}>
                {asset.symbol}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    backgroundColor: alpha(getStatusColor(asset.status), 0.1),
                  }}
                >
                  <Iconify 
                    icon={getStatusIcon(asset.status)} 
                    width={18} 
                    sx={{ mr: 0.5, color: getStatusColor(asset.status) }}
                  />
                  <Typography 
                    variant="body1" 
                    fontWeight={600}
                    color={getStatusColor(asset.status)}
                  >
                    {t(`heroOverview.status.${asset.status}`)}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {t('heroOverview.lastUpdated', { time: formatRelativeTime(asset.lastUpdated) })}
              </Typography>
            </Box>
          </Box>

          {/* Main Metrics */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
              {t('heroOverview.totalHolding')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 1 }}>
              <Typography variant="h2" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                {formatCurrency(asset.holdingAmount)}
              </Typography>
              <Typography variant="h5" color="text.secondary" fontWeight={500}>
                {asset.symbol}
              </Typography>
            </Box>
          </Box>

          {/* Value and Profit Grid */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
            gap: { xs: 3, md: 4 },
            mb: 4,
          }}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 500 }}>
                {t('heroOverview.currentValue')}
              </Typography>
              <Typography 
                variant="h3" 
                fontWeight={700} 
                color="primary.main"
                sx={{ lineHeight: 1.2 }}
              >
                {formatCurrency(animatedValue)}₫
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {t('heroOverview.averageCost')}: {formatCurrency(asset.averageBuyPrice)}₫
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 500 }}>
                {t('heroOverview.totalProfit')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: 1 }}>
                <Typography 
                  variant="h3" 
                  fontWeight={700}
                  color={getStatusColor(asset.status)}
                  sx={{ lineHeight: 1.2 }}
                >
                  {animatedProfit >= 0 ? '+' : ''}{formatCurrency(animatedProfit)}₫
                </Typography>
                <Typography 
                  variant="h5" 
                  fontWeight={600}
                  color={getStatusColor(asset.status)}
                >
                  {animatedPercentage >= 0 ? '+' : ''}{animatedPercentage.toFixed(2)}%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {t('heroOverview.holdingValue')}: {formatCurrency(asset.totalInvested)}₫
              </Typography>
            </Box>
          </Box>

          {/* Progress Bar */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                {t('heroOverview.profitPercentage')}
              </Typography>
              <Typography variant="caption" fontWeight={600} color={getStatusColor(asset.status)}>
                {asset.profitPercentage >= 0 ? '+' : ''}{asset.profitPercentage.toFixed(2)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, Math.max(0, asset.profitPercentage + 100))}
              sx={{
                height: 10,
                borderRadius: 5,
                background: alpha(theme.palette.grey[300], 0.3),
                '& .MuiLinearProgress-bar': {
                  background: `linear-gradient(90deg, ${getStatusColor(asset.status)}, ${alpha(getStatusColor(asset.status), 0.7)})`,
                  borderRadius: 5,
                  transition: 'width 0.5s ease',
                }
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
}