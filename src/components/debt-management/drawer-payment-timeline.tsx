import { useTranslation } from 'react-i18next';
import { Box, Typography, alpha, Chip, Avatar } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import type { DebtPaymentDetail } from 'src/types/debt-management';

interface DrawerPaymentTimelineProps {
  payments: DebtPaymentDetail[];
}

export function DrawerPaymentTimeline({ payments }: DrawerPaymentTimelineProps) {
  const { t } = useTranslation('debtManagement');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: DebtPaymentDetail['status']) => {
    const colors = {
      completed: '#22c55e',
      pending: '#f59e0b',
      cancelled: '#ef4444',
    };
    return colors[status];
  };

  const getMethodIcon = (method: DebtPaymentDetail['method']) => {
    const icons = {
      cash: '💵',
      bank: '🏦',
      transfer: '📱',
      other: '📄',
    };
    return icons[method];
  };

  if (payments.length === 0) {
    return (
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: alpha('#000', 0.02),
          border: `1px solid ${alpha('#000', 0.06)}`,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Chưa có lịch sử thanh toán
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        {t('drawer.paymentTimeline.title')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {payments.map((payment, index) => (
          <Box
            key={payment.id}
            sx={{
              display: 'flex',
              gap: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: alpha('#000', 0.02),
              border: `1px solid ${alpha('#000', 0.06)}`,
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: alpha('#000', 0.04),
                transform: 'translateX(4px)',
              },
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: alpha(getStatusColor(payment.status), 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                flexShrink: 0,
              }}
            >
              {getMethodIcon(payment.method)}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {formatCurrency(payment.amount)}
                </Typography>
                <Chip
                  label={payment.status === 'completed' ? 'Đã thanh toán' : payment.status === 'pending' ? 'Chờ xử lý' : 'Đã hủy'}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: 10,
                    bgcolor: alpha(getStatusColor(payment.status), 0.1),
                    color: getStatusColor(payment.status),
                    fontWeight: 600,
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(payment.paymentDate)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  •
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t(`drawer.paymentTimeline.methods.${payment.method}`)}
                </Typography>
              </Box>
              {payment.note && (
                <Typography variant="caption" color="text.secondary">
                  {payment.note}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
