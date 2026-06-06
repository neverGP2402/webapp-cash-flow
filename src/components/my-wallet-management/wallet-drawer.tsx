import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  alpha,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import type { Wallet, WalletType, WalletFormData } from 'src/types/wallet';

interface WalletDrawerProps {
  open: boolean;
  mode: 'create' | 'edit';
  wallet?: Wallet | null;
  onClose: () => void;
  onSave: (data: WalletFormData) => Promise<void>;
}

export function WalletDrawer({ open, mode, wallet, onClose, onSave }: WalletDrawerProps) {
  const { t } = useTranslation('walletManagement');
  const [formData, setFormData] = useState<WalletFormData>({
    name: '',
    code: '',
    type: 'cash',
    description: '',
    is_active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && wallet) {
      setFormData({
        name: wallet.name,
        code: wallet.code,
        type: wallet.type,
        description: '',
        is_active: !wallet.is_deleted,
      });
    } else {
      setFormData({
        name: '',
        code: '',
        type: 'cash',
        description: '',
        is_active: true,
      });
    }
    setErrors({});
  }, [mode, wallet, open]);

  const getTypeConfig = (type: WalletType) => {
    const configs = {
      bank: {
        icon: 'solar:banknote-bold',
        color: '#3b82f6',
        gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        label: t('types.bank'),
      },
      ewallet: {
        icon: 'solar:wallet-bold',
        color: '#8b5cf6',
        gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
        label: t('types.ewallet'),
      },
      cash: {
        icon: 'solar:cash-bold',
        color: '#10b981',
        gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        label: t('types.cash'),
      },
      investment: {
        icon: 'solar:graph-up-bold',
        color: '#f59e0b',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        label: t('types.investment'),
      },
      crypto: {
        icon: 'solar:bitcoin-bold',
        color: '#ec4899',
        gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
        label: t('types.crypto'),
      },
    };
    return configs[type] || configs.cash;
  };

  const typeConfig = getTypeConfig(formData.type);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = t('validation.nameRequired');
    }
    if (!formData.code.trim()) {
      newErrors.code = t('validation.codeRequired');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof WalletFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Save wallet error:', error);
    } finally {
      setSaving(false);
    }
  };

  const generateCode = (name: string) => {
    const prefix = formData.type.substring(0, 3).toUpperCase();
    const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${sanitizedName || 'NEW'}-${random}`;
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', md: '45%' },
          maxWidth: 600,
          borderRadius: { xs: 0, md: '24px 0 0 24px' },
        },
      }}
    >
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
              {mode === 'create' ? t('drawer.createTitle') : t('drawer.editTitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {mode === 'create' ? t('drawer.createSubtitle') : t('drawer.editSubtitle')}
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ width: 36, height: 36 }}>
            <Iconify icon="mingcute:close-line" width={20} />
          </IconButton>
        </Box>

        {/* Live Preview Card */}
        <Card
          sx={{
            mb: 3,
            borderRadius: 4,
            border: `1px solid ${alpha(typeConfig.color, 0.2)}`,
            background: `linear-gradient(135deg, ${alpha(typeConfig.color, 0.08)} 0%, ${alpha(typeConfig.color, 0.02)} 100%)`,
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  background: typeConfig.gradient,
                  boxShadow: `0px 6px 12px ${alpha(typeConfig.color, 0.3)}`,
                }}
              >
                <Iconify icon={typeConfig.icon as any} width={24} sx={{ color: 'white' }} />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  {formData.name || t('drawer.preview.walletName')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formData.code || t('drawer.preview.walletCode')}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={typeConfig.label}
                size="small"
                sx={{
                  height: 22,
                  fontSize: 11,
                  fontWeight: 600,
                  bgcolor: alpha(typeConfig.color, 0.15),
                  color: typeConfig.color,
                }}
              />
              {formData.is_active ? (
                <Chip
                  label={t('status.active')}
                  size="small"
                  color="success"
                  sx={{ height: 22, fontSize: 11, fontWeight: 600 }}
                />
              ) : (
                <Chip
                  label={t('status.inactive')}
                  size="small"
                  color="default"
                  sx={{ height: 22, fontSize: 11, fontWeight: 600 }}
                />
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Form Fields */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            fullWidth
            label={t('form.name')}
            value={formData.name}
            onChange={(e) => {
              handleChange('name', e.target.value);
              if (!formData.code || formData.code.startsWith('BANK-NEW') || formData.code.startsWith('EWAL-NEW') || formData.code.startsWith('CAS-NEW') || formData.code.startsWith('INV-NEW') || formData.code.startsWith('CRY-NEW')) {
                setFormData((prev) => ({ ...prev, code: generateCode(e.target.value) }));
              }
            }}
            error={!!errors.name}
            helperText={errors.name}
            variant="outlined"
            required
          />

          <TextField
            fullWidth
            label={t('form.code')}
            value={formData.code}
            onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
            error={!!errors.code}
            helperText={errors.code}
            variant="outlined"
            required
            inputProps={{ style: { textTransform: 'uppercase' } }}
          />

          <FormControl fullWidth error={!!errors.type}>
            <InputLabel>{t('form.type')}</InputLabel>
            <Select
              value={formData.type}
              label={t('form.type')}
              onChange={(e) => handleChange('type', e.target.value as WalletType)}
            >
              <MenuItem value="bank">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify icon="solar:banknote-bold" width={18} color="#3b82f6" />
                  {t('types.bank')}
                </Box>
              </MenuItem>
              <MenuItem value="ewallet">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify icon="solar:wallet-bold" width={18} color="#8b5cf6" />
                  {t('types.ewallet')}
                </Box>
              </MenuItem>
              <MenuItem value="cash">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify icon="solar:cash-bold" width={18} color="#10b981" />
                  {t('types.cash')}
                </Box>
              </MenuItem>
              <MenuItem value="investment">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify icon="solar:graph-up-bold" width={18} color="#f59e0b" />
                  {t('types.investment')}
                </Box>
              </MenuItem>
              <MenuItem value="crypto">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Iconify icon="solar:bitcoin-bold" width={18} color="#ec4899" />
                  {t('types.crypto')}
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label={t('form.description')}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            multiline
            rows={3}
            variant="outlined"
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.is_active}
                onChange={(e) => handleChange('is_active', e.target.checked)}
                color="success"
              />
            }
            label={
              <Typography variant="body2" fontWeight={500}>
                {formData.is_active ? t('form.active') : t('form.inactive')}
              </Typography>
            }
          />
        </Box>

        {/* Footer Actions */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={onClose}
            sx={{
              borderRadius: 2,
              py: 1.5,
              fontWeight: 600,
            }}
          >
            {t('actions.cancel')}
          </Button>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
            loading={saving}
            sx={{
              borderRadius: 2,
              py: 1.5,
              fontWeight: 600,
              background: `linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, #2563eb 0%, #1e40af 100%)`,
              },
            }}
          >
            {mode === 'create' ? t('actions.create') : t('actions.save')}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}