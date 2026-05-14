import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

import {
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  useTheme,
  alpha,
  Avatar,
  Chip,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { FinancialGoalProgress } from 'src/types/financial-reports';

// ----------------------------------------------------------------------

interface FinancialGoalsSectionProps {
  goals: FinancialGoalProgress[];
}

export function FinancialGoalsSection({ goals }: FinancialGoalsSectionProps) {
  const { t } = useTranslation('financialReports');
  const theme = useTheme();

  const stats = useMemo(() => {
    const completed = goals.filter((g) => g.status === 'completed').length;
    const inProgress = goals.filter((g) => g.status === 'onTrack' || g.status === 'delayed').length;
    const totalProgress = goals.length > 0
      ? goals.reduce((sum, g) => sum + g.progress, 0) / goals.length
      : 0;

    return { completed, inProgress, totalProgress };
  }, [goals]);

  const getDaysLeft = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        height: '100%',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: alpha(theme.palette.primary.main, 0.1),
                mr: 2,
                color: theme.palette.primary.main,
              }}
            >
              <Iconify icon={'solar:target-bold' as any} width={24} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {t('sections.financialGoals.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.inProgress} {t('sections.financialGoals.inProgress')} • {stats.completed} {t('sections.financialGoals.completed')}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Goals List */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {goals.slice(0, 3).map((goal) => (
            <Box key={goal.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    bgcolor: alpha(goal.color, 0.12),
                    color: goal.color,
                    mr: 2,
                  }}
                >
                  <Iconify icon={goal.icon as any} width={20} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {goal.name}
                    </Typography>
                    <Chip
                      label={t(`sections.financialGoals.${goal.status}`)}
                      size="small"
                      color={goal.status === 'onTrack' ? 'success' : goal.status === 'completed' ? 'info' : 'warning'}
                      sx={{ borderRadius: 2, height: 20, fontSize: '11px' }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {getDaysLeft(goal.deadline)} {t('sections.financialGoals.timeLeft')}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h6" fontWeight={700} color="primary.main">
                    {goal.progress.toFixed(0)}%
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(goal.currentAmount)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(goal.targetAmount)}
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={goal.progress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: alpha(goal.color, 0.12),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: `linear-gradient(90deg, ${goal.color}, ${alpha(goal.color, 0.7)})`,
                  },
                }}
              />

              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {t('sections.financialGoals.remaining')}: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(goal.targetAmount - goal.currentAmount)}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Overall Progress */}
        <Box sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" fontWeight={600}>
              {t('financialGoals.heroOverview.overallProgress')}
            </Typography>
            <Typography variant="body2" fontWeight={600} color="primary.main">
              {stats.totalProgress.toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={stats.totalProgress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: alpha(theme.palette.primary.main, 0.12),
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}