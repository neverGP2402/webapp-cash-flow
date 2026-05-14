import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

import {
  Box,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  alpha,
  Chip,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { FilterOptions } from 'src/types/financial-reports';

// ----------------------------------------------------------------------

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: Partial<FilterOptions>) => void;
  dateFilter: FilterOptions['timeRange'];
  onDateFilterChange: (filter: FilterOptions['timeRange']) => void;
}

const dateFilterOptions: { value: FilterOptions['timeRange']; label: string }[] = [
  { value: 'today', label: 'today' },
  { value: '7days', label: '7days' },
  { value: '30days', label: '30days' },
  { value: 'thisMonth', label: 'thisMonth' },
  { value: 'thisYear', label: 'thisYear' },
];

export function FilterBar({
  filters,
  onFilterChange,
  dateFilter,
  onDateFilterChange,
}: FilterBarProps) {
  const { t } = useTranslation('financialReports');
  const theme = useTheme();

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.walletId) count++;
    if (filters.assetTypeId) count++;
    if (filters.categoryId) count++;
    if (filters.transactionType && filters.transactionType !== 'all') count++;
    return count;
  }, [filters]);

  const handleWalletChange = (event: any) => {
    onFilterChange({ walletId: event.target.value });
  };

  const handleTransactionTypeChange = (event: any) => {
    onFilterChange({ transactionType: event.target.value });
  };

  const clearAllFilters = () => {
    onFilterChange({
      walletId: undefined,
      assetTypeId: undefined,
      categoryId: undefined,
      transactionType: 'all',
    });
  };

  return (
    <Paper
      sx={{
        p: 2,
        mb: 4,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        position: 'sticky',
        top: 64,
        zIndex: 100,
        backdropFilter: 'blur(8px)',
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Date Range Filter */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
            <Iconify icon={'solar:calendar-bold' as any} width={18} sx={{ color: 'text.secondary', mr: 1 }} />
          </Box>
          <ToggleButtonGroup
            value={dateFilter}
            onChange={(_, newValue) => newValue && onDateFilterChange(newValue)}
            size="small"
            exclusive
            sx={{
              '& .MuiToggleButton-root': {
                borderRadius: 2,
                px: 2,
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '13px',
                border: 'none',
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                  },
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                },
              },
            }}
          >
            {dateFilterOptions.map((option) => (
              <ToggleButton key={option.value} value={option.value}>
                {t(`filters.${option.label}`)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* Additional Filters */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          {/* Wallet Filter */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="wallet-filter-label">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Iconify icon={'solar:wallet-bold' as any} width={14} />
                {t('filters.allWallets')}
              </Box>
            </InputLabel>
            <Select
              labelId="wallet-filter-label"
              value={filters.walletId || ''}
              onChange={handleWalletChange}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Iconify icon={'solar:wallet-bold' as any} width={14} />
                  {t('filters.allWallets')}
                </Box>
              }
              sx={{
                borderRadius: 2,
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                },
              }}
            >
              <MenuItem value="">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Iconify icon={'solar:wallet-bold' as any} width={14} />
                  {t('filters.allWallets')}
                </Box>
              </MenuItem>
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="bank">Bank Account</MenuItem>
              <MenuItem value="card">Credit Card</MenuItem>
              <MenuItem value="ewallet">E-Wallet</MenuItem>
            </Select>
          </FormControl>

          {/* Transaction Type Filter */}
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="type-filter-label">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Iconify icon={'solar:arrow-left-right-bold' as any} width={14} />
                {t('filters.allTypes')}
              </Box>
            </InputLabel>
            <Select
              labelId="type-filter-label"
              value={filters.transactionType || 'all'}
              onChange={handleTransactionTypeChange}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Iconify icon={'solar:arrow-left-right-bold' as any} width={14} />
                  {t('filters.allTypes')}
                </Box>
              }
              sx={{
                borderRadius: 2,
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                },
              }}
            >
              <MenuItem value="all">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Iconify icon={'solar:arrow-left-right-bold' as any} width={14} />
                  {t('filters.allTypes')}
                </Box>
              </MenuItem>
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </Select>
          </FormControl>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Chip
              label={`${activeFiltersCount} filter${activeFiltersCount > 1 ? 's' : ''} active`}
              onDelete={clearAllFilters}
              size="small"
              color="primary"
              variant="outlined"
              sx={{ borderRadius: 2 }}
            />
          )}
        </Box>
      </Box>
    </Paper>
  );
}