import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Typography, alpha, Avatar, Chip, LinearProgress } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import type { CounterpartyAnalytics } from 'src/types/debt-management';

interface CounterpartyAnalyticsProps {
  analytics: CounterpartyAnalytics[];
}

export function CounterpartyAnalytics({ analytics }: CounterpartyAnalyticsProps) {
  const { t } = useTranslation('debtManagement');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getOnTimeRateColor = (rate: number) => {
    if (rate >= 90) return '#22c55e';
    if (rate >= 70) return '#f59e0b';
    return '#ef4444';
  };

  if (analytics.length === 0) {
    return null;
  }

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: `1px solid ${alpha('#000', 0.06)}`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
          {t('counterparty.title')}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {analytics.map((item, index) => (
            <Box
              key={item.counterparty.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: alpha('#000', 0.02),
                border: `1px solid ${alpha('#000', 0.06)}`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: alpha('#000', 0.04),
                  transform: 'translateX(4px)',
                },
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: alpha('#1976d2', 0.1),
                    fontSize: 20,
                    fontWeight: 600,
                  }}
                >
                  {item.counterparty.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -4,
                    right: -4,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    bgcolor: getOnTimeRateColor(item.onTimeRate),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid white',
                  }}
                >
                  <Typography variant="caption" sx={{ fontSize: 10, fontWeight: 700, color: 'white' }}>
                    {index + 1}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>
                  {item.counterparty.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Chip
                    label={`${item.transactionCount} ${t('counterparty.transactions') || 'giao dịch'}`}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: 10,
                      bgcolor: alpha('#1976d2', 0.1),
                      color: '#1976d2',
                      fontWeight: 600,
                    }}
                  />
                  {item.overdueCount > 0 && (
                    <Chip
                      label={`${item.overdueCount} ${t('counterparty.overdue') || 'quá hạn'}`}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: 10,
                        bgcolor: alpha('#ef4444', 0.1),
                        color: '#ef4444',
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>
              </Box>

              <Box sx={{ textAlign: 'right', minWidth: 120 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25 }}>
                  {t('counterparty.totalDebt')}
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary.main">
                  {formatCurrency(item.totalDebt)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {t('counterparty.onTimeRate')}:
                  </Typography>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    sx={{ color: getOnTimeRateColor(item.onTimeRate) }}
                  >
                    {item.onTimeRate.toFixed(0)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={item.onTimeRate}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    mt: 0.5,
                    bgcolor: alpha('#000', 0.05),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 2,
                      bgcolor: getOnTimeRateColor(item.onTimeRate),
                    },
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
