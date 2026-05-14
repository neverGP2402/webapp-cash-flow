import { useTranslation } from 'react-i18next';
import { Card, CardContent, Box, Typography, alpha, Chip, LinearProgress, Avatar } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { Debt } from 'src/types/debt-management';

interface DebtCardProps {
  debt: Debt;
  onClick?: () => void;
}

export function DebtCard({ debt, onClick }: DebtCardProps) {
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

  const progress = debt.principal > 0 ? (debt.paidAmount / debt.principal) * 100 : 0;

  const getStatusColor = (status: Debt['status']) => {
    const colors = {
      active: 'success',
      paid: 'default',
      overdue: 'error',
      pending: 'warning',
      cancelled: 'default',
    } as const;
    return colors[status];
  };

  const getTypeIcon = (type: Debt['type']) => {
    return type === 'borrowing' ? 'solar:round-alt-arrow-left-bold' : 'solar:round-alt-arrow-right-bold';
  };

  const getTypeColor = (type: Debt['type']) => {
    return type === 'borrowing' ? '#ef4444' : '#22c55e';
  };

  const isOverdue = new Date(debt.dueDate) < new Date() && debt.status === 'active';

  return (
    <Card
      onClick={onClick}
      sx={{
        borderRadius: 3,
        border: `1px solid ${isOverdue ? alpha('#ef4444', 0.3) : alpha('#000', 0.06)}`,
        background: isOverdue
          ? `linear-gradient(135deg, ${alpha('#ef4444', 0.05)} 0%, ${alpha('#ef4444', 0.02)} 100%)`
          : 'background.paper',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: alpha(getTypeColor(debt.type), 0.1),
                fontSize: 24,
              }}
            >
              {debt.counterparty.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.25 }}>
                {debt.counterparty.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Iconify icon={getTypeIcon(debt.type) as any} width={16} color={getTypeColor(debt.type)} />
                <Typography variant="caption" color="text.secondary">
                  {debt.type === 'borrowing' ? t('type.borrowing') : t('type.lending')}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Chip
            label={t(`status.${debt.status}`)}
            color={getStatusColor(debt.status)}
            size="small"
            sx={{
              height: 24,
              fontWeight: 600,
              fontSize: 11,
            }}
          />
        </Box>

        {/* Contract Number */}
        {debt.contractNumber && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              {t('debtCard.contractNumber')}: {debt.contractNumber}
            </Typography>
          </Box>
        )}

        {/* Amount Details */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t('debtCard.principal')}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {formatCurrency(debt.principal)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t('debtCard.paid')}
            </Typography>
            <Typography variant="body2" fontWeight={600} color="success.main">
              {formatCurrency(debt.paidAmount)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              {t('debtCard.remaining')}
            </Typography>
            <Typography variant="body2" fontWeight={700} color={debt.remainingAmount > 0 ? 'error.main' : 'success.main'}>
              {formatCurrency(debt.remainingAmount)}
            </Typography>
          </Box>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              {t('debtCard.progress')}
            </Typography>
            <Typography variant="caption" fontWeight={600}>
              {progress.toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: alpha('#000', 0.05),
              '& .MuiLinearProgress-bar': {
                borderRadius: 3,
                bgcolor: progress >= 100 ? '#22c55e' : getTypeColor(debt.type),
              },
            }}
          />
        </Box>

        {/* Footer */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {t('debtCard.dueDate')}: {formatDate(debt.dueDate)}
          </Typography>
          {debt.interestRate && (
            <Chip
              label={`${debt.interestRate}%`}
              size="small"
              variant="outlined"
              sx={{
                height: 20,
                fontSize: 10,
                borderColor: alpha('#f59e0b', 0.3),
                color: '#f59e0b',
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
