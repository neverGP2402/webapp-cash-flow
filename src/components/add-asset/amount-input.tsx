import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TextField, InputAdornment, Box, Typography, alpha } from '@mui/material';

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
  unit?: { unit_name: string; symbol?: string };
  error?: boolean;
  helperText?: string;
  label?: string;
  placeholder?: string;
}

export default function AmountInput({
  value,
  onChange,
  unit,
  error,
  helperText,
  label,
  placeholder
}: AmountInputProps) {
  const { t } = useTranslation('addAsset');
  const [displayValue, setDisplayValue] = useState<string>(value.toString());

  const formatDisplayValue = useCallback((numStr: string): string => {
    if (!numStr) return '';
    
    // Remove non-numeric characters except comma and dot
    const cleaned = numStr.replace(/[^\d,\.]/g, '');
    
    // Handle decimal
    const parts = cleaned.split(/[\.|,]/);
    if (parts.length > 2) return displayValue;
    
    if (parts.length === 1) {
      // No decimal, just format with commas
      return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    // Has decimal part
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const decimalPart = parts[1];
    return `${integerPart}.${decimalPart}`;
  }, [displayValue]);

  const parseValue = (displayStr: string): number => {
    const cleaned = displayStr.replace(/,/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  useEffect(() => {
    if (value === 0 && displayValue === '') return;
    setDisplayValue(formatDisplayValue(value.toString()));
  }, [value, formatDisplayValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);
    onChange(parseValue(newValue));
  };

  const handleBlur = () => {
    const parsed = parseValue(displayValue);
    setDisplayValue(formatDisplayValue(parsed.toString()));
  };

  return (
    <Box>
      <TextField
        fullWidth
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        label={label || t('form.amount.label')}
        placeholder={placeholder || t('form.amount.placeholder')}
        error={error}
        helperText={helperText}
        variant="outlined"
        InputProps={{
          endAdornment: unit && (
            <InputAdornment position="end">
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'text.secondary'
                }}
              >
                {unit.symbol || unit.unit_name}
              </Box>
            </InputAdornment>
          )
        }}
        inputProps={{
          style: {
            fontSize: 24,
            fontWeight: 700,
            fontVariantNumeric: 'tabular-nums',
            padding: '14px 16px'
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
      {unit && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 0.5, display: 'block' }}
        >
          {unit.unit_name}
        </Typography>
      )}
    </Box>
  );
}