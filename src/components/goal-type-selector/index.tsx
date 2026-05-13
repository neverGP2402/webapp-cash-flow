import { useTranslation } from 'react-i18next';

import {
  Box,
  Typography,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { CreateGoalForm } from 'src/types/financial-goal';

interface GoalTypeSelectorProps {
  selectedType: CreateGoalForm['type'];
  onTypeChange: (type: CreateGoalForm['type']) => void;
  error?: string;
}

const goalTypes = [
  {
    type: 'buyCar' as const,
    icon: 'solar:cart-3-bold',
    titleKey: 'financialGoals.goalTypes.buyCar',
    color: '#FF6B6B'
  },
  {
    type: 'buyHouse' as const,
    icon: 'solar:home-bold',
    titleKey: 'financialGoals.goalTypes.buyHouse',
    color: '#96CEB4'
  },
  {
    type: 'travel' as const,
    icon: 'solar:pen-bold',
    titleKey: 'financialGoals.goalTypes.travel',
    color: '#45B7D1'
  },
  {
    type: 'emergencyFund' as const,
    icon: 'solar:check-circle-bold',
    titleKey: 'financialGoals.goalTypes.emergencyFund',
    color: '#4ECDC4'
  },
  {
    type: 'investment' as const,
    icon: 'solar:cart-3-bold',
    titleKey: 'financialGoals.goalTypes.investment',
    color: '#FFEAA7'
  },
  {
    type: 'other' as const,
    icon: 'solar:share-bold',
    titleKey: 'financialGoals.goalTypes.other',
    color: '#9B59B6'
  }
];

export function GoalTypeSelector({ selectedType, onTypeChange, error }: GoalTypeSelectorProps) {
  const { t } = useTranslation('common');
  const theme = useTheme();

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        {t('financialGoals.createGoal.selectType')}
      </Typography>
      
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr' },
          gap: 2,
        }}
      >
        {goalTypes.map((goalType) => (
          <Card
            key={goalType.type}
            onClick={() => onTypeChange(goalType.type)}
            sx={{
              cursor: 'pointer',
              borderRadius: 3,
              border: `2px solid ${
                selectedType === goalType.type
                  ? goalType.color
                  : alpha(theme.palette.divider, 0.1)
              }`,
              background: selectedType === goalType.type
                ? alpha(goalType.color, 0.1)
                : 'transparent',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: goalType.color,
                background: alpha(goalType.color, 0.05),
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 24px ${alpha(goalType.color, 0.15)}`,
              }
            }}
          >
            <CardContent sx={{ p: 2, textAlign: 'center' }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: selectedType === goalType.type
                    ? goalType.color
                    : alpha(goalType.color, 0.1),
                  color: selectedType === goalType.type ? 'white' : goalType.color,
                  mb: 1,
                  display: 'inline-flex',
                }}
              >
                <Iconify icon="solar:cart-3-bold" width={32} />
              </Box>
              <Typography
                variant="body2"
                fontWeight={600}
                color={selectedType === goalType.type ? goalType.color : 'text.primary'}
                sx={{ fontSize: '0.875rem' }}
              >
                {t(goalType.titleKey)}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {error && (
        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
