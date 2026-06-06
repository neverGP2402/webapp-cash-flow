import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogActions,
  Button,
  Box,
  Typography,
  alpha,
  Avatar,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import type { Wallet } from 'src/types/wallet';

interface DeleteWalletModalProps {
  open: boolean;
  wallet: Wallet | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteWalletModal({ open, wallet, onClose, onConfirm }: DeleteWalletModalProps) {
  const { t } = useTranslation('walletManagement');
  const [deleting, setDeleting] = useState(false);

  const getTypeConfig = (type: Wallet['type']) => {
    const configs = {
      bank: { icon: 'solar:banknote-bold', color: '#3b82f6' },
      ewallet: { icon: 'solar:wallet-bold', color: '#8b5cf6' },
      cash: { icon: 'solar:cash-bold', color: '#10b981' },
      investment: { icon: 'solar:graph-up-bold', color: '#f59e0b' },
      crypto: { icon: 'solar:bitcoin-bold', color: '#ec4899' },
    };
    return configs[type] || configs.cash;
  };

  const handleConfirm = async () => {
    setDeleting(true);
    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  };

  if (!wallet) return null;

  const typeConfig = getTypeConfig(wallet.type);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 2,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5, p: 2 }}>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            bgcolor: alpha('#ef4444', 0.1),
            flexShrink: 0,
          }}
        >
          <Iconify icon="solar:shield-warning-bold" width={28} sx={{ color: '#ef4444' }} />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
            {t('deleteModal.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {t('deleteModal.description')}
          </Typography>

          {/* Wallet Info */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(typeConfig.color, 0.05),
              border: `1px solid ${alpha(typeConfig.color, 0.1)}`,
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  background: `linear-gradient(135deg, ${typeConfig.color} 0%, ${alpha(typeConfig.color, 0.7)} 100%)`,
                }}
              >
                <Iconify icon={typeConfig.icon as any} width={20} sx={{ color: 'white' }} />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" fontWeight={600}>
                  {wallet.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {wallet.code}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Warning Note */}
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: alpha('#f59e0b', 0.08),
              border: `1px solid ${alpha('#f59e0b', 0.2)}`,
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              {t('deleteModal.warning')}
            </Typography>
          </Box>
        </Box>
      </Box>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={deleting}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontWeight: 600,
          }}
        >
          {t('actions.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          loading={deleting}
          color="error"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontWeight: 600,
          }}
        >
          {t('actions.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}