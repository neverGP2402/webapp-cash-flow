import { useTranslation } from 'react-i18next';

import { Box, Typography, Card, CardContent, styled } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { Wallet } from 'src/types/transaction-drawer';

// ----------------------------------------------------------------------

interface WalletSelectorProps {
  wallets: Wallet[];
  selectedWallet: string;
  onSelectWallet: (walletId: string) => void;
}

const WalletCard = styled(Card)<{ selected: boolean }>(({ theme, selected }) => ({
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  border: selected ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
  backgroundColor: selected ? theme.palette.primary.main : theme.palette.background.paper,
  color: selected ? theme.palette.primary.contrastText : theme.palette.text.primary,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
}));

const WalletIcon = styled(Box)<{ color: string }>(({ theme, color }) => ({
  width: 32,
  height: 32,
  borderRadius: '50%',
  backgroundColor: color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(1),
}));

const BalanceText = styled(Typography)<{ selected: boolean }>(({ theme, selected }) => ({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: selected ? 'text.primary' : 'text.secondary',
}));

// Mock wallets data
const mockWallets: Wallet[] = [
  {
    id: 'cash',
    name: 'Tiền mặt',
    type: 'cash',
    balance: 2500000,
    currency: 'VND',
    icon: 'solar:wallet-money-bold',
    color: '#4ECDC4',
  },
  {
    id: 'bank',
    name: 'MB Bank',
    type: 'bank',
    balance: 15000000,
    currency: 'VND',
    icon: 'solar:wallet-money-bold',
    color: '#1976D2',
  },
  {
    id: 'credit',
    name: 'Credit Card',
    type: 'credit',
    balance: 5000000,
    currency: 'VND',
    icon: 'solar:wallet-money-bold',
    color: '#FF6B6B',
  },
  {
    id: 'ewallet',
    name: 'Momo',
    type: 'ewallet',
    balance: 850000,
    currency: 'VND',
    icon: 'solar:wallet-money-bold',
    color: '#FFD93D',
  },
];

// ----------------------------------------------------------------------

export function WalletSelector({ wallets, selectedWallet, onSelectWallet }: WalletSelectorProps) {
  const { t } = useTranslation('common');

  const formatBalance = (balance: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(balance);
  };

  const handleWalletSelect = (walletId: string) => {
    onSelectWallet(walletId);
  };

  const displayWallets = wallets.length > 0 ? wallets : mockWallets;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
        {t('transactionHistory.filterByWallet')}
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2 }}>
        {displayWallets.map((wallet) => (
          <WalletCard
            key={wallet.id}
            selected={selectedWallet === wallet.id}
            onClick={() => handleWalletSelect(wallet.id)}
          >
            <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <WalletIcon color={wallet.color}>
                <Iconify icon="solar:cart-3-bold" width={16} />
              </WalletIcon>
              
              <Box flex={1}>
                <Typography variant="body2" fontWeight={600}>
                  {wallet.name}
                </Typography>
                <BalanceText selected={selectedWallet === wallet.id}>
                  {formatBalance(wallet.balance)}
                </BalanceText>
              </Box>
            </CardContent>
          </WalletCard>
        ))}
      </Box>
    </Box>
  );
}
