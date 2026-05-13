import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  Box,
  Typography,
  alpha,
  useTheme,
  Fade,
  Chip,
  IconButton,
  Tooltip,
  Divider,
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
    return amount.toLocaleString('vi-VN');
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

  const groupTransactionsByDate = (transactions: AssetTransaction[]) => {
    const grouped: { [key: string]: AssetTransaction[] } = {};
    
    transactions.forEach(transaction => {
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

  const renderTransactionCard = (transaction: AssetTransaction) => (
    <Card
      key={transaction.id}
      sx={{
        p: 2,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: theme.shadows[4],
          borderColor: alpha(theme.palette.primary.main, 0.2),
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        {/* Transaction Info */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Chip
              label={transaction.type === 'buy' ? t('transactions.buy') : t('transactions.sell')}
              size="small"
              sx={{
                backgroundColor: alpha(getTransactionTypeColor(transaction.type), 0.1),
                color: getTransactionTypeColor(transaction.type),
                fontWeight: 600,
                mr: 1,
              }}
            />
            <Typography variant="body2" color="text.secondary">
              {formatDateTime(transaction.timestamp)}
            </Typography>
          </Box>

          <Box sx={{ mb: 1 }}>
            <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
              {transaction.quantity.toLocaleString('vi-VN')} × {formatAmount(transaction.price)}₫
            </Typography>
            <Typography variant="h6" fontWeight={700} color="primary.main">
              {formatAmount(transaction.totalValue)}₫
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              {t('transactions.wallet')}:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {transaction.wallet}
            </Typography>
          </Box>

          {transaction.note && (
            <Typography variant="caption" color="text.secondary">
              {transaction.note}
            </Typography>
          )}
        </Box>

        {/* Profit/Loss Info */}
        <Box sx={{ textAlign: 'right', ml: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {t('transactions.currentValue')}
          </Typography>
          <Typography variant="h6" fontWeight={700}>
            {formatAmount(transaction.currentValue)}₫
          </Typography>
          
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {t('transactions.profit')}
            </Typography>
            <Typography 
              variant="h6" 
              fontWeight={700}
              color={getProfitColor(transaction.profit)}
            >
              {transaction.profit > 0 ? '+' : ''}{formatAmount(transaction.profit)}₫
            </Typography>
            <Typography 
              variant="body2" 
              fontWeight={600}
              color={getProfitColor(transaction.profit)}
            >
              {transaction.profitPercentage > 0 ? '+' : ''}{transaction.profitPercentage.toFixed(2)}%
            </Typography>
          </Box>
        </Box>

        {/* Action Button */}
        <Box sx={{ ml: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Tooltip title="Xem chi tiết">
            <IconButton size="small">
              <Iconify icon="solar:eye-bold" width={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <IconButton size="small">
              <Iconify icon="solar:pen-bold" width={16} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Card>
  );

  const groupedTransactions = groupTransactionsByDate(transactions);

  if (isLoading) {
    return (
      <Card
        sx={{
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          height: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {t('loading')}
        </Typography>
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
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <Iconify icon={("solar:document-add-bold" as any)} width={48} sx={{ mb: 2, opacity: 0.3 }} />
          <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
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
    <Fade in={!isLoading} timeout={800}>
      <Card
        sx={{
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
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
                <Iconify icon={("solar:file-text-bold" as any)} width={24} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {t('transactions.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {transactions.length} giao dịch
                </Typography>
              </Box>
            </Box>

            {/* Summary Stats */}
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="text.secondary">
                Tổng L/L
              </Typography>
              <Typography 
                variant="h6" 
                fontWeight={700}
                color={getProfitColor(
                  transactions.reduce((sum, tx) => sum + tx.profit, 0)
                )}
              >
                {transactions.reduce((sum, tx) => sum + tx.profit, 0) > 0 ? '+' : ''}
                {formatAmount(transactions.reduce((sum, tx) => sum + tx.profit, 0))}₫
              </Typography>
            </Box>
          </Box>

          {/* Transaction List */}
          <Box sx={{ maxHeight: 600, overflowY: 'auto' }}>
            {groupedTransactions.map((group, groupIndex) => (
              <Box key={group.date} sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 2 }}>
                  {new Date(group.date).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {group.transactions.map(renderTransactionCard)}
                </Box>

                {groupIndex < groupedTransactions.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
}
