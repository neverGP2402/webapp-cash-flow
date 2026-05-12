import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, TextField, Typography, styled } from '@mui/material';

import type { TransactionType } from 'src/types/transaction-drawer';

// ----------------------------------------------------------------------

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  type: TransactionType;
}

const AmountContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4, 0),
  marginBottom: theme.spacing(4),
}));

const AmountTextField = styled(TextField)<{ transactionType: TransactionType }>(({ theme, transactionType }) => ({
  '& .MuiInputBase-input': {
    fontSize: '2.5rem',
    fontWeight: 700,
    textAlign: 'center',
    color: transactionType === 'income' ? theme.palette.success.main : theme.palette.error.main,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: transactionType === 'income' ? theme.palette.success.main : theme.palette.error.main,
    borderWidth: 2,
  },
  '& .MuiOutlinedInput-notchedOutline:hover': {
    borderColor: transactionType === 'income' ? theme.palette.success.dark : theme.palette.error.dark,
  },
  '& .MuiOutlinedInput-notchedOutline.Mui-focused': {
    borderColor: transactionType === 'income' ? theme.palette.success.main : theme.palette.error.main,
    borderWidth: 3,
  },
}));

const CurrencySymbol = styled('span')<{ transactionType: TransactionType }>(({ theme, transactionType }) => ({
  position: 'absolute',
  right: 20,
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '1.5rem',
  fontWeight: 600,
  color: transactionType === 'income' ? theme.palette.success.main : theme.palette.error.main,
  pointerEvents: 'none',
}));

// ----------------------------------------------------------------------

export function AmountInput({ value, onChange, type }: AmountInputProps) {
  const { t } = useTranslation();
  const [displayValue, setDisplayValue] = useState('');

  const formatAmount = useCallback((num: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(num);
  }, []);

  const parseAmount = useCallback((str: string) => {
    const cleanStr = str.replace(/[^\d]/g, '');
    return cleanStr ? parseInt(cleanStr, 10) : 0;
  }, []);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setDisplayValue(inputValue);
    
    const numericValue = parseAmount(inputValue);
    onChange(numericValue);
  }, [onChange, parseAmount]);

  const handleBlur = useCallback(() => {
    setDisplayValue(formatAmount(value));
  }, [value, formatAmount]);

  // Initialize display value
  useState(() => {
    setDisplayValue(formatAmount(value));
  });

  return (
    <AmountContainer>
      <AmountTextField
        type="text"
        value={displayValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder="0 ₫"
        transactionType={type}
        fullWidth
        InputProps={{
          style: { fontSize: '2.5rem', fontWeight: 700 },
        }}
      />
      <CurrencySymbol transactionType={type}>
        ₫
      </CurrencySymbol>
    </AmountContainer>
  );
}
