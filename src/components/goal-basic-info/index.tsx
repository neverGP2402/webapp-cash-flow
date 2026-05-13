import { useTranslation } from 'react-i18next';

import {
  Box,
  TextField,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';

import type { CreateGoalForm } from 'src/types/financial-goal';

interface GoalBasicInfoProps {
  formData: CreateGoalForm;
  onChange: (formData: CreateGoalForm) => void;
  errors: Record<string, string>;
  onErrorsChange: (errors: Record<string, string>) => void;
}

export function GoalBasicInfo({ formData, onChange, errors, onErrorsChange }: GoalBasicInfoProps) {
  const { t } = useTranslation('common');
  const theme = useTheme();

  const handleInputChange = (field: keyof CreateGoalForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    
    // Clear error when user starts typing
    if (errors[field]) {
      onErrorsChange({ ...errors, [field]: '' });
    }

    if (field === 'targetAmount' || field === 'currentAmount') {
      const numValue = parseFloat(value) || 0;
      onChange({ ...formData, [field]: numValue });
    } else {
      onChange({ ...formData, [field]: value });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        {t('financialGoals.createGoal.goalName')}
      </Typography>
      
      <TextField
        fullWidth
        label={t('financialGoals.createGoal.goalName')}
        value={formData.name}
        onChange={handleInputChange('name')}
        error={!!errors.name}
        helperText={errors.name}
        sx={{ mb: 2 }}
      />

      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        {t('financialGoals.createGoal.targetAmount')}
      </Typography>
      
      <TextField
        fullWidth
        label={t('financialGoals.createGoal.targetAmount')}
        value={formatCurrency(formData.targetAmount)}
        onChange={handleInputChange('targetAmount')}
        error={!!errors.targetAmount}
        helperText={errors.targetAmount}
        InputProps={{
          startAdornment: (
            <Box sx={{ mr: 1, color: 'text.secondary' }}>
              ₫
            </Box>
          ),
        }}
        sx={{ mb: 2 }}
      />

      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        {t('financialGoals.createGoal.currentSaved')}
      </Typography>
      
      <TextField
        fullWidth
        label={t('financialGoals.createGoal.currentSaved')}
        value={formatCurrency(formData.currentAmount)}
        onChange={handleInputChange('currentAmount')}
        error={!!errors.currentAmount}
        helperText={errors.currentAmount}
        InputProps={{
          startAdornment: (
            <Box sx={{ mr: 1, color: 'text.secondary' }}>
              ₫
            </Box>
          ),
        }}
        sx={{ mb: 2 }}
      />

      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        {t('financialGoals.createGoal.deadline')}
      </Typography>
      
      <TextField
        fullWidth
        type="date"
        label={t('financialGoals.createGoal.deadline')}
        value={formData.deadline}
        onChange={handleInputChange('deadline')}
        error={!!errors.deadline}
        helperText={errors.deadline}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min: new Date().toISOString().split('T')[0],
        }}
      />
    </Box>
  );
}
