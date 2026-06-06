import { Card, Box, Typography, IconButton, Stack, alpha } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { Wallet } from 'src/types/config-transaction';

interface Props {
  wallet: Wallet;
  onEdit: (wallet: Wallet) => void;
  onDelete: (id: number) => void;
}

const WALLET_STYLES: Record<string, { icon: string; color: string }> = {
  BANK: { icon: 'mdi:bank', color: '#1A73E8' },
  E_WALLET: { icon: 'mdi:wallet-giftcard', color: '#E91E63' },
  CASH: { icon: 'mdi:cash-multiple', color: '#4CAF50' },
  INVESTMENT: { icon: 'mdi:chart-line', color: '#FF9800' },
  CRYPTO: { icon: 'mdi:bitcoin', color: '#F7931A' },
};

export function WalletCard({ wallet, onEdit, onDelete }: Props) {
  const style = WALLET_STYLES[wallet.type] || WALLET_STYLES.CASH;

  return (
    <Card sx={{ 
      p: 3, borderRadius: 3, position: 'relative', height: 160,
      background: `linear-gradient(135deg, ${alpha(style.color, 0.9)} 0%, ${style.color} 100%)`,
      color: 'common.white', overflow: 'hidden',
      boxShadow: (theme) => `0 8px 16px ${alpha(style.color, 0.24)}`,
      '&:hover .actions': { opacity: 1 }
    }}>
      <Box sx={{ position: 'absolute', top: -10, right: -10, opacity: 0.1 }}>
        <Iconify icon={style.icon as any} width={120} />
      </Box>

      <Stack sx={{ height: 1, justifyContent: 'space-between', position: 'relative' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Iconify icon={style.icon as any} width={32} />
          <Stack direction="row" className="actions" sx={{ opacity: 0, transition: '0.3s' }}>
            <IconButton onClick={() => onEdit(wallet)} sx={{ color: 'white' }} size="small">
              <Iconify icon="solar:pen-bold" width={18} />
            </IconButton>
            <IconButton onClick={() => onDelete(wallet.id)} sx={{ color: alpha('#fff', 0.8) }} size="small">
              <Iconify icon="solar:trash-bin-trash-bold" width={18} />
            </IconButton>
          </Stack>
        </Stack>

        <Box>
          <Typography variant="h6" fontWeight="bold">{wallet.name}</Typography>
          <Typography variant="overline" sx={{ opacity: 0.8 }}>{wallet.code}</Typography>
        </Box>
      </Stack>
    </Card>
  );
}