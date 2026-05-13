import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  alpha,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { Iconify } from 'src/components/iconify';

import {
  AssetType,
  Wallet,
  Unit,
  ExchangeRate,
  AssetOrigin,
  AssetStatus,
  AssetOverview,
  QuickInsight,
  AddAssetFormData
} from 'src/types/add-asset';

import AssetTypeSelect from './asset-type-select';
import WalletSelector from './wallet-selector';
import AmountInput from './amount-input';
import PriceInput from './price-input';
import ExchangeRateCard from './exchange-rate-card';
import ProfitDisplay from './profit-display';
import StatusChips from './status-chips';
import RealtimeOverview from './realtime-overview';
import QuickInsightCard from './quick-insight-card';

// Mock data - In production, this would come from API
const mockAssetTypes: AssetType[] = [
  { asset_id: '1', asset_name: 'Vàng 9999', asset_code: 'gold', icon: '🥇' },
  { asset_id: '2', asset_name: 'Bạc', asset_code: 'silver', icon: '🥈' },
  { asset_id: '3', asset_name: 'USD', asset_code: 'usd', icon: '💵' },
  { asset_id: '4', asset_name: 'Bitcoin', asset_code: 'btc', icon: '₿' },
  { asset_id: '5', asset_name: 'Ethereum', asset_code: 'eth', icon: 'Ξ' },
  { asset_id: '6', asset_name: 'Tiền mặt VND', asset_code: 'cash', icon: '💰' },
  { asset_id: '7', asset_name: 'Ví MoMo', asset_code: 'eWallet', icon: '📱' },
  { asset_id: '8', asset_name: 'Tài sản số', asset_code: 'digitalAsset', icon: '💎' },
  { asset_id: '9', asset_name: 'Tài sản khác', asset_code: 'other', icon: '📦' }
];

const mockWallets: Wallet[] = [
  { wallet_id: '1', wallet_name: 'Ví tiền mặt', wallet_type: 'cash', icon: '💰' },
  { wallet_id: '2', wallet_name: 'Vietcombank', wallet_type: 'bank', bank_name: 'VCB', icon: '🏦' },
  { wallet_id: '3', wallet_name: 'Techcombank', wallet_type: 'bank', bank_name: 'TCB', icon: '🏦' },
  { wallet_id: '4', wallet_name: 'Ví MoMo', wallet_type: 'eWallet', icon: '📱' },
  { wallet_id: '5', wallet_name: 'Ví Crypto', wallet_type: 'crypto', icon: '🔐' }
];

const mockUnits: Unit[] = [
  { unit_id: '1', unit_name: 'Chỉ', unit_code: 'chi', symbol: 'chỉ' },
  { unit_id: '2', unit_name: 'Gram', unit_code: 'g', symbol: 'g' },
  { unit_id: '3', unit_name: 'USD', unit_code: 'usd', symbol: '$' },
  { unit_id: '4', unit_name: 'BTC', unit_code: 'btc', symbol: '₿' },
  { unit_id: '5', unit_name: 'ETH', unit_code: 'eth', symbol: 'Ξ' },
  { unit_id: '6', unit_name: 'VND', unit_code: 'vnd', symbol: '₫' },
  { unit_id: '7', unit_name: 'Cái', unit_code: 'pc', symbol: 'cái' }
];

const mockOrigins: AssetOrigin[] = [
  { id: 'purchase', name: 'Mua tích lũy', name_en: 'Purchase/Savings' },
  { id: 'investment', name: 'Đầu tư', name_en: 'Investment' },
  { id: 'gift', name: 'Được tặng', name_en: 'Gift' },
  { id: 'savings', name: 'Tiết kiệm', name_en: 'Savings' }
];

const mockStatuses: AssetStatus[] = [
  { id: 'holding', name: 'Đang giữ', name_en: 'Holding', color: 'success' },
  { id: 'lending', name: 'Cho vay', name_en: 'Lending', color: 'warning' },
  { id: 'pledged', name: 'Cầm cố', name_en: 'Pledged', color: 'error' },
  { id: 'investing', name: 'Đầu tư', name_en: 'Investing', color: 'info' }
];

export default function AddAssetPage() {
  const { t, i18n } = useTranslation('add-asset');
  const isVietnamese = i18n.language === 'vi';

  // Form state
  const [formData, setFormData] = useState<AddAssetFormData>({
    asset_id: '',
    wallet_id: '',
    amount: 0,
    price: 0,
    origin: '',
    status: 'holding',
    description: '',
    unit_id: '',
    transaction_date: new Date().toISOString().split('T')[0]
  });

  // Selected items
  const [selectedAsset, setSelectedAsset] = useState<AssetType | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  // Exchange rate
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [loadingExchangeRate, setLoadingExchangeRate] = useState(false);

  // Overview
  const [overview, setOverview] = useState<AssetOverview>({
    currentValue: 0,
    purchaseValue: 0,
    profit: 0,
    profitPercent: 0,
    trend: 'neutral'
  });

  // Insight
  const [insight, setInsight] = useState<QuickInsight | null>(null);

  // UI state
  const [loading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof AddAssetFormData, string>>>({});
  const [snackbar, setSnackbar] = useState({ open: false, type: 'success' as 'success' | 'error', message: '' });
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  // Calculate overview when form data changes
  useEffect(() => {
    if (selectedAsset && formData.amount > 0 && formData.price > 0 && exchangeRate) {
      const purchaseValue = formData.amount * formData.price;
      const currentPrice = (exchangeRate.buy_price + exchangeRate.sell_price) / 2;
      const currentValue = formData.amount * currentPrice;
      const profit = currentValue - purchaseValue;
      const profitPercent = purchaseValue > 0 ? (profit / purchaseValue) * 100 : 0;

      setOverview({
        currentValue,
        purchaseValue,
        profit,
        profitPercent,
        trend: profit > 0 ? 'up' : profit < 0 ? 'down' : 'neutral'
      });

      // Generate insight
      if (Math.abs(profitPercent) > 5) {
        setInsight({
          type: profit > 0 ? 'positive' : 'negative',
          message: profit > 0
            ? t('insight.positive', { percent: profitPercent.toFixed(1) })
            : t('insight.negative', { percent: Math.abs(profitPercent).toFixed(1) }),
          message_en: profit > 0
            ? `Asset is up ${profitPercent.toFixed(1)}%`
            : `Asset is down ${Math.abs(profitPercent).toFixed(1)}%`
        });
      } else if (profit > 0) {
        setInsight({
          type: 'positive',
          message: t('insight.higherThanPurchase'),
          message_en: 'Current value is higher than purchase'
        });
      } else if (profit < 0) {
        setInsight({
          type: 'negative',
          message: t('insight.lowerThanPurchase'),
          message_en: 'Current value is lower than purchase'
        });
      } else {
        setInsight({
          type: 'neutral',
          message: t('insight.neutral'),
          message_en: 'Value is stable'
        });
      }
    } else {
      setOverview({
        currentValue: 0,
        purchaseValue: 0,
        profit: 0,
        profitPercent: 0,
        trend: 'neutral'
      });
      setInsight(null);
    }
  }, [formData.amount, formData.price, exchangeRate, selectedAsset, t]);

  // Fetch exchange rate when asset changes
  useEffect(() => {
    if (selectedAsset) {
      setLoadingExchangeRate(true);
      // Simulate API call
      setTimeout(() => {
        const mockRate: ExchangeRate = {
          rate_id: '1',
          asset_id: selectedAsset.asset_id,
          buy_price: selectedAsset.asset_code === 'btc' ? 1500000000 : 2500000,
          sell_price: selectedAsset.asset_code === 'btc' ? 1510000000 : 2550000,
          updated_at: new Date().toISOString(),
          source: 'Market Data'
        };
        setExchangeRate(mockRate);
        setLoadingExchangeRate(false);
      }, 800);
    } else {
      setExchangeRate(null);
    }
  }, [selectedAsset]);

  // Get current asset status
  const currentAssetStatus = useMemo(() => {
    return mockStatuses.find(s => s.id === formData.status) || null;
  }, [formData.status]);

  // Handle form changes
  const handleFieldChange = useCallback(<K extends keyof AddAssetFormData>(
    field: K,
    value: AddAssetFormData[K]
  ) => {
    setFormData((prev: AddAssetFormData) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof AddAssetFormData, string>> = {};

    if (!formData.asset_id) {
      newErrors.asset_id = t('validation.assetTypeRequired');
    }
    if (!formData.wallet_id) {
      newErrors.wallet_id = t('validation.walletRequired');
    }
    if (formData.amount <= 0) {
      newErrors.amount = t('validation.amountPositive');
    }
    if (formData.price <= 0) {
      newErrors.price = t('validation.pricePositive');
    }
    if (!formData.unit_id) {
      newErrors.unit_id = t('validation.unitRequired');
    }
    if (!formData.transaction_date) {
      newErrors.transaction_date = t('validation.dateRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, t]);

  // Submit form
  const handleSubmit = useCallback(async (saveAndAdd = false) => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSnackbar({
        open: true,
        type: 'success',
        message: t('messages.saveSuccess')
      });

      if (saveAndAdd) {
        // Reset form but keep some values
        setFormData((prev: AddAssetFormData) => ({
          ...prev,
          amount: 0,
          price: 0,
          description: '',
          transaction_date: new Date().toISOString().split('T')[0]
        }));
        setSelectedAsset(null);
        setSelectedWallet(null);
        setSelectedUnit(null);
        setExchangeRate(null);
      } else {
        // Reset entire form
        setFormData({
          asset_id: '',
          wallet_id: '',
          amount: 0,
          price: 0,
          origin: '',
          status: 'holding',
          description: '',
          unit_id: '',
          transaction_date: new Date().toISOString().split('T')[0]
        });
        setSelectedAsset(null);
        setSelectedWallet(null);
        setSelectedUnit(null);
        setExchangeRate(null);
      }
    } catch {
      setSnackbar({
        open: true,
        type: 'error',
        message: t('messages.saveFailed')
      });
    } finally {
      setSubmitting(false);
    }
  }, [validateForm, t]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    const hasData = formData.asset_id || formData.wallet_id || formData.amount > 0 || formData.price > 0;
    if (hasData) {
      setConfirmCancelOpen(true);
    } else {
      // Just go back or reset
      setFormData({
        asset_id: '',
        wallet_id: '',
        amount: 0,
        price: 0,
        origin: '',
        status: 'holding',
        description: '',
        unit_id: '',
        transaction_date: new Date().toISOString().split('T')[0]
      });
      setSelectedAsset(null);
      setSelectedWallet(null);
      setSelectedUnit(null);
    }
  }, [formData]);

  const confirmCancel = useCallback(() => {
    setConfirmCancelOpen(false);
    setFormData({
      asset_id: '',
      wallet_id: '',
      amount: 0,
      price: 0,
      origin: '',
      status: 'holding',
      description: '',
      unit_id: '',
      transaction_date: new Date().toISOString().split('T')[0]
    });
    setSelectedAsset(null);
    setSelectedWallet(null);
    setSelectedUnit(null);
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  bgcolor: alpha('#1976d2', 0.08),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Iconify icon="solar:coin-bold" width={28} color="#1976d2" />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={800} gutterBottom>
                  {t('page.title')}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {t('page.subtitle')}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Mini Summary Card */}
          <Paper
            sx={{
              p: 2,
              borderRadius: 3,
              minWidth: 200,
              bgcolor: alpha('#1976d2', 0.03),
              border: `1px solid ${alpha('#1976d2', 0.1)}`
            }}
          >
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              {t('page.miniSummary')}
            </Typography>
            <Typography variant="h6" fontWeight={700} color="primary.main">
              {overview.currentValue > 0
                ? new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                    minimumFractionDigits: 0
                  }).format(overview.currentValue)
                : '—'}
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Left Column - Form */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)'
            }}
          >
            <Grid container spacing={3}>
              {/* Asset Type */}
              <Grid size={{ xs: 12, md: 6 }}>
                <AssetTypeSelect
                  value={selectedAsset}
                  onChange={(asset) => {
                    setSelectedAsset(asset);
                    handleFieldChange('asset_id', asset?.asset_id || '');
                  }}
                  options={mockAssetTypes}
                  error={!!errors.asset_id}
                  helperText={errors.asset_id}
                />
              </Grid>

              {/* Wallet */}
              <Grid size={{ xs: 12, md: 6 }}>
                <WalletSelector
                  value={selectedWallet}
                  onChange={(wallet) => {
                    setSelectedWallet(wallet);
                    handleFieldChange('wallet_id', wallet?.wallet_id || '');
                  }}
                  options={mockWallets}
                  error={!!errors.wallet_id}
                  helperText={errors.wallet_id}
                />
              </Grid>

              {/* Amount & Unit */}
              <Grid size={{ xs: 12, md: 6 }}>
                <AmountInput
                  value={formData.amount}
                  onChange={(value) => handleFieldChange('amount', value)}
                  unit={selectedUnit || undefined}
                  error={!!errors.amount}
                  helperText={errors.amount}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  select
                  fullWidth
                  value={formData.unit_id}
                  onChange={(e) => {
                    const unit = mockUnits.find(u => u.unit_id === e.target.value);
                    setSelectedUnit(unit || null);
                    handleFieldChange('unit_id', e.target.value);
                  }}
                  label={t('form.unit.label')}
                  error={!!errors.unit_id}
                  helperText={errors.unit_id}
                  SelectProps={{
                    native: true
                  }}
                  inputProps={{}}
                >
                  <option value="">{t('form.unit.label')}</option>
                  {mockUnits.map((unit) => (
                    <option key={unit.unit_id} value={unit.unit_id}>
                      {unit.unit_name} ({unit.symbol})
                    </option>
                  ))}
                </TextField>
              </Grid>

              {/* Price */}
              <Grid size={{ xs: 12, md: 3 }}>
                <PriceInput
                  value={formData.price}
                  onChange={(value) => handleFieldChange('price', value)}
                  error={!!errors.price}
                  helperText={errors.price}
                />
              </Grid>

              {/* Exchange Rate Card */}
              <Grid size={{ xs: 12 }}>
                <ExchangeRateCard
                  exchangeRate={exchangeRate}
                  loading={loadingExchangeRate}
                />
              </Grid>

              {/* Profit Display */}
              <Grid size={{ xs: 12 }}>
                <ProfitDisplay overview={overview} loading={loading} />
              </Grid>

              {/* Origin */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  fullWidth
                  value={formData.origin}
                  onChange={(e) => handleFieldChange('origin', e.target.value)}
                  label={t('form.origin.label')}
                  placeholder={t('form.origin.placeholder')}
                  SelectProps={{
                    native: true
                  }}
                >
                  <option value="">{t('form.origin.placeholder')}</option>
                  {mockOrigins.map((origin) => (
                    <option key={origin.id} value={origin.id}>
                      {isVietnamese ? origin.name : origin.name_en}
                    </option>
                  ))}
                </TextField>
              </Grid>

              {/* Status */}
              <Grid size={{ xs: 12, md: 6 }}>
                <StatusChips
                  options={mockStatuses}
                  value={formData.status}
                  onChange={(statusId) => handleFieldChange('status', statusId)}
                />
              </Grid>

              {/* Transaction Date */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label={t('form.transactionDate.label')}
                  type="date"
                  value={formData.transaction_date}
                  onChange={(e) => handleFieldChange('transaction_date', e.target.value)}
                  error={!!errors.transaction_date}
                  helperText={errors.transaction_date}
                  InputLabelProps={{
                    shrink: true
                  }}
                  fullWidth
                />
              </Grid>

              {/* Description */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  label={t('form.description.label')}
                  placeholder={t('form.description.placeholder')}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderWidth: 2
                      },
                      '&:hover fieldset': {
                        borderWidth: 2
                      },
                      '&.Mui-focused fieldset': {
                        borderWidth: 2
                      }
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right Column - Overview */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, position: { lg: 'sticky' as 'sticky' }, top: 24 }}>
            <RealtimeOverview
              overview={overview}
              assetStatus={currentAssetStatus}
              loading={loading}
            />

            <QuickInsightCard insight={insight} loading={loading} />

            {/* Action Buttons - Desktop */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)'
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={submitting ? <CircularProgress size={20} /> : <Iconify icon="eva:checkmark-fill" width={20} />}
                  onClick={() => handleSubmit(false)}
                  disabled={submitting}
                  sx={{
                    py: 1.8,
                    fontSize: 16,
                    fontWeight: 700,
                    borderRadius: 2,
                    boxShadow: '0px 8px 24px rgba(25, 118, 210, 0.3)'
                  }}
                >
                  {t('actions.save')}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<Iconify icon="mingcute:add-line" width={20} />}
                  onClick={() => handleSubmit(true)}
                  disabled={submitting}
                  sx={{
                    py: 1.8,
                    fontSize: 15,
                    fontWeight: 600,
                    borderRadius: 2
                  }}
                >
                  {t('actions.saveAndAdd')}
                </Button>

                <Button
                  fullWidth
                  variant="text"
                  size="large"
                  startIcon={<Iconify icon="mingcute:close-line" width={20} />}
                  onClick={handleCancel}
                  disabled={submitting}
                  sx={{
                    py: 1.5,
                    fontSize: 15,
                    fontWeight: 600,
                    color: 'text.secondary'
                  }}
                >
                  {t('actions.cancel')}
                </Button>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Mobile Sticky Actions */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          bgcolor: 'background.paper',
          borderTop: `1px solid ${alpha('#000', 0.06)}`,
          display: { xs: 'block', md: 'none' },
          zIndex: 1000
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={submitting ? <CircularProgress size={20} /> : <Iconify icon="eva:checkmark-fill" width={20} />}
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            sx={{ py: 1.5, fontWeight: 700, borderRadius: 2 }}
          >
            {t('actions.save')}
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => handleSubmit(true)}
            disabled={submitting}
            sx={{ py: 1.5, minWidth: 80, borderRadius: 2 }}
          >
            <Iconify icon="mingcute:add-line" width={20} />
          </Button>
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.type}
          sx={{ width: '100%', borderRadius: 2 }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Confirm Cancel Dialog */}
      <Dialog
        open={confirmCancelOpen}
        onClose={() => setConfirmCancelOpen(false)}
        PaperProps={{
          sx: { borderRadius: 3, p: 2 }
        }}
      >
        <DialogTitle>{t('actions.cancel')}</DialogTitle>
        <DialogContent>
          <Typography>{t('messages.confirmCancel')}</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setConfirmCancelOpen(false)}
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            {t('actions.cancel')}
          </Button>
          <Button
            onClick={confirmCancel}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2 }}
          >
            {t('actions.cancel')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bottom padding for mobile sticky actions */}
      <Box sx={{ height: { xs: 80, md: 0 } }} />
    </Container>
  );
}