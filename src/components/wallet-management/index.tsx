import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Container,
  useTheme,
  alpha,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Skeleton,
  Fab,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { OverviewCards } from './overview-cards';
import { WalletCard } from './wallet-card';
import { WalletDrawer } from './wallet-drawer';
import { DeleteWalletModal } from './delete-wallet-modal';
import { walletService } from 'src/services/wallet-service';
import type { Wallet, WalletFormData, WalletFilterOptions, WalletOverview, WalletTransaction } from 'src/types/wallet';

export default function WalletManagementPage() {
  const { t } = useTranslation('walletManagement');
  const theme = useTheme();

  // State
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<WalletOverview | null>(null);
  const [recentTransactions] = useState<WalletTransaction[]>([]);
  const [filters, setFilters] = useState<WalletFilterOptions>({
    search: '',
    type: 'all',
    status: 'all',
  });

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit'>('create');
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [walletToDelete, setWalletToDelete] = useState<Wallet | null>(null);

  // Fetch wallets
  const fetchWallets = async () => {
    try {
      setLoading(true);
      const data = await walletService.getWallets();
      setWallets(data);

      // Calculate overview
      const activeWallets = data.filter((w) => !w.is_deleted);
      setOverview({
        totalWallets: activeWallets.length,
        totalBalance: 0, // Will be calculated from transactions
        mostActiveWallet: activeWallets.length > 0 ? activeWallets[0].name : '-',
        totalTransactionsThisMonth: 0, // Will be calculated from transactions
      });
    } catch (error) {
      console.error('Error fetching wallets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  // Filter wallets
  const filteredWallets = useMemo(() => {
    return wallets.filter((wallet) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!wallet.name.toLowerCase().includes(searchLower) && !wallet.code.toLowerCase().includes(searchLower)) {
          return false;
        }
      }
      if (filters.type !== 'all' && wallet.type !== filters.type) {
        return false;
      }
      if (filters.status !== 'all') {
        const isActive = !wallet.is_deleted;
        if (filters.status === 'active' && !isActive) return false;
        if (filters.status === 'inactive' && isActive) return false;
      }
      return true;
    });
  }, [wallets, filters]);

  // Handlers
  const handleOpenCreateDrawer = () => {
    setDrawerMode('create');
    setSelectedWallet(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEditDrawer = (wallet: Wallet) => {
    setDrawerMode('edit');
    setSelectedWallet(wallet);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedWallet(null);
  };

  const handleSaveWallet = async (data: WalletFormData) => {
    try {
      if (drawerMode === 'create') {
        await walletService.createWallet(data);
      } else if (selectedWallet) {
        await walletService.updateWallet(selectedWallet.id, data);
      }
      fetchWallets();
    } catch (error) {
      console.error('Error saving wallet:', error);
      throw error;
    }
  };

  const handleOpenDeleteModal = (wallet: Wallet) => {
    setWalletToDelete(wallet);
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
    setWalletToDelete(null);
  };

  const handleDeleteWallet = async () => {
    if (!walletToDelete) return;
    try {
      await walletService.deleteWallet(walletToDelete.id);
      fetchWallets();
      handleDeleteModalClose();
    } catch (error) {
      console.error('Error deleting wallet:', error);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify icon="solar:wallet-bold" width={28} />
            </Box>
            <Box>
              <Typography variant="h3" fontWeight={700} sx={{ mb: 0.5 }}>
                {t('pageTitle')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('subtitle')}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<Iconify icon="mingcute:add-line" width={20} />}
            onClick={handleOpenCreateDrawer}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              background: `linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)`,
              '&:hover': {
                background: `linear-gradient(135deg, #2563eb 0%, #1e40af 100%)`,
              },
            }}
          >
            {t('actions.addWallet')}
          </Button>
        </Box>
      </Box>

      {/* Overview Cards */}
      <OverviewCards overview={overview} loading={loading} />

      {/* Filters */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 4,
          flexWrap: 'wrap',
        }}
      >
        <TextField
          placeholder={t('filters.search')}
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" width={20} color="text.secondary" />
              </InputAdornment>
            ),
          }}
          sx={{
            minWidth: { xs: '100%', sm: 280 },
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />

        <FormControl sx={{ minWidth: { xs: '100%', sm: 160 } }}>
          <InputLabel>{t('filters.type')}</InputLabel>
          <Select
            value={filters.type}
            label={t('filters.type')}
            onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value as any }))}
          >
            <MenuItem value="all">{t('filters.allTypes')}</MenuItem>
            <MenuItem value="bank">{t('types.bank')}</MenuItem>
            <MenuItem value="ewallet">{t('types.ewallet')}</MenuItem>
            <MenuItem value="cash">{t('types.cash')}</MenuItem>
            <MenuItem value="investment">{t('types.investment')}</MenuItem>
            <MenuItem value="crypto">{t('types.crypto')}</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: { xs: '100%', sm: 160 } }}>
          <InputLabel>{t('filters.status')}</InputLabel>
          <Select
            value={filters.status}
            label={t('filters.status')}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value as any }))}
          >
            <MenuItem value="all">{t('filters.allStatus')}</MenuItem>
            <MenuItem value="active">{t('status.active')}</MenuItem>
            <MenuItem value="inactive">{t('status.inactive')}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Wallet Grid */}
      {loading ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 3,
            mb: 4,
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
          ))}
        </Box>
      ) : filteredWallets.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 3,
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              mx: 'auto',
              mb: 3,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify icon="solar:wallet-bold" width={56} color={alpha(theme.palette.primary.main, 0.3)} />
          </Box>
          <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
            {t('emptyState.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
            {t('emptyState.description')}
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<Iconify icon="mingcute:add-line" width={20} />}
            onClick={handleOpenCreateDrawer}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontWeight: 600,
            }}
          >
            {t('actions.addWallet')}
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 3,
            mb: 4,
          }}
        >
          {filteredWallets.map((wallet) => (
            <WalletCard
              key={wallet.id}
              wallet={wallet}
              onClick={() => {}}
              onEdit={() => handleOpenEditDrawer(wallet)}
              onDelete={() => handleOpenDeleteModal(wallet)}
            />
          ))}
        </Box>
      )}

      {/* Recent Transactions Preview */}
      {recentTransactions.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" fontWeight={700}>
              {t('recentTransactions.title')}
            </Typography>
            <Button
              endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={20} />}
              sx={{ fontWeight: 600 }}
            >
              {t('actions.viewAll')}
            </Button>
          </Box>
          {/* Transaction list would go here */}
        </Box>
      )}

      {/* Floating Action Button for Mobile */}
      <Fab
        color="primary"
        onClick={handleOpenCreateDrawer}
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 3,
          boxShadow: '0px 8px 24px rgba(59, 130, 246, 0.4)',
        }}
      >
        <Iconify icon="mingcute:add-line" width={24} />
      </Fab>

      {/* Drawers and Modals */}
      <WalletDrawer
        open={isDrawerOpen}
        mode={drawerMode}
        wallet={selectedWallet}
        onClose={handleDrawerClose}
        onSave={handleSaveWallet}
      />

      <DeleteWalletModal
        open={deleteModalOpen}
        wallet={walletToDelete}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteWallet}
      />
    </Container>
  );
}