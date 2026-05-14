import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  Box,
  Typography,
  useTheme,
  alpha,
  Avatar,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { TransactionGroup } from 'src/types/financial-reports';

// ----------------------------------------------------------------------

interface TransactionFeedProps {
  transactions: TransactionGroup[];
}

export function TransactionFeed({ transactions }: TransactionFeedProps) {
  const { t } = useTranslation('financialReports');
  const theme = useTheme();

  const formatAmount = (amount: number, type: 'income' | 'expense') => {
    const formatted = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);

    return type === 'income' ? `+${formatted}` : `-${formatted}`;
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
                background: alpha(theme.palette.primary.main, 0.1),
                mr: 2,
                color: theme.palette.primary.main,
              }}
            >
              <Iconify icon={'solar:arrow-left-right-bold' as any} width={24} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {t('sections.transactions.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('sections.transactions.subtitle')}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Transaction Groups */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {transactions.slice(0, 3).map((group) => (
            <Box key={group.date}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                fontWeight={600}
                sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}
              >
                {t(`sections.transactions.${group.label}`, group.label)}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {group.transactions.slice(0, 3).map((transaction) => (
                  <Box
                    key={transaction.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.background.default, 0.5),
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.background.default, 0.8),
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor:
                          transaction.type === 'income'
                            ? alpha(theme.palette.success.main, 0.12)
                            : alpha(theme.palette.error.main, 0.12),
                        color:
                          transaction.type === 'income'
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                        mr: 2,
                      }}
                    >
                      <Iconify
                        icon={(
                          transaction.type === 'income'
                            ? 'solar:arrow-down-bold'
                            : 'solar:arrow-up-bold'
                        ) as any}
                        width={20}
                      />
                    </Avatar>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {transaction.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {transaction.category.name} • {transaction.wallet.name}
                      </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'right' }}>
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                      >
                        {formatAmount(transaction.amount, transaction.type)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {transaction.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        {/* View All Link */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography
            variant="body2"
            color="primary.main"
            fontWeight={600}
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            {t('sections.transactions.viewAll')} →
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}