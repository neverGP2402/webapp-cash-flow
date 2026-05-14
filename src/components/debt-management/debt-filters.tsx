import { useTranslation } from 'react-i18next';
import { Box, TextField, Chip, alpha, InputAdornment, Typography } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { DebtFilterOptions } from 'src/types/debt-management';

interface DebtFiltersProps {
  filters: DebtFilterOptions;
  onFilterChange: (filters: Partial<DebtFilterOptions>) => void;
}

export function DebtFilters({ filters, onFilterChange }: DebtFiltersProps) {
  const { t } = useTranslation('debtManagement');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: event.target.value });
  };

  const handleTypeFilter = (type: DebtFilterOptions['type']) => {
    onFilterChange({ type });
  };

  const handleStatusFilter = (status: DebtFilterOptions['status']) => {
    onFilterChange({ status });
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder={t('filters.searchPlaceholder')}
        value={filters.search}
        onChange={handleSearchChange}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '& fieldset': {
              borderWidth: 2,
            },
          },
        }}
      />

      {/* Type Filters */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
          {t('filters.typeFilter')}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {(['all', 'borrowing', 'lending'] as const).map((type) => (
            <Chip
              key={type}
              label={t(`type.${type}`)}
              onClick={() => handleTypeFilter(type)}
              color={filters.type === type ? 'primary' : 'default'}
              variant={filters.type === type ? 'filled' : 'outlined'}
              sx={{
                height: 32,
                fontWeight: 600,
                fontSize: 13,
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Status Filters */}
      <Box>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
          {t('filters.statusFilter')}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {(['all', 'active', 'paid', 'overdue', 'pending'] as const).map((status) => (
            <Chip
              key={status}
              label={t(`status.${status}`)}
              onClick={() => handleStatusFilter(status)}
              color={filters.status === status ? 'primary' : 'default'}
              variant={filters.status === status ? 'filled' : 'outlined'}
              sx={{
                height: 32,
                fontWeight: 600,
                fontSize: 13,
                borderRadius: 2,
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
