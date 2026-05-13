import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  Chip,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { FinancialGoal } from 'src/types/financial-goal';

interface GoalCardProps {
  goal: FinancialGoal;
  onEdit?: (goal: FinancialGoal) => void;
  onDelete?: (goalId: string) => void;
}

export function GoalCard({ goal, onEdit, onDelete }: GoalCardProps) {
  const { t } = useTranslation('common');
  const theme = useTheme();

  const progress = (goal.currentAmount / goal.targetAmount) * 100;
  const remaining = goal.targetAmount - goal.currentAmount;
  const monthlyRequired = Math.max(0, remaining / Math.max(1, (new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'active': return 'primary';
      case 'delayed': return 'warning';
      case 'no_progress': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return t('financialGoals.goalStatus.completed');
      case 'active': return t('financialGoals.goalStatus.onTrack');
      case 'delayed': return t('financialGoals.goalStatus.delayed');
      case 'no_progress': return t('financialGoals.goalStatus.noProgress');
      default: return status;
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 12px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
          borderColor: alpha(theme.palette.primary.main, 0.3)
        }
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: alpha(goal.color || theme.palette.primary.main, 0.1),
                mr: 2,
                color: goal.color || theme.palette.primary.main
              }}
            >
              <Iconify icon="solar:cart-3-bold" width={24} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" fontWeight={600} noWrap>
                {goal.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t(`financialGoals.goalTypes.${goal.type}`)}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {onEdit && (
              <IconButton size="small" onClick={() => onEdit(goal)}>
                <Iconify icon="solar:pen-bold" width={16} />
              </IconButton>
            )}
            {onDelete && (
              <IconButton size="small" onClick={() => onDelete(goal.id)}>
                <Iconify icon="solar:trash-bin-trash-bold" width={16} />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Status */}
        <Box sx={{ mb: 2 }}>
          <Chip
            label={getStatusText(goal.status)}
            color={getStatusColor(goal.status) as any}
            size="small"
            sx={{ fontWeight: 500 }}
          />
        </Box>

        {/* Progress */}
        <Box sx={{ mb: 2, flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t('financialGoals.goalCard.targetAmount')}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {goal.targetAmount.toLocaleString('vi-VN')}₫
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t('financialGoals.goalCard.currentAmount')}
            </Typography>
            <Typography variant="body2" fontWeight={600} color="primary.main">
              {goal.currentAmount.toLocaleString('vi-VN')}₫
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={Math.min(100, progress)}
            sx={{
              height: 8,
              borderRadius: 4,
              background: alpha(theme.palette.primary.main, 0.1),
              mb: 1,
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                borderRadius: 4,
              }
            }}
          />
          
          <Typography variant="caption" color="text.secondary" align="center" display="block">
            {progress.toFixed(1)}% {t('financialGoals.heroOverview.overallProgress').toLowerCase()}
          </Typography>
        </Box>

        {/* Details */}
        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t('financialGoals.goalCard.remainingAmount')}
            </Typography>
            <Typography variant="body2" fontWeight={600} color="warning.main">
              {remaining.toLocaleString('vi-VN')}₫
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t('financialGoals.goalCard.monthlySaving')}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {monthlyRequired.toLocaleString('vi-VN')}₫
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              {t('financialGoals.goalCard.estimatedCompletion')}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {new Date(goal.deadline).toLocaleDateString('vi-VN', {
                month: 'short',
                year: 'numeric'
              })}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
