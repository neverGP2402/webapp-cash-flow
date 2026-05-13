import { useTranslation } from 'react-i18next';
import { Card, CardContent, Box, Typography, alpha, Chip } from '@mui/material';
import { ExchangeRate } from 'src/types/add-asset';

interface ExchangeRateCardProps {
  exchangeRate: ExchangeRate | null;
  loading?: boolean;
}

export default function ExchangeRateCard({
  exchangeRate,
  loading
}: ExchangeRateCardProps) {
  const { t } = useTranslation('add-asset');

  if (!exchangeRate && !loading) {
    return null;
  }

  if (loading) {
    return (
      <Card
        sx={{
          borderRadius: 3,
          border: `1px solid ${alpha('#000', 0.06)}`,
          overflow: 'visible'
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {t('form.exchangeRate.label')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Box sx={{ flex: 1, height: 40, borderRadius: 1, bgcolor: 'action.hover' }} />
            <Box sx={{ flex: 1, height: 40, borderRadius: 1, bgcolor: 'action.hover' }} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: `1px solid ${alpha('#000', 0.06)}`,
        background: (theme) =>
          `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.primary.main, 0.06)} 100%)`,
        overflow: 'visible',
        position: 'relative'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -1,
          left: -1,
          right: -1,
          height: 3,
          borderRadius: '3px 3px 0 0',
          background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)'
        }}
      />
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
            {t('form.exchangeRate.label')}
          </Typography>
          {exchangeRate?.source && (
            <Chip
              label={exchangeRate.source}
              size="small"
              sx={{
                height: 20,
                fontSize: 11,
                bgcolor: alpha('#1976d2', 0.08),
                color: 'primary.main',
                fontWeight: 600
              }}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box
            sx={{
              flex: 1,
              p: 2,
              borderRadius: 2,
              bgcolor: alpha('#2e7d32', 0.04),
              border: `1px solid ${alpha('#2e7d32', 0.1)}`
            }}
          >
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              {t('form.exchangeRate.buyPrice')}
            </Typography>
            <Typography variant="h6" fontWeight={700} color="success.dark">
              {formatPrice(exchangeRate!.buy_price)}
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              p: 2,
              borderRadius: 2,
              bgcolor: alpha('#d32f2f', 0.04),
              border: `1px solid ${alpha('#d32f2f', 0.1)}`
            }}
          >
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              {t('form.exchangeRate.sellPrice')}
            </Typography>
            <Typography variant="h6" fontWeight={700} color="error.dark">
              {formatPrice(exchangeRate!.sell_price)}
            </Typography>
          </Box>
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <Box
            component="span"
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: 'success.main',
              display: 'inline-block',
              animation: 'pulse 2s infinite'
            }}
          />
          {t('form.exchangeRate.updatedAt')}: {getTimeAgo(exchangeRate!.updated_at)}
        </Typography>
      </CardContent>
    </Card>
  );
}