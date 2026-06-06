import { useTranslation } from 'react-i18next';
import { Card, CardContent, Box, Typography, alpha, Chip, Avatar, IconButton, Fade } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import type { Wallet } from 'src/types/wallet';

interface WalletCardProps {
  wallet: Wallet;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function WalletCard({ wallet, onClick, onEdit, onDelete }: WalletCardProps) {
  const { t } = useTranslation('walletManagement');

  const getTypeConfig = (type: Wallet['type']) => {
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

  const typeConfig = getTypeConfig(wallet.type);
  const isActive = !wallet.is_deleted;

  return (
    <Card
      onClick={onClick}
      sx={{
        borderRadius: 4,
        border: `1px solid ${alpha(typeConfig.color, 0.2)}`,
        background: `linear-gradient(135deg, ${alpha(typeConfig.color, 0.05)} 0%, ${alpha(typeConfig.color, 0.02)} 100%)`,
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0px 20px 40px ${alpha(typeConfig.color, 0.15)}`,
          '& .wallet-actions': {
            opacity: 1,
          },
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header with icon and type badge */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                background: typeConfig.gradient,
                boxShadow: `0px 8px 16px ${alpha(typeConfig.color, 0.3)}`,
              }}
            >
              <Iconify icon={typeConfig.icon as any} width={28} sx={{ color: 'white' }} />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 0.25, color: 'text.primary' }}>
                {wallet.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                {wallet.code}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={isActive ? t('status.active') : t('status.inactive')}
            color={isActive ? 'success' : 'default'}
            size="small"
            sx={{
              height: 24,
              fontWeight: 600,
              fontSize: 11,
              borderRadius: 2,
            }}
          />
        </Box>

        {/* Type badge */}
        <Box sx={{ mb: 2 }}>
          <Chip
            label={typeConfig.label}
            size="small"
            sx={{
              height: 22,
              fontSize: 11,
              fontWeight: 600,
              bgcolor: alpha(typeConfig.color, 0.1),
              color: typeConfig.color,
              borderRadius: 1,
            }}
          />
        </Box>

        {/* Actions - shown on hover */}
        <Box
          className="wallet-actions"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            gap: 0.5,
            opacity: 0,
            transition: 'opacity 0.2s ease',
          }}
        >
          <Fade in={true}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'background.paper',
                boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
                '&:hover': {
                  bgcolor: alpha('#3b82f6', 0.1),
                  '& .icon': { color: '#3b82f6' },
                },
              }}
            >
              <Iconify icon="solar:pen-bold" width={16} className="icon" sx={{ color: 'text.secondary' }} />
            </IconButton>
          </Fade>
          <Fade in={true}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'background.paper',
                boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
                '&:hover': {
                  bgcolor: alpha('#ef4444', 0.1),
                  '& .icon': { color: '#ef4444' },
                },
              }}
            >
              <Iconify icon="solar:trash-bin-trash-bold" width={16} className="icon" sx={{ color: 'text.secondary' }} />
            </IconButton>
          </Fade>
        </Box>

        {/* Footer with dates */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            {t('card.updated')}: {new Date(wallet.updated_at).toLocaleDateString('vi-VN')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}