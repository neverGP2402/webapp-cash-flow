import { useTranslation } from 'react-i18next';

import { Box, ButtonGroup, Button, styled } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { TransactionType } from 'src/types/transaction-drawer';

// ----------------------------------------------------------------------

interface TransactionTypeSelectorProps {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
}

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(3),
  '& .MuiButtonGroup-grouped': {
    minWidth: 120,
    fontSize: '1rem',
    fontWeight: 600,
    padding: theme.spacing(1.5, 3),
    borderRadius: theme.spacing(2),
    textTransform: 'none',
    transition: 'all 0.2s ease-in-out',
  },
}));

const IncomeButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: theme.palette.success.contrastText,
  borderColor: theme.palette.success.main,
  '&:hover': {
    backgroundColor: theme.palette.success.dark,
    borderColor: theme.palette.success.dark,
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
    borderColor: theme.palette.success.main,
  },
}));

const ExpenseButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  borderColor: theme.palette.error.main,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
    borderColor: theme.palette.error.dark,
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    borderColor: theme.palette.error.main,
  },
}));

// ----------------------------------------------------------------------

export function TransactionTypeSelector({ value, onChange }: TransactionTypeSelectorProps) {
  const { t } = useTranslation('common');

  const handleTypeChange = (_: any, newType: TransactionType) => {
    onChange(newType);
  };

  return (
    <Box>
      <StyledButtonGroup>
        <IncomeButton
          variant={value === 'income' ? 'contained' : 'outlined'}
          onClick={() => onChange('income')}
          startIcon={<Iconify icon="solar:check-circle-bold" width={20} />}
        >
          {t('transactionHistory.income')}
        </IncomeButton>
        <ExpenseButton
          variant={value === 'expense' ? 'contained' : 'outlined'}
          onClick={() => onChange('expense')}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" width={20} />}
        >
          {t('transactionHistory.expense')}
        </ExpenseButton>
      </StyledButtonGroup>
    </Box>
  );
}
