import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, TextField, Typography, styled } from '@mui/material';

import type { TransactionFormData, ValidationErrors } from 'src/types/transaction-drawer';

// ----------------------------------------------------------------------

interface TransactionInfoFormProps {
  formData: TransactionFormData;
  errors: ValidationErrors;
  onChange: (data: Partial<TransactionFormData>) => void;
  onErrorsChange: (errors: ValidationErrors) => void;
}

const FormContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(2),
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.875rem',
    fontWeight: 500,
  },
}));

// ----------------------------------------------------------------------

export function TransactionInfoForm({ formData, errors, onChange, onErrorsChange }: TransactionInfoFormProps) {
  const { t } = useTranslation();

  const handleFieldChange = (field: keyof TransactionFormData) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    
    // Clear error for this field when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      onErrorsChange({ ...errors, [field as keyof ValidationErrors]: undefined });
    }
    
    onChange({ [field]: value });
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
        Thông tin giao dịch
      </Typography>
      
      <FormContainer>
        <StyledTextField
          fullWidth
          label="Ngày giao dịch"
          type="date"
          value={formData.date}
          onChange={handleFieldChange('date')}
          error={!!errors.date}
          helperText={errors.date}
        />

        <StyledTextField
          fullWidth
          label="Mô tả"
          multiline
          rows={2}
          value={formData.description || ''}
          onChange={handleFieldChange('description')}
          error={!!errors.description}
          helperText={errors.description}
          placeholder="Nhập mô tả giao dịch..."
        />

        <StyledTextField
          fullWidth
          label="Mã tham chiếu"
          value={formData.referenceCode || ''}
          onChange={handleFieldChange('referenceCode')}
          error={!!errors.referenceCode}
          helperText={errors.referenceCode}
          placeholder="Nhập mã tham chiếu..."
        />

        <StyledTextField
          fullWidth
          label="Tags"
          value={formData.tags?.join(', ') || ''}
          onChange={(event) => {
            const tagsString = event.target.value;
            const tags = tagsString.split(',').map(tag => tag.trim()).filter(Boolean);
            handleFieldChange('tags')(event);
            onChange({ tags });
          }}
          error={!!errors.tags}
          helperText={errors.tags}
          placeholder="Nhập tags, phân cách bằng dấu phẩy..."
        />
      </FormContainer>
    </Box>
  );
}
