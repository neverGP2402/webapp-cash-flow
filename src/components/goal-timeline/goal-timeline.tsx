import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { GoalMilestone, FinancialGoal } from 'src/types/financial-goal';

interface GoalTimelineProps {
  milestones: GoalMilestone[];
  goals: FinancialGoal[];
}

export function GoalTimeline({ milestones, goals }: GoalTimelineProps) {
  const { t } = useTranslation('common');
  const theme = useTheme();

  const getMilestoneIcon = (percentage: number) => {
    if (percentage >= 100) return 'solar:check-circle-bold';
    if (percentage >= 75) return 'solar:cart-3-bold';
    if (percentage >= 50) return 'solar:pen-bold';
    if (percentage >= 25) return 'solar:eye-bold';
    return 'solar:cart-3-bold';
  };

  const getMilestoneColor = (percentage: number) => {
    if (percentage >= 100) return theme.palette.success.main;
    if (percentage >= 75) return theme.palette.warning.main;
    if (percentage >= 50) return theme.palette.info.main;
    return theme.palette.primary.main;
  };

  const getGoalName = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    return goal ? goal.name : t('financialGoals.timeline.unknownGoal');
  };

  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.paper, 0.95)})`,
        borderRadius: 4,
        boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.1)}`,
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Iconify icon="solar:pen-bold" width={24} color={theme.palette.primary.main} sx={{ mr: 2 }} />
          <Typography variant="h5" fontWeight={700} color="text.primary">
            {t('financialGoals.timeline.title')}
          </Typography>
        </Box>

        <Box sx={{ position: 'relative' }}>
          {/* Timeline Line */}
          <Box
            sx={{
              position: 'absolute',
              left: 20,
              top: 0,
              bottom: 0,
              width: 3,
              background: theme.palette.primary.main,
              borderRadius: 2,
            }}
          />

          {/* Timeline Items */}
          <Box sx={{ ml: 6 }}>
            {milestones.map((milestone, index) => (
              <Box key={milestone.id} sx={{ position: 'relative', mb: 4 }}>
                {/* Timeline Dot */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: -8,
                    top: 8,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: getMilestoneColor(milestone.percentage),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `3px solid ${theme.palette.background.paper}`,
                    zIndex: 2,
                  }}
                >
                  <Iconify 
                    icon={getMilestoneIcon(milestone.percentage)} 
                    width={10} 
                    sx={{ color: 'white' }} 
                  />
                </Box>

                {/* Timeline Content */}
                <Box
                  sx={{
                    ml: 4,
                    p: 3,
                    background: alpha(theme.palette.background.paper, 0.6),
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Chip
                      label={`${milestone.percentage}%`}
                      size="small"
                      sx={{
                        background: getMilestoneColor(milestone.percentage),
                        color: 'white',
                        fontWeight: 600,
                        mr: 2,
                      }}
                    />
                    <Typography variant="body2" fontWeight={600} color="text.primary">
                      {getGoalName(milestone.goalId)}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    {new Date(milestone.achievedAt).toLocaleDateString('vi-VN')}
                  </Typography>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                    {t('financialGoals.timeline.achievedAmount', { 
                      amount: milestone.amount.toLocaleString('vi-VN') 
                    })}
                  </Typography>
                </Box>

                {/* Timeline Connector */}
                {index < milestones.length - 1 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: -8,
                      top: 24,
                      bottom: -16,
                      width: 3,
                      background: alpha(theme.palette.divider, 0.3),
                      zIndex: 1,
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
        </Box>

        {milestones.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
            }}
          >
            <Iconify icon="solar:pen-bold" width={48} color={theme.palette.text.secondary} sx={{ mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              {t('financialGoals.timeline.noMilestones')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('financialGoals.timeline.startTracking')}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
