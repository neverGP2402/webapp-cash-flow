import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  TextField,
  Chip,
  ButtonGroup,
  Button,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { Iconify } from 'src/components/iconify';

import type { FilterOptions, TimeFilter, TypeFilter } from 'src/types/transaction';

// ----------------------------------------------------------------------

interface TransactionFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const FilterChip = styled(Chip)<{ selected?: boolean }>(({ theme, selected }) => ({
  borderRadius: theme.spacing(2),
  fontWeight: 500,
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

const FilterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

// ----------------------------------------------------------------------

export function TransactionFilters({ filters, onFiltersChange }: TransactionFiltersProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      searchTerm: event.target.value,
    });
  };

  const handleTimeFilterChange = (timeFilter: TimeFilter) => {
    onFiltersChange({
      ...filters,
      timeFilter,
    });
  };

  const handleTypeFilterChange = (typeFilter: TypeFilter) => {
    onFiltersChange({
      ...filters,
      typeFilter,
    });
  };

  const handleCategoryFilterChange = (categoryFilter: string) => {
    onFiltersChange({
      ...filters,
      categoryFilter,
    });
  };

  const handleWalletFilterChange = (walletFilter: string) => {
    onFiltersChange({
      ...filters,
      walletFilter,
    });
  };

  const timeFilters: { value: TimeFilter; label: string }[] = [
    { value: 'all', label: t('transactionHistory.allTime') },
    { value: 'today', label: t('transactionHistory.today') },
    { value: 'yesterday', label: t('transactionHistory.yesterday') },
    { value: 'thisWeek', label: t('transactionHistory.thisWeek') },
    { value: 'thisMonth', label: t('transactionHistory.thisMonth') },
    { value: 'lastMonth', label: t('transactionHistory.lastMonth') },
  ];

  const typeFilters: { value: TypeFilter; label: string }[] = [
    { value: 'all', label: t('transactionHistory.allTypes') },
    { value: 'income', label: t('transactionHistory.income') },
    { value: 'expense', label: t('transactionHistory.expense') },
  ];

  const mockCategories = [
    { id: 'all', name: t('transactionHistory.allCategories') },
    { id: 'food', name: 'Food & Dining' },
    { id: 'transport', name: 'Transportation' },
    { id: 'shopping', name: 'Shopping' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'bills', name: 'Bills & Utilities' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'education', name: 'Education' },
    { id: 'other', name: 'Other' },
  ];

  const mockWallets = [
    { id: 'all', name: t('transactionHistory.allWallets') },
    { id: 'cash', name: 'Cash' },
    { id: 'bank', name: 'Bank Account' },
    { id: 'credit', name: 'Credit Card' },
    { id: 'ewallet', name: 'E-Wallet' },
  ];

  return (
    <FilterSection>
      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder={t('transactionHistory.searchPlaceholder')}
        value={filters.searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: <Iconify icon="eva:search-fill" width={20} sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
        sx={{ mb: 3 }}
      />

      {/* Quick Filters */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
          {t('transactionHistory.filterByTime')}
        </Typography>
        <ButtonGroup variant="outlined" size="small" sx={{ flexWrap: 'wrap', gap: 1 }}>
          {timeFilters.map((filter) => (
            <Button
              key={filter.value}
              variant={filters.timeFilter === filter.value ? 'contained' : 'outlined'}
              onClick={() => handleTimeFilterChange(filter.value)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              {filter.label}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {/* Type Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
          {t('transactionHistory.filterByType')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {typeFilters.map((filter) => (
            <FilterChip
              key={filter.value}
              label={filter.label}
              onClick={() => handleTypeFilterChange(filter.value)}
              selected={filters.typeFilter === filter.value}
              clickable
            />
          ))}
        </Box>
      </Box>

      {/* Advanced Filters */}
      <Accordion
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        sx={{ 
          boxShadow: 'none',
          '&:before': { display: 'none' },
          border: `1px solid rgba(0, 0, 0, 0.08)`,
          borderRadius: 2,
        }}
      >
        <AccordionSummary 
          expandIcon={<Iconify icon="carbon:chevron-sort" width={20} />}
          sx={{ 
            minHeight: 48,
            '& .MuiAccordionSummary-content': { my: 1 },
          }}
        >
          <Typography variant="subtitle2" fontWeight={600}>
            {t('common.optional')} Filters
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: 0 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {/* Category Filter */}
            <FormControl fullWidth size="small">
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                {t('transactionHistory.filterByCategory')}
              </Typography>
              <Select
                value={filters.categoryFilter}
                onChange={(e) => handleCategoryFilterChange(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {mockCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Wallet Filter */}
            <FormControl fullWidth size="small">
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                {t('transactionHistory.filterByWallet')}
              </Typography>
              <Select
                value={filters.walletFilter}
                onChange={(e) => handleWalletFilterChange(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {mockWallets.map((wallet) => (
                  <MenuItem key={wallet.id} value={wallet.id}>
                    {wallet.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </AccordionDetails>
      </Accordion>
    </FilterSection>
  );
}
