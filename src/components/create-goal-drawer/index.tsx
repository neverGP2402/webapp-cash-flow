import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Drawer,
  Box,
  Typography,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { GoalTypeSelector } from 'src/components/goal-type-selector';
import { GoalBasicInfo } from 'src/components/goal-basic-info';
import { GoalVisualization } from 'src/components/goal-visualization';
import { GoalMotivationSection } from 'src/components/goal-motivation-section';
import { GoalFooterAction } from 'src/components/goal-footer-action';

import type { CreateGoalForm, FinancialGoal } from 'src/types/financial-goal';

interface CreateGoalDrawerProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (goal: CreateGoalForm) => void;
}

export function CreateGoalDrawer({ open, onClose, onSubmit }: CreateGoalDrawerProps) {
  const { t } = useTranslation('common');
  const theme = useTheme();

  const [formData, setFormData] = useState<CreateGoalForm>({
    name: '',
    type: 'buyCar',
    targetAmount: 0,
    currentAmount: 0,
    deadline: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setFormData({
        name: '',
        type: 'buyCar',
        targetAmount: 0,
        currentAmount: 0,
        deadline: '',
      });
      setErrors({});
    }
  }, [open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('financialGoals.createGoal.validation.nameRequired');
    }

    if (formData.targetAmount <= 0) {
      newErrors.targetAmount = t('financialGoals.createGoal.validation.targetPositive');
    }

    if (!formData.deadline) {
      newErrors.deadline = t('financialGoals.createGoal.validation.deadlineRequired');
    } else if (new Date(formData.deadline) <= new Date()) {
      newErrors.deadline = t('financialGoals.createGoal.validation.deadlineFuture');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    if (formData.name || formData.targetAmount > 0 || formData.currentAmount > 0 || formData.deadline) {
      // User has unsaved changes, you might want to show a confirmation dialog here
    }
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 480 },
          maxWidth: { xs: '100%', sm: 480 },
        }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)}, ${alpha(theme.palette.primary.dark, 0.05)})`,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                {t('financialGoals.goalForm.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {t('financialGoals.createGoal.subtitle')}
              </Typography>
            </Box>
            <IconButton onClick={handleClose} size="small">
              <Iconify icon="solar:check-circle-bold" width={20} />
            </IconButton>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
          <GoalTypeSelector
            selectedType={formData.type}
            onTypeChange={(type) => setFormData(prev => ({ ...prev, type }))}
            error={errors.type}
          />

          <GoalBasicInfo
            formData={formData}
            onChange={setFormData}
            errors={errors}
            onErrorsChange={setErrors}
          />

          <GoalVisualization
            targetAmount={formData.targetAmount}
            currentAmount={formData.currentAmount}
            deadline={formData.deadline}
          />

          <GoalMotivationSection
            goalType={formData.type}
            targetAmount={formData.targetAmount}
          />
        </Box>

        {/* Footer */}
        <GoalFooterAction
          onCancel={handleClose}
          onSubmit={handleSubmit}
          isValid={Object.keys(errors).length === 0 && Boolean(formData.name?.trim()) && Number(formData.targetAmount) > 0}
        />
      </Box>
    </Drawer>
  );
}
