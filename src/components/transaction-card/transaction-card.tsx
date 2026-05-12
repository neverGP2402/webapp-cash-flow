import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Card, CardContent, Typography, Box, Chip, IconButton, Collapse } from '@mui/material';
import { styled } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

import type { Transaction } from 'src/types/transaction';

// ----------------------------------------------------------------------

interface TransactionCardProps {
  transaction: Transaction;
  onClick?: (transaction: Transaction) => void;
}

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  border: `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
  },
}));

const CategoryIcon = styled(Box)<{ color?: string }>(({ theme, color }) => ({
  width: 40,
  height: 40,
  borderRadius: theme.spacing(1),
  backgroundColor: color || theme.palette.grey[500],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
}));

const AmountText = styled(Typography)<{ type: 'income' | 'expense' }>(({ theme, type }) => ({
  fontWeight: 600,
  fontSize: '1.125rem',
  color: type === 'income' ? theme.palette.success.main : theme.palette.error.main,
}));

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => {
  const getColor = () => {
    switch (status) {
      case 'completed':
        return { bg: theme.palette.success.light, color: theme.palette.success.dark };
      case 'pending':
        return { bg: theme.palette.warning.light, color: theme.palette.warning.dark };
      case 'failed':
        return { bg: theme.palette.error.light, color: theme.palette.error.dark };
      default:
        return { bg: theme.palette.grey[200], color: theme.palette.grey[700] };
    }
  };

  const colors = getColor();

  return {
    backgroundColor: colors.bg,
    color: colors.color,
    fontSize: '0.75rem',
    height: 24,
  };
});

// ----------------------------------------------------------------------

export function TransactionCard({ transaction, onClick }: TransactionCardProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const handleCardClick = () => {
    if (onClick) {
      onClick(transaction);
    } else {
      setExpanded(!expanded);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <StyledCard onClick={handleCardClick}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          {/* Left side - Icon and transaction info */}
          <Box display="flex" alignItems="center" flex={1}>
            <CategoryIcon color={transaction.category.color}>
              <Iconify icon="solar:cart-3-bold" width={20} />
            </CategoryIcon>
            
            <Box ml={2} flex={1}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.5 }}>
                {transaction.name}
              </Typography>
              
              {transaction.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {transaction.description}
                </Typography>
              )}
              
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="caption" color="text.secondary">
                  {transaction.wallet.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  •
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {transaction.time}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Right side - Amount and status */}
          <Box textAlign="right">
            <AmountText type={transaction.type} variant="h6">
              {transaction.type === 'income' ? '+' : '-'} {formatAmount(transaction.amount)}
            </AmountText>
            
            <Box display="flex" alignItems="center" justifyContent="flex-end" gap={1} mt={1}>
              <StatusChip
                status={transaction.status}
                label={t(`transactionHistory.${transaction.status}`)}
                size="small"
              />
              <IconButton size="small" sx={{ p: 0.5 }}>
                <Iconify 
                  icon="carbon:chevron-sort" 
                  width={16} 
                  color="text.secondary" 
                  sx={{ 
                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease-in-out'
                  }} 
                />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Expanded details */}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box mt={2} pt={2} borderTop={`1px solid rgba(0, 0, 0, 0.08)`}>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              {t('transactionHistory.transactionDetails')}
            </Typography>
            
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t('transactionHistory.category')}
                </Typography>
                <Typography variant="body2">
                  {transaction.category.name}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t('transactionHistory.walletInfo')}
                </Typography>
                <Typography variant="body2">
                  {transaction.wallet.name}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t('transactionHistory.status')}
                </Typography>
                <Typography variant="body2">
                  {t(`transactionHistory.${transaction.status}`)}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t('transactionHistory.date')}
                </Typography>
                <Typography variant="body2">
                  {transaction.date}
                </Typography>
              </Box>
            </Box>

            {transaction.note && (
              <Box mt={2}>
                <Typography variant="caption" color="text.secondary">
                  {t('transactionHistory.note')}
                </Typography>
                <Typography variant="body2">
                  {transaction.note}
                </Typography>
              </Box>
            )}

            {transaction.receiptImage && (
              <Box mt={2}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  {t('transactionHistory.receipt')}
                </Typography>
                <Box
                  component="img"
                  src={transaction.receiptImage}
                  alt="Receipt"
                  sx={{
                    width: '100%',
                    maxWidth: 200,
                    height: 'auto',
                    borderRadius: 1,
                    border: `1px solid rgba(0, 0, 0, 0.12)`,
                  }}
                />
              </Box>
            )}

            {transaction.products && transaction.products.length > 0 && (
              <Box mt={2}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  {t('transactionHistory.products')}
                </Typography>
                {transaction.products.map((product, index) => (
                  <Box key={product.id} display="flex" justifyContent="space-between" py={0.5}>
                    <Typography variant="body2">
                      {product.quantity}x {product.name}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatAmount(product.total)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Collapse>
      </CardContent>
    </StyledCard>
  );
}
