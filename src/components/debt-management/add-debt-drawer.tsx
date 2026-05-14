import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  Divider,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import type { AddDebtDrawerProps, AddDebtFormData, ValidationErrors, Wallet, Counterparty } from 'src/types/debt-management';

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

const ActionContainer = styled(Box)(({ theme }) => ({
  p: theme.spacing(3),
  borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  display: 'flex',
  gap: 1,
  flexWrap: 'wrap',
}));

// ----------------------------------------------------------------------

export function AddDebtDrawer({ open, mode, debt, onClose, onSave, onSaveDraft }: AddDebtDrawerProps) {
  const { t } = useTranslation('debtManagement');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const [formData, setFormData] = useState<AddDebtFormData>({
    debtType: 'borrowing',
    loanType: 'installment',
    counterpartyId: '',
    counterpartyName: '',
    contractNumber: '',
    signedDate: new Date().toISOString().split('T')[0],
    principal: 0,
    interestRate: 0,
    interestType: 'fixed',
    insuranceFee: 0,
    otherFees: 0,
    totalToPay: 0,
    paidAmount: 0,
    remainingAmount: 0,
    paymentCycle: 'monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    paymentCount: 0,
    walletId: '',
    paymentMethod: 'bank',
    paymentNotes: '',
    description: '',
    internalNotes: '',
    attachments: [],
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [warnings, setWarnings] = useState<string[]>([]);

  // Mock data - In production, this would come from API
  const mockCounterparties: Counterparty[] = [
    { id: '1', name: 'Nguyễn Văn A', type: 'individual', phone: '0901234567', email: 'nguyenvana@example.com' },
    { id: '2', name: 'Trần Thị B', type: 'individual', phone: '0912345678', email: 'tranthib@example.com' },
    { id: '3', name: 'Công ty ABC', type: 'company', phone: '0281234567', email: 'contact@abc.com' },
  ];

  const mockWallets: Wallet[] = [
    { id: '1', name: 'Tiền mặt', type: 'cash', balance: 5000000, currency: 'VND', icon: '💰' },
    { id: '2', name: 'Vietcombank', type: 'bank', balance: 50000000, currency: 'VND', icon: '🏦' },
    { id: '3', name: 'Techcombank', type: 'bank', balance: 30000000, currency: 'VND', icon: '🏦' },
    { id: '4', name: 'Ví MoMo', type: 'ewallet', balance: 10000000, currency: 'VND', icon: '📱' },
  ];

  // Reset form when opening in create mode
  useEffect(() => {
    if (open && mode === 'create') {
      const resetFormData: AddDebtFormData = {
        debtType: 'borrowing',
        loanType: 'installment',
        counterpartyId: '',
        counterpartyName: '',
        contractNumber: '',
        signedDate: new Date().toISOString().split('T')[0],
        principal: 0,
        interestRate: 0,
        interestType: 'fixed',
        insuranceFee: 0,
        otherFees: 0,
        totalToPay: 0,
        paidAmount: 0,
        remainingAmount: 0,
        paymentCycle: 'monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        paymentCount: 0,
        walletId: '',
        paymentMethod: 'bank',
        paymentNotes: '',
        description: '',
        internalNotes: '',
        attachments: [],
      };
      setFormData(resetFormData);
      setErrors({});
      setWarnings([]);
    }
  }, [open, mode]);

  // Load debt data when opening in edit mode
  useEffect(() => {
    if (open && mode === 'edit' && debt) {
      setFormData({
        debtType: debt.type,
        loanType: debt.paymentType === 'installment' ? 'installment' : 'oneTime',
        counterpartyId: debt.counterparty.id,
        counterpartyName: debt.counterparty.name,
        contractNumber: debt.contractNumber || '',
        signedDate: debt.startDate,
        principal: debt.principal,
        interestRate: debt.interestRate || 0,
        interestType: 'fixed',
        insuranceFee: 0,
        otherFees: 0,
        totalToPay: debt.principal + (debt.remainingAmount || 0),
        paidAmount: debt.paidAmount,
        remainingAmount: debt.remainingAmount,
        paymentCycle: 'monthly',
        startDate: debt.startDate,
        endDate: debt.dueDate,
        paymentCount: 12,
        walletId: '',
        paymentMethod: 'bank',
        paymentNotes: '',
        description: debt.description || '',
        internalNotes: '',
        attachments: [],
      });
    }
  }, [open, mode, debt]);

  // Calculate total to pay and remaining amount
  useEffect(() => {
    const totalInterest = formData.principal * (formData.interestRate / 100);
    const totalFees = formData.insuranceFee + formData.otherFees;
    const total = formData.principal + totalInterest + totalFees;
    const remaining = total - formData.paidAmount;

    setFormData((prev) => ({
      ...prev,
      totalToPay: total,
      remainingAmount: remaining,
    }));
  }, [formData.principal, formData.interestRate, formData.insuranceFee, formData.otherFees, formData.paidAmount]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.debtType) newErrors.debtType = t('addDrawer.validation.debtTypeRequired');
    if (!formData.loanType) newErrors.loanType = t('addDrawer.validation.loanTypeRequired');
    if (!formData.counterpartyId) newErrors.counterpartyId = t('addDrawer.validation.counterpartyRequired');
    if (!formData.principal || formData.principal <= 0) newErrors.principal = t('addDrawer.validation.principalRequired');
    if (formData.interestRate < 0) newErrors.interestRate = t('addDrawer.validation.interestRatePositive');
    if (!formData.startDate) newErrors.startDate = t('addDrawer.validation.startDateRequired');
    if (!formData.endDate) newErrors.endDate = t('addDrawer.validation.endDateRequired');
    if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = t('addDrawer.validation.invalidDateRange');
    }
    if (!formData.walletId) newErrors.walletId = t('addDrawer.validation.walletRequired');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check for warnings
  useEffect(() => {
    const newWarnings: string[] = [];

    if (formData.interestRate > 20) {
      newWarnings.push(t('addDrawer.validation.highInterestRate'));
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      if (months < 6 && formData.loanType === 'installment') {
        newWarnings.push(t('addDrawer.validation.shortDuration'));
      }
    }

    setWarnings(newWarnings);
  }, [formData.interestRate, formData.startDate, formData.endDate, formData.loanType, t]);

  const handleFormChange = (field: keyof AddDebtFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async () => {
    if (validateForm()) {
      try {
        await onSave(formData);
        onClose();
      } catch (error) {
        console.error('Error saving debt:', error);
      }
    }
  };

  const handleSaveDraft = async () => {
    try {
      if (onSaveDraft) {
        await onSaveDraft(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving draft:', error);
    }
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

  // Calculate estimated monthly payment
  const estimatedMonthlyPayment = useMemo(() => {
    if (formData.loanType === 'installment' && formData.paymentCount > 0) {
      return formData.totalToPay / formData.paymentCount;
    }
    return formData.totalToPay;
  }, [formData.totalToPay, formData.loanType, formData.paymentCount]);

  if (!open) return null;

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
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
              }}
            >
              💳
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {mode === 'create' ? t('addDrawer.title') : t('form.editDebt')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('addDrawer.subtitle')}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={onClose}>
            <Iconify icon="solar:check-circle-bold" width={20} />
          </IconButton>
        </HeaderContainer>

        {/* Content */}
        <ContentContainer>
          <ScrollContainer>
            {/* Warnings */}
            {warnings.length > 0 && (
              <Box sx={{ mb: 3 }}>
                {warnings.map((warning, index) => (
                  <Alert key={index} severity="warning" sx={{ mb: 1 }}>
                    {warning}
                  </Alert>
                ))}
              </Box>
            )}

            {/* Section 1: Debt Information */}
            <SectionContainer>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                {t('addDrawer.section1.title')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Box sx={{ flex: 1 }}>
                    <FormControl fullWidth error={!!errors.debtType}>
                      <InputLabel>{t('addDrawer.section1.debtType')}</InputLabel>
                      <Select
                        value={formData.debtType}
                        label={t('addDrawer.section1.debtType')}
                        onChange={(e) => handleFormChange('debtType', e.target.value)}
                      >
                        <MenuItem value="borrowing">{t('addDrawer.section1.borrowing')}</MenuItem>
                        <MenuItem value="lending">{t('addDrawer.section1.lending')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <FormControl fullWidth error={!!errors.loanType}>
                      <InputLabel>{t('addDrawer.section1.loanType')}</InputLabel>
                      <Select
                        value={formData.loanType}
                        label={t('addDrawer.section1.loanType')}
                        onChange={(e) => handleFormChange('loanType', e.target.value)}
                      >
                        <MenuItem value="installment">{t('addDrawer.section1.installment')}</MenuItem>
                        <MenuItem value="oneTime">{t('addDrawer.section1.oneTime')}</MenuItem>
                        <MenuItem value="deferred">{t('addDrawer.section1.deferred')}</MenuItem>
                        <MenuItem value="custom">{t('addDrawer.section1.custom')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
                <FormControl fullWidth error={!!errors.counterpartyId}>
                  <InputLabel>{t('addDrawer.section1.counterparty')}</InputLabel>
                  <Select
                    value={formData.counterpartyId}
                    label={t('addDrawer.section1.counterparty')}
                    onChange={(e) => {
                      const selected = mockCounterparties.find((c) => c.id === e.target.value);
                      handleFormChange('counterpartyId', e.target.value);
                      handleFormChange('counterpartyName', selected?.name || '');
                    }}
                  >
                    {mockCounterparties.map((counterparty) => (
                      <MenuItem key={counterparty.id} value={counterparty.id}>
                        {counterparty.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label={t('addDrawer.section1.contractNumber')}
                      value={formData.contractNumber}
                      onChange={(e) => handleFormChange('contractNumber', e.target.value)}
                      placeholder={t('addDrawer.section1.contractNumberPlaceholder')}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      type="date"
                      label={t('addDrawer.section1.signedDate')}
                      value={formData.signedDate}
                      onChange={(e) => handleFormChange('signedDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                </Box>
              </Box>
            </SectionContainer>

            {/* Section 2: Financial Information */}
            <SectionContainer>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                {t('addDrawer.section2.title')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label={t('addDrawer.section2.principal')}
                  type="number"
                  value={formData.principal}
                  onChange={(e) => handleFormChange('principal', parseFloat(e.target.value) || 0)}
                  error={!!errors.principal}
                  helperText={errors.principal}
                  InputProps={{
                    inputProps: { min: 0 },
                    startAdornment: <Typography sx={{ mr: 1 }}>₫</Typography>,
                  }}
                />
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label={t('addDrawer.section2.interestRate')}
                      type="number"
                      value={formData.interestRate}
                      onChange={(e) => handleFormChange('interestRate', parseFloat(e.target.value) || 0)}
                      error={!!errors.interestRate}
                      helperText={errors.interestRate}
                      InputProps={{
                        inputProps: { min: 0, max: 100 },
                        endAdornment: <Typography sx={{ ml: 1 }}>%</Typography>,
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <FormControl fullWidth>
                      <InputLabel>{t('addDrawer.section2.interestType')}</InputLabel>
                      <Select
                        value={formData.interestType}
                        label={t('addDrawer.section2.interestType')}
                        onChange={(e) => handleFormChange('interestType', e.target.value)}
                      >
                        <MenuItem value="fixed">{t('addDrawer.section2.fixed')}</MenuItem>
                        <MenuItem value="variable">{t('addDrawer.section2.variable')}</MenuItem>
                        <MenuItem value="compound">{t('addDrawer.section2.compound')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label={t('addDrawer.section2.insuranceFee')}
                      type="number"
                      value={formData.insuranceFee}
                      onChange={(e) => handleFormChange('insuranceFee', parseFloat(e.target.value) || 0)}
                      InputProps={{
                        inputProps: { min: 0 },
                        startAdornment: <Typography sx={{ mr: 1 }}>₫</Typography>,
                      }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label={t('addDrawer.section2.otherFees')}
                      type="number"
                      value={formData.otherFees}
                      onChange={(e) => handleFormChange('otherFees', parseFloat(e.target.value) || 0)}
                      InputProps={{
                        inputProps: { min: 0 },
                        startAdornment: <Typography sx={{ mr: 1 }}>₫</Typography>,
                      }}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha('#1976d2', 0.05),
                    border: `1px solid ${alpha('#1976d2', 0.1)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {t('addDrawer.section2.totalToPay')}
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color="primary.main">
                        {formatCurrency(formData.totalToPay)}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {t('addDrawer.section2.paidAmount')}
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color="success.main">
                        {formatCurrency(formData.paidAmount)}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {t('addDrawer.section2.remainingAmount')}
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color="warning.main">
                        {formatCurrency(formData.remainingAmount)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </SectionContainer>

            {/* Section 3: Payment Cycle */}
            <SectionContainer>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                {t('addDrawer.section3.title')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Box sx={{ flex: 1 }}>
                    <FormControl fullWidth>
                      <InputLabel>{t('addDrawer.section3.paymentCycle')}</InputLabel>
                      <Select
                        value={formData.paymentCycle}
                        label={t('addDrawer.section3.paymentCycle')}
                        onChange={(e) => handleFormChange('paymentCycle', e.target.value)}
                      >
                        <MenuItem value="daily">{t('addDrawer.section3.daily')}</MenuItem>
                        <MenuItem value="weekly">{t('addDrawer.section3.weekly')}</MenuItem>
                        <MenuItem value="biweekly">{t('addDrawer.section3.biweekly')}</MenuItem>
                        <MenuItem value="monthly">{t('addDrawer.section3.monthly')}</MenuItem>
                        <MenuItem value="quarterly">{t('addDrawer.section3.quarterly')}</MenuItem>
                        <MenuItem value="yearly">{t('addDrawer.section3.yearly')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      label={t('addDrawer.section3.paymentCount')}
                      type="number"
                      value={formData.paymentCount}
                      onChange={(e) => handleFormChange('paymentCount', parseInt(e.target.value) || 0)}
                      placeholder={t('addDrawer.section3.paymentCountPlaceholder')}
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      type="date"
                      label={t('addDrawer.section3.startDate')}
                      value={formData.startDate}
                      onChange={(e) => handleFormChange('startDate', e.target.value)}
                      error={!!errors.startDate}
                      helperText={errors.startDate}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      type="date"
                      label={t('addDrawer.section3.endDate')}
                      value={formData.endDate}
                      onChange={(e) => handleFormChange('endDate', e.target.value)}
                      error={!!errors.endDate}
                      helperText={errors.endDate}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                </Box>
              </Box>
            </SectionContainer>

            {/* Section 4: Payment */}
            <SectionContainer>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                {t('addDrawer.section4.title')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Box sx={{ flex: 1 }}>
                    <FormControl fullWidth error={!!errors.walletId}>
                      <InputLabel>{t('addDrawer.section4.wallet')}</InputLabel>
                      <Select
                        value={formData.walletId}
                        label={t('addDrawer.section4.wallet')}
                        onChange={(e) => handleFormChange('walletId', e.target.value)}
                      >
                        {mockWallets.map((wallet) => (
                          <MenuItem key={wallet.id} value={wallet.id}>
                            {wallet.icon} {wallet.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <FormControl fullWidth>
                      <InputLabel>{t('addDrawer.section4.paymentMethod')}</InputLabel>
                      <Select
                        value={formData.paymentMethod}
                        label={t('addDrawer.section4.paymentMethod')}
                        onChange={(e) => handleFormChange('paymentMethod', e.target.value)}
                      >
                        <MenuItem value="cash">{t('drawer.paymentTimeline.methods.cash')}</MenuItem>
                        <MenuItem value="bank">{t('drawer.paymentTimeline.methods.bank')}</MenuItem>
                        <MenuItem value="transfer">{t('drawer.paymentTimeline.methods.transfer')}</MenuItem>
                        <MenuItem value="other">{t('drawer.paymentTimeline.methods.other')}</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label={t('addDrawer.section4.paymentNotes')}
                  value={formData.paymentNotes}
                  onChange={(e) => handleFormChange('paymentNotes', e.target.value)}
                  placeholder={t('addDrawer.section4.paymentNotesPlaceholder')}
                />
              </Box>
            </SectionContainer>

            {/* Section 5: Attachments */}
            <SectionContainer>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                {t('addDrawer.section5.title')}
              </Typography>
              <Box
                sx={{
                  p: 4,
                  borderRadius: 2,
                  border: `2px dashed ${alpha(theme.palette.divider, 0.5)}`,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                <Typography variant="h4" sx={{ mb: 1 }}>
                  📎
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {t('addDrawer.section5.dragDrop')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('addDrawer.section5.orClick')}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  {t('addDrawer.section5.maxFileSize')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('addDrawer.section5.supportedFormats')}
                </Typography>
              </Box>
            </SectionContainer>

            {/* Section 6: Notes */}
            <SectionContainer>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                {t('addDrawer.section6.title')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label={t('addDrawer.section6.description')}
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder={t('addDrawer.section6.descriptionPlaceholder')}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label={t('addDrawer.section6.internalNotes')}
                  value={formData.internalNotes}
                  onChange={(e) => handleFormChange('internalNotes', e.target.value)}
                  placeholder={t('addDrawer.section6.internalNotesPlaceholder')}
                />
              </Box>
            </SectionContainer>

            {/* Section 7: Payment Preview */}
            <SectionContainer>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                {t('addDrawer.section7.title')}
              </Typography>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: alpha('#1976d2', 0.05),
                  border: `1px solid ${alpha('#1976d2', 0.1)}`,
                }}
              >
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {t('addDrawer.section7.totalToPay')}
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="primary.main">
                      {formatCurrency(formData.totalToPay)}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      {t('addDrawer.section7.paymentCount')}
                    </Typography>
                    <Typography variant="h5" fontWeight={700} color="primary.main">
                      {formData.paymentCount || 1}
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('addDrawer.section7.estimatedMonthly')}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="success.main">
                    {formatCurrency(estimatedMonthlyPayment)}
                  </Typography>
                </Box>
              </Box>
            </SectionContainer>
          </ScrollContainer>
        </ContentContainer>

        {/* Action Bar */}
        <ActionContainer>
          {onSaveDraft && (
            <Button
              variant="outlined"
              onClick={handleSaveDraft}
              sx={{ flex: 1, minWidth: 120 }}
            >
              {t('addDrawer.saveDraft')}
            </Button>
          )}
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ flex: 1, minWidth: 120 }}
          >
            {t('addDrawer.cancel')}
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ flex: 1, minWidth: 120 }}
          >
            {t('addDrawer.create')}
          </Button>
        </ActionContainer>
      </Box>
    </StyledDrawer>
  );
}
