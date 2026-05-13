import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, InputAdornment, Box } from '@mui/material';

interface PriceInputProps {
  value: number;
  onChange: (value: number) => void;
  currency?: string;
  error?: boolean;
  helperText?: string;
}

export default function PriceInput({
  value,
  onChange,
  currency = '₫',
  error,
  helperText
}: PriceInputProps) {
  const { t } = useTranslation('add-asset');
  const [displayValue, setDisplayValue] = useState<string>(value.toString());

  const formatCurrency = useCallback((numStr: string): string => {
    if (!numStr) return '';
    
    const cleaned = numStr.replace(/[^\d]/g, '');
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }, []);

  const parseValue = (displayStr: string): number => {
    const cleaned = displayStr.replace(/,/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  useEffect(() => {
    if (value === 0 && displayValue === '') return;
    setDisplayValue(formatCurrency(value.toString()));
  }, [value, formatCurrency]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);
    onChange(parseValue(newValue));
  };

  const handleBlur = () => {
    const parsed = parseValue(displayValue);
    setDisplayValue(formatCurrency(parsed.toString()));
  };

  return (
    <TextField
      fullWidth
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      label={t('form.price.label')}
      placeholder={t('form.price.placeholder')}
      error={error}
      helperText={helperText}
      variant="outlined"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Box
              sx={{
                fontSize: 16,
                fontWeight: 600,
                color: 'text.secondary',
                mr: 0.5
              }}
            >
              {currency}
            </Box>
          </InputAdornment>
        )
      }}
      inputProps={{
        style: {
          fontSize: 18,
          fontWeight: 600,
          fontVariantNumeric: 'tabular-nums'
        }
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderWidth: 2
          },
          '&:hover fieldset': {
            borderWidth: 2
          },
          '&.Mui-focused fieldset': {
            borderWidth: 2
          }
        }
      }}
    />
  );
}