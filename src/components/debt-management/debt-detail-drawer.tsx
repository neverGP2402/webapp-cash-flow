import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  useTheme,
  useMediaQuery,
  alpha,
  styled,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { DrawerPaymentTimeline } from './drawer-payment-timeline';
import { DrawerContractInfo } from './drawer-contract-info';
import { DrawerDebtAnalysis } from './drawer-debt-analysis';
import { DrawerPaymentSchedule } from './drawer-payment-schedule';

import type { DebtDetailDrawerProps } from 'src/types/debt-management';

// ----------------------------------------------------------------------

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    borderRadius: theme.spacing(2, 2, 0, 0),
  },
  '& .MuiBackdrop-root': {
    backgroundColor: alpha('#000', 0.5),
  },
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(3),
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)}, ${alpha(theme.palette.primary.dark, 0.05)})`,
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(3),
}));

const ScrollContainer = styled(Box)(({ theme }) => ({
  overflowY: 'auto',
  maxHeight: 'calc(100vh - 200px)',
  paddingRight: theme.spacing(1),
}));

const SectionContainer = styled(Box)(({ theme }) => ({
  mb: theme.spacing(4),
}));

// ----------------------------------------------------------------------

export function DebtDetailDrawer({ open, debt, onClose, onPayNow, onUpdate, onAddPayment, onMarkComplete }: DebtDetailDrawerProps) {
  const { t } = useTranslation('debtManagement');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Mock data for sub-components - In production, this would come from API
  const mockPayments = [
    {
      id: '1',
      debtId: debt?.id || '',
      amount: debt?.paymentType === 'installment' ? 12500000 : debt?.principal || 0,
      paymentDate: '2024-01-15',
      method: 'bank' as const,
      status: 'completed' as const,
      note: 'Thanh toán kỳ 1',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15',
    },
    {
      id: '2',
      debtId: debt?.id || '',
      amount: debt?.paymentType === 'installment' ? 12500000 : debt?.principal || 0,
      paymentDate: '2024-02-15',
      method: 'transfer' as const,
      status: 'completed' as const,
      note: 'Thanh toán kỳ 2',
      createdAt: '2024-02-15',
      updatedAt: '2024-02-15',
    },
    {
      id: '3',
      debtId: debt?.id || '',
      amount: debt?.paymentType === 'installment' ? 12500000 : debt?.principal || 0,
      paymentDate: '2024-03-15',
      method: 'bank' as const,
      status: 'completed' as const,
      note: 'Thanh toán kỳ 3',
      createdAt: '2024-03-15',
      updatedAt: '2024-03-15',
    },
    {
      id: '4',
      debtId: debt?.id || '',
      amount: debt?.paymentType === 'installment' ? 12500000 : debt?.principal || 0,
      paymentDate: '2024-04-15',
      method: 'transfer' as const,
      status: 'completed' as const,
      note: 'Thanh toán kỳ 4',
      createdAt: '2024-04-15',
      updatedAt: '2024-04-15',
    },
  ];

  const mockContract = {
    contractNumber: debt?.contractNumber || 'HD-2024-001',
    signedDate: debt?.startDate || '2024-01-01',
    loanType: 'personal' as const,
    paymentCycle: 'monthly' as const,
    notes: debt?.description || '',
    attachments: [],
  };

  const mockAnalysis = {
    repaymentTrend: [
      { date: '2024-01', value: 12500000 },
      { date: '2024-02', value: 12500000 },
      { date: '2024-03', value: 12500000 },
      { date: '2024-04', value: 12500000 },
      { date: '2024-05', value: 12500000 },
    ],
    remainingDebt: [
      { date: '2024-01', value: 137500000 },
      { date: '2024-02', value: 125000000 },
      { date: '2024-03', value: 112500000 },
      { date: '2024-04', value: 100000000 },
      { date: '2024-05', value: 87500000 },
    ],
    monthlyPayment: [
      { date: '2024-01', value: 12500000 },
      { date: '2024-02', value: 12500000 },
      { date: '2024-03', value: 12500000 },
      { date: '2024-04', value: 12500000 },
      { date: '2024-05', value: 12500000 },
    ],
  };

  const mockSchedule = {
    nextPaymentDate: debt?.dueDate || '2024-12-31',
    nextPaymentAmount: debt?.paymentType === 'installment' ? 12500000 : debt?.principal || 0,
    remainingPayments: debt?.paymentType === 'installment' ? 8 : 1,
    totalRemaining: debt?.remainingAmount || 0,
    isOverdue: debt?.status === 'overdue',
    daysUntilDue: 30,
  };

  const getDrawerWidth = () => {
    if (isMobile) return '100%';
    if (isTablet) return '70%';
    return '45%';
  };

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

  const progress = debt && debt.principal > 0 ? (debt.paidAmount / debt.principal) * 100 : 0;

  if (!debt) {
    return null;
  }

  return (
    <StyledDrawer
      anchor="right"
      open={open}
      onClose={onClose}
      variant={isMobile ? 'temporary' : 'persistent'}
      PaperProps={{
        sx: {
          width: getDrawerWidth(),
          maxWidth: '100vw',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <HeaderContainer>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: alpha(debt.type === 'borrowing' ? '#ef4444' : '#22c55e', 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
              }}
            >
              {debt.counterparty.name.charAt(0).toUpperCase()}
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {debt.counterparty.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {debt.type === 'borrowing' ? t('type.borrowing') : t('type.lending')}
                </Typography>
                {debt.contractNumber && (
                  <>
                    <Typography variant="caption" color="text.secondary">
                      •
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {debt.contractNumber}
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {onUpdate && (
              <IconButton size="small" onClick={() => onUpdate(debt.id)}>
                <Iconify icon="solar:pen-bold" width={20} />
              </IconButton>
            )}
            <IconButton size="small" onClick={onClose}>
              <Iconify icon="solar:check-circle-bold" width={20} />
            </IconButton>
          </Box>
        </HeaderContainer>

        {/* Content */}
        <ContentContainer>
          <ScrollContainer>
            {/* Overview Section */}
            <SectionContainer>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                {t('drawer.overview.title')}
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha('#1976d2', 0.05),
                    border: `1px solid ${alpha('#1976d2', 0.1)}`,
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                    {t('drawer.overview.principal')}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="primary.main">
                    {formatCurrency(debt.principal)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha('#22c55e', 0.05),
                    border: `1px solid ${alpha('#22c55e', 0.1)}`,
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                    {t('drawer.overview.totalPaid')}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="success.main">
                    {formatCurrency(debt.paidAmount)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha('#f59e0b', 0.05),
                    border: `1px solid ${alpha('#f59e0b', 0.1)}`,
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                    {t('drawer.overview.remaining')}
                  </Typography>
                  <Typography variant="h6" fontWeight={700} color="warning.main">
                    {formatCurrency(debt.remainingAmount)}
                  </Typography>
                </Box>
                {debt.interestRate && (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: alpha('#ef4444', 0.05),
                      border: `1px solid ${alpha('#ef4444', 0.1)}`,
                    }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                      {t('drawer.overview.interestRate')}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} color="error.main">
                      {debt.interestRate}%
                    </Typography>
                  </Box>
                )}
              </Box>
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {t('drawer.overview.startDate')}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatDate(debt.startDate)}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {t('drawer.overview.endDate')}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {formatDate(debt.dueDate)}
                  </Typography>
                </Box>
              </Box>
            </SectionContainer>

            {/* Payment Progress Section */}
            <SectionContainer>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                {t('drawer.paymentProgress.title')}
              </Typography>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: alpha('#1976d2', 0.05),
                  border: `1px solid ${alpha('#1976d2', 0.1)}`,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('drawer.paymentProgress.completed', { percent: progress.toFixed(1) })}
                  </Typography>
                  <Typography variant="body2" fontWeight={700} color="primary.main">
                    {progress.toFixed(1)}%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: alpha('#000', 0.05),
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${progress}%`,
                      bgcolor: progress >= 100 ? '#22c55e' : '#1976d2',
                      borderRadius: 4,
                      transition: 'width 0.5s ease',
                    }}
                  />
                </Box>
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="h5" fontWeight={700} color="primary.main">
                    {formatCurrency(debt.remainingAmount)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t('drawer.paymentProgress.remainingAmount')}
                  </Typography>
                </Box>
              </Box>
            </SectionContainer>

            {/* Description Section */}
            {debt.description && (
              <SectionContainer>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  {t('form.description')}
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha('#000', 0.02),
                    border: `1px solid ${alpha('#000', 0.06)}`,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {debt.description}
                  </Typography>
                </Box>
              </SectionContainer>
            )}

            {/* Payment Timeline */}
            <SectionContainer>
              <DrawerPaymentTimeline payments={mockPayments} />
            </SectionContainer>

            {/* Contract Information */}
            <SectionContainer>
              <DrawerContractInfo contract={mockContract} />
            </SectionContainer>

            {/* Payment Schedule */}
            <SectionContainer>
              <DrawerPaymentSchedule schedule={mockSchedule} />
            </SectionContainer>

            {/* Debt Analysis */}
            <SectionContainer>
              <DrawerDebtAnalysis analysis={mockAnalysis} />
            </SectionContainer>
          </ScrollContainer>
        </ContentContainer>

        {/* Footer Actions */}
        <Box
          sx={{
            p: 3,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          {onPayNow && (
            <Button
              variant="contained"
              onClick={() => onPayNow(debt.id)}
              sx={{ flex: 1, minWidth: 120 }}
            >
              {t('drawer.actions.payNow')}
            </Button>
          )}
          {onAddPayment && (
            <Button
              variant="outlined"
              onClick={() => onAddPayment(debt.id)}
              sx={{ flex: 1, minWidth: 120 }}
            >
              {t('drawer.actions.addPayment')}
            </Button>
          )}
          {onMarkComplete && debt.status === 'active' && (
            <Button
              variant="outlined"
              onClick={() => onMarkComplete(debt.id)}
              sx={{ flex: 1, minWidth: 120 }}
            >
              {t('drawer.actions.markComplete')}
            </Button>
          )}
        </Box>
      </Box>
    </StyledDrawer>
  );
}
