import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Typography, Stack, Button, Grid, Tabs, Tab, Box, TextField, InputAdornment, alpha } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { CategoryCard } from './category-card';
import { WalletCard } from './wallet-card';
import { configTransactionService } from 'src/services/config-transaction.service';
import { Category, Wallet } from 'src/types/config-transaction';

export default function ConfigTransactionView() {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState('CATEGORIES');
  const [categories, setCategories] = useState<Category[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [catData, walData] = await Promise.all([
        configTransactionService.getCategories(),
        configTransactionService.getWallets()
      ]);
      setCategories(catData.data || []);
      setWallets(walData.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Cấu hình hệ thống</Typography>
          <Typography variant="body2" color="text.secondary">
            Quản lý danh mục giao dịch và các ví tài chính cá nhân
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="large"
          startIcon={<Iconify icon="mingcute:add-line" />}
          sx={{ borderRadius: 1.5, px: 3, boxShadow: (theme) => theme.customShadows.primary }}
        >
          {currentTab === 'CATEGORIES' ? 'Thêm danh mục' : 'Thêm ví'}
        </Button>
      </Stack>

      {/* ANALYTICS CARDS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Tổng danh mục', val: categories.length, icon: 'solar:list-bold', color: 'info' },
          { label: 'Ví sử dụng', val: wallets.length, icon: 'solar:wallet-bold', color: 'warning' },
          { label: 'Danh mục Thu', val: categories.filter(c => c.type === 'INCOME').length, icon: 'solar:alt-arrow-down-bold', color: 'success' },
          { label: 'Danh mục Chi', val: categories.filter(c => c.type === 'EXPENSE').length, icon: 'solar:alt-arrow-up-bold', color: 'error' },
        ].map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.label}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ 
              p: 3, borderRadius: 2, bgcolor: 'background.paper', 
              boxShadow: (theme) => alpha(theme.palette.common.black, 0.05) + ' 0px 4px 20px'
            }}>
              <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: alpha(item.color === 'info' ? '#1890FF' : item.color === 'success' ? '#54D62C' : '#FF4842', 0.1), color: `${item.color}.main` }}>
                <Iconify icon={item.icon as any} width={28} />
              </Box>
              <Box>
                <Typography variant="h4">{item.val}</Typography>
                <Typography variant="body2" color="text.secondary">{item.label}</Typography>
              </Box>
            </Stack>
          </Grid>
        ))}
      </Grid>

      {/* TABS & SEARCH */}
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Tabs value={currentTab} onChange={(_, v) => setCurrentTab(v)}>
          <Tab value="CATEGORIES" label="Danh mục giao dịch" />
          <Tab value="WALLETS" label="Ví của tôi" />
        </Tabs>
        <TextField
          size="small"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" color="text.disabled" />
              </InputAdornment>
            ),
          }}
          sx={{ width: { xs: 1, md: 300 } }}
        />
      </Stack>

      {/* DATA DISPLAY */}
      <Grid container spacing={3}>
        {currentTab === 'CATEGORIES' ? (
          categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map((cat) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cat.id}>
              <CategoryCard category={cat} onEdit={() => {}} onDelete={() => {}} />
            </Grid>
          ))
        ) : (
          wallets.filter(w => w.name.toLowerCase().includes(search.toLowerCase())).map((wal) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={wal.id}>
              <WalletCard wallet={wal} onEdit={() => {}} onDelete={() => {}} />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
}