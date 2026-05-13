import { useTranslation } from 'react-i18next';
import { Card, CardContent, Box, Typography, alpha, LinearProgress } from '@mui/material';
import { AssetOverview, AssetStatus } from 'src/types/add-asset';

interface RealtimeOverviewProps {
  overview: AssetOverview;
  assetStatus?: AssetStatus | null;
  loading?: boolean;
}

export default function RealtimeOverview({
  overview,
  assetStatus,
  loading
}: RealtimeOverviewProps) {
  const { t } = useTranslation('add-asset');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(value));
  };

  const formatPercent = (percent: number) => {
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  const getTrendColor = (): 'success' | 'error' => {
    if (overview.profit > 0) return 'success';
    if (overview.profit < 0) return 'error';
    return 'success';
  };

  const getProgressValue = () => {
    if (overview.purchaseValue === 0) return 0;
    return Math.min(Math.max(((overview.currentValue - overview.purchaseValue) / overview.purchaseValue) * 100, -100), 100);
  };

  if (loading) {
    return (
      <Card
        sx={{
          borderRadius: 3,
          border: `1px solid ${alpha('#000', 0.06)}`,
          height: '100%'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            {t('overview.title')}
          </Typography>
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ width: 100, height: 16, borderRadius: 1, bgcolor: 'action.hover' }} />
                <Box sx={{ width: 120, height: 24, borderRadius: 1, bgcolor: 'action.hover' }} />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  }

  const trendColor = getTrendColor();
  const progressValue = getProgressValue();

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: `1px solid ${alpha('#000', 0.06)}`,
        height: '100%',
        background: (theme) =>
          `linear-gradient(180deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.default, 0.5)} 100%)`,
        backdropFilter: 'blur(10px)'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'success.main',
              animation: 'pulse 2s infinite'
            }}
          />
          <Typography variant="h6" fontWeight={700}>
            {t('overview.title')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Current Value */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('overview.currentValue')}
            </Typography>
            <Typography variant="h6" fontWeight={700} color="primary.main">
              {formatCurrency(overview.currentValue)}
            </Typography>
          </Box>

          {/* Purchase Value */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('overview.purchaseValue')}
            </Typography>
            <Typography variant="body1" fontWeight={600} color="text.primary">
              {formatCurrency(overview.purchaseValue)}
            </Typography>
          </Box>

          {/* Difference */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: (theme) =>
                overview.profit >= 0
                  ? alpha(theme.palette.success.main, 0.06)
                  : alpha(theme.palette.error.main, 0.06)
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('overview.difference')}
              </Typography>
              <Typography
                variant="h6"
                fontWeight={700}
                color={trendColor === 'success' ? 'success.main' : 'error.main'}
                sx={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {overview.profit >= 0 ? '+' : ''}{formatCurrency(overview.profit)}
              </Typography>
            </Box>
          </Box>

          {/* Profit Percent */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('overview.profitPercent')}
            </Typography>
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                bgcolor: alpha(trendColor === 'success' ? '#2e7d32' : '#d32f2f', 0.1),
                color: trendColor === 'success' ? 'success.main' : 'error.main'
              }}
            >
              <Typography variant="body2" fontWeight={700}>
                {formatPercent(overview.profitPercent)}
              </Typography>
            </Box>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={50 + progressValue / 2}
              color={overview.profit >= 0 ? 'success' : 'error'}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: alpha('#000', 0.05)
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                -100%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                0%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                +100%
              </Typography>
            </Box>
          </Box>

          {/* Asset Status */}
          {assetStatus && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.default'
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('overview.assetStatus')}
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {assetStatus.name}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}