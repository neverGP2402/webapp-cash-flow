import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

import {
  Card,
  CardContent,
  Box,
  Typography,
  alpha,
  useTheme,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Skeleton,
  Avatar,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { AssetTransaction } from 'src/types/asset-detail';

interface AssetTransactionListProps {
  transactions: AssetTransaction[];
  isLoading?: boolean;
}

export function AssetTransactionList({ transactions, isLoading = false }: AssetTransactionListProps) {
  const { t } = useTranslation('assetDetail');
  const theme = useTheme();

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(amount));
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const groupTransactionsByDate = (txList: AssetTransaction[]) => {
    const grouped: { [key: string]: AssetTransaction[] } = {};
    
    txList.forEach(transaction => {
      const date = new Date(transaction.timestamp).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .map(([date, txs]) => ({
        date,
        transactions: txs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
      }));
  };

  const getTransactionTypeColor = (type: AssetTransaction['type']) => {
    return type === 'buy' ? theme.palette.success.main : theme.palette.error.main;
  };

  const getProfitColor = (profit: number) => {
    if (profit > 0) return theme.palette.success.main;
    if (profit < 0) return theme.palette.error.main;
    return theme.palette.grey[500];
  };

  const groupedTransactions = useMemo(() => groupTransactionsByDate(transactions), [transactions]);

  const totalProfit = useMemo(() => {
    return transactions.reduce((sum, tx) => sum + tx.profit, 0);
  }, [transactions]);

  const TransactionCard = ({ transaction }: { transaction: AssetTransaction }) => (
    <Card
      sx={{
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
          borderColor: alpha(theme.palette.primary.main, 0.2),
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          {/* Left: Type & Basic Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label={transaction.type === 'buy' ? t('transactions.buy') : t('transactions.sell')}
                size="small"
                sx={{
                  backgroundColor: alpha(getTransactionTypeColor(transaction.type), 0.1),
                  color: getTransactionTypeColor(transaction.type),
                  fontWeight: 700,
                  fontSize: '11px',
                  height: 24,
                  borderRadius: 1,
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {formatDateTime(transaction.timestamp)}
              </Typography>
            </Box>

            {/* Transaction Amount */}
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {transaction.quantity.toLocaleString('vi-VN')} × {formatAmount(transaction.price)}₫
              </Typography>
              <Typography variant="h6" fontWeight={700} color="primary.main">
                {formatAmount(transaction.totalValue)}₫
              </Typography>
            </Box>

            {/* Wallet Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box
                sx={{
                  p: 0.5,
                  borderRadius: 1,
                  background: alpha(theme.palette.grey[500], 0.1),
                  mr: 0.75,
                }}
              >
                <Iconify icon="solar:wallet-money-bold" width={14} sx={{ color: 'text.secondary' }} />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {transaction.wallet}
              </Typography>
            </Box>

            {transaction.note && (
              <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                {transaction.note}
              </Typography>
            )}
          </Box>

          {/* Right: Profit/Loss Info */}
          <Box sx={{ textAlign: 'right', ml: 2, flexShrink: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              {t('transactions.currentValue')}
            </Typography>
            <Typography variant="body1" fontWeight={700} sx={{ mb: 1.5 }}>
              {formatAmount(transaction.currentValue)}₫
            </Typography>
            
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: alpha(getProfitColor(transaction.profit), 0.08),
                border: `1px solid ${alpha(getProfitColor(transaction.profit), 0.2)}`,
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                {t('transactions.profit')}
              </Typography>
              <Typography 
                variant="body1" 
                fontWeight={700}
                color={getProfitColor(transaction.profit)}
                sx={{ lineHeight: 1.2 }}
              >
                {transaction.profit >= 0 ? '+' : ''}{formatAmount(transaction.profit)}₫
              </Typography>
              <Typography 
                variant="caption" 
                fontWeight={700}
                color={getProfitColor(transaction.profit)}
              >
                {transaction.profitPercentage >= 0 ? '+' : ''}{transaction.profitPercentage.toFixed(2)}%
              </Typography>
            </Box>
          </Box>

          {/* Actions */}
          <Box sx={{ ml: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5, flexShrink: 0 }}>
            <Tooltip title={t('transactions.viewDetails')}>
              <IconButton size="small">
                <Iconify icon="solar:eye-bold" width={16} />
              </IconButton>
            </Tooltip>
            <Tooltip title={t('transactions.edit')}>
              <IconButton size="small">
                <Iconify icon="solar:pen-bold" width={16} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Card
        sx={{
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width={150} height={28} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width={80} height={20} />
            </Box>
          </Box>
          {[...Array(3)].map((_, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Skeleton variant="text" width={200} height={24} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" width="100%" height={120} sx={{ borderRadius: 3 }} />
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card
        sx={{
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <CardContent sx={{ p: 5, textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: alpha(theme.palette.primary.main, 0.08),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <Iconify icon="solar:check-circle-bold" width={36} sx={{ color: alpha(theme.palette.primary.main, 0.4) }} />
          </Box>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
            {t('transactions.noTransactions')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Chưa có giao dịch nào cho tài sản này
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: alpha(theme.palette.primary.main, 0.1),
                mr: 2,
                color: theme.palette.primary.main,
              }}
            >
              <Iconify icon="solar:check-circle-bold" width={24} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {t('transactions.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {transactions.length} giao dịch
              </Typography>
            </Box>
          </Box>

          {/* Summary Stats */}
          <Box
            sx={{
              px: 2,
              py: 1,
              borderRadius: 2,
              background: alpha(getProfitColor(totalProfit), 0.08),
              border: `1px solid ${alpha(getProfitColor(totalProfit), 0.2)}`,
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
              {t('transactions.totalProfit')}
            </Typography>
            <Typography 
              variant="body1" 
              fontWeight={700}
              color={getProfitColor(totalProfit)}
              sx={{ lineHeight: 1.2 }}
            >
              {totalProfit >= 0 ? '+' : ''}{formatAmount(totalProfit)}₫
            </Typography>
          </Box>
        </Box>

        {/* Transaction List */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxHeight: 700, overflowY: 'auto', pr: 1 }}>
          {groupedTransactions.map((group, groupIndex) => (
            <Box key={group.date}>
              <Typography 
                variant="subtitle2" 
                fontWeight={700} 
                color="text.secondary" 
                sx={{ 
                  mb: 2,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  fontSize: '12px',
                }}
              >
                {formatDate(group.date)}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {group.transactions.map((transaction) => (
                  <TransactionCard key={transaction.id} transaction={transaction} />
                ))}
              </Box>

              {groupIndex < groupedTransactions.length - 1 && <Divider sx={{ my: 2 }} />}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}