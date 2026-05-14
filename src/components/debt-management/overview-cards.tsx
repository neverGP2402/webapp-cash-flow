import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Typography, alpha, useTheme } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { DebtOverview } from 'src/types/debt-management';

interface OverviewCardsProps {
  overview: DebtOverview;
}

export function OverviewCards({ overview }: OverviewCardsProps) {
  const { t } = useTranslation('debtManagement');
  const theme = useTheme();

  const cards = [
    {
      key: 'totalOwed',
      label: t('overview.totalOwed'),
      value: overview.totalOwed,
      icon: 'solar:money-bag-bold',
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
      borderColor: alpha('#ef4444', 0.2),
    },
    {
      key: 'totalOwedToMe',
      label: t('overview.totalOwedToMe'),
      value: overview.totalOwedToMe,
      icon: 'solar:wallet-money-bold',
      color: '#22c55e',
      gradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
      borderColor: alpha('#22c55e', 0.2),
    },
    {
      key: 'totalPaid',
      label: t('overview.totalPaid'),
      value: overview.totalPaid,
      icon: 'solar:check-circle-bold',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
      borderColor: alpha('#3b82f6', 0.2),
    },
    {
      key: 'totalRemaining',
      label: t('overview.totalRemaining'),
      value: overview.totalRemaining,
      icon: 'solar:chart-2-bold',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
      borderColor: alpha('#f59e0b', 0.2),
    },
    {
      key: 'upcomingDue',
      label: t('overview.upcomingDue'),
      value: overview.upcomingDue,
      icon: 'solar:clock-circle-bold',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
      borderColor: alpha('#8b5cf6', 0.2),
    },
    {
      key: 'overdue',
      label: t('overview.overdue'),
      value: overview.overdue,
      icon: 'solar:danger-circle-bold',
      color: '#dc2626',
      gradient: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
      borderColor: alpha('#dc2626', 0.2),
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
        gap: 3,
        mb: 4,
      }}
    >
      {cards.map((card) => (
        <Card
          key={card.key}
          sx={{
            borderRadius: 3,
            border: `1px solid ${card.borderColor}`,
            background: card.gradient,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0px 12px 24px ${alpha(card.color, 0.15)}`,
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: alpha(card.color, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify icon={card.icon as any} width={24} color={card.color} />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: alpha(card.color, 0.1),
                  color: card.color,
                  fontWeight: 600,
                  fontSize: 11,
                }}
              >
                {card.key === 'totalOwed' || card.key === 'totalRemaining' || card.key === 'overdue'
                  ? 'Nợ'
                  : 'Có'}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
              {card.label}
            </Typography>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                color: card.color,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatCurrency(card.value)}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
