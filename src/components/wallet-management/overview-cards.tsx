import { useTranslation } from 'react-i18next';
import { Box, Typography, Card, CardContent, alpha, Skeleton } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import type { WalletOverview } from 'src/types/wallet';

interface OverviewCardsProps {
  overview: WalletOverview | null;
  loading?: boolean;
}

export function OverviewCards({ overview, loading = false }: OverviewCardsProps) {
  const { t } = useTranslation('walletManagement');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const cards = [
    {
      title: t('overview.totalWallets'),
      value: overview?.totalWallets ?? 0,
      icon: 'solar:wallet-bold',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      format: 'number',
    },
    {
      title: t('overview.totalBalance'),
      value: overview?.totalBalance ?? 0,
      icon: 'solar:coin-bold',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      format: 'currency',
    },
    {
      title: t('overview.mostActiveWallet'),
      value: overview?.mostActiveWallet ?? '-',
      icon: 'solar:graph-up-bold',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      format: 'text',
    },
    {
      title: t('overview.totalTransactions'),
      value: overview?.totalTransactionsThisMonth ?? 0,
      icon: 'solar:arrow-circle-bold',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
      format: 'number',
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 3,
          mb: 4,
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} sx={{ borderRadius: 3, p: 2 }}>
            <Skeleton variant="text" width="60%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="80%" height={40} />
          </Card>
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 4,
      }}
    >
      {cards.map((card, index) => (
        <Card
          key={index}
          sx={{
            borderRadius: 4,
            border: `1px solid ${alpha(card.color, 0.15)}`,
            background: `linear-gradient(135deg, ${alpha(card.color, 0.04)} 0%, ${alpha(card.color, 0.01)} 100%)`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0px 12px 24px ${alpha(card.color, 0.12)}`,
            },
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  background: card.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0px 6px 12px ${alpha(card.color, 0.25)}`,
                }}
              >
                <Iconify icon={card.icon as any} width={24} sx={{ color: 'white' }} />
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
              {card.title}
            </Typography>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{
                color: 'text.primary',
                fontSize: { xs: 24, md: 28 },
              }}
            >
              {card.format === 'currency' ? formatCurrency(card.value as number) : card.value}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}