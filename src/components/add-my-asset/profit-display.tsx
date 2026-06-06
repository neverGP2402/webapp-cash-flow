import { useTranslation } from 'react-i18next';
import { Box, Typography, alpha, Chip } from '@mui/material';
import { AssetOverview } from 'src/types/add-asset';

interface ProfitDisplayProps {
  overview: AssetOverview;
  loading?: boolean;
}

export default function ProfitDisplay({
  overview,
  loading
}: ProfitDisplayProps) {
  const { t } = useTranslation('addAsset');

  if (loading) {
    return (
      <Box
        sx={{
          p: 2.5,
          borderRadius: 3,
          border: `1px solid ${alpha('#000', 0.06)}`,
          textAlign: 'center'
        }}
      >
        <Box sx={{ height: 48, borderRadius: 1, bgcolor: 'action.hover' }} />
      </Box>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Math.abs(value));
  };

  const isProfit = overview.profit >= 0;
  const trendColor = isProfit ? 'success' : 'error';
  const trendIcon = isProfit ? '↑' : '↓';

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        border: `1px solid ${alpha('#000', 0.06)}`,
        bgcolor: isProfit
          ? (theme) => alpha(theme.palette.success.main, 0.03)
          : (theme) => alpha(theme.palette.error.main, 0.03),
        textAlign: 'center',
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
        {t('form.profit.label')}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <Typography
          variant="h4"
          fontWeight={800}
          color={trendColor + '.main'}
          sx={{
            transition: 'color 0.3s ease',
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          {trendIcon} {formatCurrency(overview.profit)}
        </Typography>
        <Chip
          label={`${isProfit ? '+' : ''}${overview.profitPercent.toFixed(2)}%`}
          size="small"
          color={trendColor}
          sx={{
            height: 28,
            fontWeight: 700,
            fontSize: 13,
            bgcolor: (theme) => alpha(theme.palette[trendColor].main, 0.1),
            color: (theme) => theme.palette[trendColor].dark
          }}
        />
      </Box>
    </Box>
  );
}