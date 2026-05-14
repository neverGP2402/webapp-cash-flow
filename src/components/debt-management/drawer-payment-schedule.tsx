import { useTranslation } from 'react-i18next';
import { Box, Typography, alpha, Alert, Chip } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import type { PaymentSchedule } from 'src/types/debt-management';

interface DrawerPaymentScheduleProps {
  schedule: PaymentSchedule;
}

export function DrawerPaymentSchedule({ schedule }: DrawerPaymentScheduleProps) {
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

  const getSeverity = () => {
    if (schedule.isOverdue) return 'error';
    if (schedule.daysUntilDue <= 7) return 'warning';
    return 'info';
  };

  const getWarningMessage = () => {
    if (schedule.isOverdue) {
      return t('drawer.schedule.overdueWarning', { days: Math.abs(schedule.daysUntilDue) });
    }
    if (schedule.daysUntilDue <= 7) {
      return t('drawer.schedule.upcomingWarning', { days: schedule.daysUntilDue });
    }
    return null;
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        {t('drawer.schedule.title')}
      </Typography>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: alpha('#1976d2', 0.05),
          border: `1px solid ${alpha('#1976d2', 0.1)}`,
        }}
      >
        {getWarningMessage() && (
          <Alert severity={getSeverity() as any} sx={{ mb: 2 }}>
            {getWarningMessage()}
          </Alert>
        )}

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              {t('drawer.schedule.nextPayment')}
            </Typography>
            <Typography variant="h6" fontWeight={700} color="primary.main">
              {formatDate(schedule.nextPaymentDate)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              {t('drawer.schedule.amount')}
            </Typography>
            <Typography variant="h6" fontWeight={700} color="primary.main">
              {formatCurrency(schedule.nextPaymentAmount)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              {t('drawer.schedule.deadline')}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {formatDate(schedule.nextPaymentDate)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              {t('drawer.schedule.remainingPayments')}
            </Typography>
            <Chip
              label={schedule.remainingPayments}
              size="small"
              sx={{
                height: 24,
                fontSize: 11,
                bgcolor: alpha('#22c55e', 0.1),
                color: '#22c55e',
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>

        <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${alpha('#000', 0.1)}` }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              {t('drawer.paymentProgress.remainingAmount')}
            </Typography>
            <Typography variant="h5" fontWeight={700} color="primary.main">
              {formatCurrency(schedule.totalRemaining)}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
