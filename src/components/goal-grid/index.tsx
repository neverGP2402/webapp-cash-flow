import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';

import { GoalCard } from 'src/components/goal-card/goal-card';

import type { FinancialGoal } from 'src/types/financial-goal';

interface GoalGridProps {
  goals: FinancialGoal[];
  onEdit?: (goal: FinancialGoal) => void;
  onDelete?: (goalId: string) => void;
}

export function GoalGrid({ goals, onEdit, onDelete }: GoalGridProps) {
  const { t } = useTranslation('common');

  if (goals.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Box sx={{ mb: 3 }}>
          <Box
            component="img"
            src="/assets/illustrations/empty-goals.svg"
            alt="No goals"
            sx={{ width: 200, height: 200, mx: 'auto', opacity: 0.5 }}
          />
        </Box>
        <Box>
          <Box sx={{ mb: 2 }}>
            <Box sx={{ fontSize: 48, mb: 1 }}>🎯</Box>
          </Box>
          <Box>
            <Box component="h3" sx={{ mb: 1, fontWeight: 600 }}>
              {t('financialGoals.emptyState.title')}
            </Box>
            <Box component="p" sx={{ color: 'text.secondary', mb: 2 }}>
              {t('financialGoals.emptyState.subtitle')}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' },
        gap: 3,
      }}
    >
      {goals.map((goal) => (
        <GoalCard
          key={goal.id}
          goal={goal}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Box>
  );
}
