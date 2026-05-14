import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

import {
  Card,
  CardContent,
  Box,
  Typography,
  useTheme,
  alpha,
  Avatar,
  LinearProgress,
  Chip,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { WalletAnalysis as WalletAnalysisType } from 'src/types/financial-reports';

// ----------------------------------------------------------------------

interface WalletAnalysisProps {
  wallets: WalletAnalysisType[];
}

export function WalletAnalysis({ wallets }: WalletAnalysisProps) {
  const { t } = useTranslation('financialReports');
  const theme = useTheme();

  const totalBalance = useMemo(() => {
    return wallets.reduce((sum, w) => sum + w.balance, 0);
  }, [wallets]);

  const mostUsedWallet = useMemo(() => {
    return [...wallets].sort((a, b) => b.transactionCount - a.transactionCount)[0];
  }, [wallets]);

  const highestSpendingWallet = useMemo(() => {
    return [...wallets].sort((a, b) => b.monthlySpending - a.monthlySpending)[0];
  }, [wallets]);

  const getWalletTypeLabel = (type: string) => {
    switch (type) {
      case 'cash':
        return 'Cash';
      case 'bank':
        return 'Bank';
      case 'credit':
        return 'Credit';
      case 'ewallet':
        return 'E-Wallet';
      default:
        return type;
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        height: '100%',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: alpha(theme.palette.info.main, 0.1),
                mr: 2,
                color: theme.palette.info.main,
              }}
            >
              <Iconify icon={'solar:wallet-bold' as any} width={24} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {t('sections.wallets.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(totalBalance)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Wallet Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
          {wallets.slice(0, 4).map((wallet) => (
            <Box
              key={wallet.wallet.id}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(wallet.wallet.color, 0.05),
                border: `1px solid ${alpha(wallet.wallet.color, 0.15)}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1.5,
                    bgcolor: alpha(wallet.wallet.color, 0.12),
                    color: wallet.wallet.color,
                    mr: 1.5,
                  }}
                >
                  <Iconify icon={wallet.wallet.icon as any} width={16} />
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    {wallet.wallet.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {getWalletTypeLabel(wallet.wallet.type)}
                  </Typography>
                </Box>
                {wallet.wallet.id === mostUsedWallet?.wallet.id && (
                  <Chip
                    label={t('sections.wallets.mostUsed')}
                    size="small"
                    sx={{ ml: 'auto', borderRadius: 2, height: 20, fontSize: '10px', bgcolor: alpha(theme.palette.success.main, 0.12), color: theme.palette.success.main }}
                  />
                )}
              </Box>

              <Typography variant="h6" fontWeight={700} color={wallet.balance >= 0 ? 'text.primary' : 'error.main'}>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(wallet.balance)}
              </Typography>

              <Box sx={{ mt: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {wallet.percentage.toFixed(0)}%
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {wallet.transactionCount} tx
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={wallet.percentage}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: alpha(wallet.wallet.color, 0.12),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                      bgcolor: wallet.wallet.color,
                    },
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>

        {/* Summary Stats */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.success.main, 0.05) }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Iconify icon={'solar:star-bold' as any} width={14} sx={{ color: theme.palette.success.main, mr: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                {t('sections.wallets.mostUsed')}
              </Typography>
            </Box>
            <Typography variant="body2" fontWeight={600}>
              {mostUsedWallet?.wallet.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {mostUsedWallet?.transactionCount} transactions
            </Typography>
          </Box>

          <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.warning.main, 0.05) }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Iconify icon={'solar:coin-bold' as any} width={14} sx={{ color: theme.palette.warning.main, mr: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                {t('sections.wallets.highestSpending')}
              </Typography>
            </Box>
            <Typography variant="body2" fontWeight={600}>
              {highestSpendingWallet?.wallet.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(highestSpendingWallet?.monthlySpending || 0)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}