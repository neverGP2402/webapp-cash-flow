import { useTranslation } from 'react-i18next';

import {
  Box,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface GoalVisualizationProps {
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export function GoalVisualization({ targetAmount, currentAmount, deadline }: GoalVisualizationProps) {
  const { t } = useTranslation('common');
  const theme = useTheme();

  const progress = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;
  const remaining = targetAmount - currentAmount;

  // Calculate monthly required saving
  const monthlyRequired = deadline ? (() => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const monthsUntilDeadline = Math.max(1, 
      (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30)
    );
    return remaining / monthsUntilDeadline;
  })() : 0;

  // Calculate estimated completion date based on current pace
  const estimatedCompletion = currentAmount > 0 ? (() => {
    const daysSinceStart = 30; // Assume 30 days since start
    const dailySavingRate = currentAmount / daysSinceStart;
    const daysToComplete = remaining / dailySavingRate;
    const estimatedDate = new Date(Date.now() + (daysToComplete * 24 * 60 * 60 * 1000));
    return estimatedDate.toLocaleDateString('vi-VN', {
      month: 'long',
      year: 'numeric'
    });
  })() : null;

  return (
    <Card
      sx={{
        borderRadius: 3,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)}, ${alpha(theme.palette.primary.dark, 0.05)})`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          {t('financialGoals.createGoal.futureProjection')}
        </Typography>

        {/* Progress Circle */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative', mr: 3 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h6" fontWeight={700} color="primary.main">
                {progress.toFixed(0)}%
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `conic-gradient(${theme.palette.primary.main} ${progress * 3.6}deg, ${alpha(theme.palette.primary.main, 0.1)} 0deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="body2" fontWeight={600}>
                  {progress.toFixed(0)}%
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('financialGoals.goalCard.currentAmount')}: <strong>{currentAmount.toLocaleString('vi-VN')}₫</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('financialGoals.goalCard.targetAmount')}: <strong>{targetAmount.toLocaleString('vi-VN')}₫</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('financialGoals.goalCard.remainingAmount')}: <strong>{remaining.toLocaleString('vi-VN')}₫</strong>
            </Typography>
          </Box>
        </Box>

        {/* Progress Bar */}
        <Box sx={{ mb: 3 }}>
          <LinearProgress
            variant="determinate"
            value={Math.min(100, progress)}
            sx={{
              height: 8,
              borderRadius: 4,
              background: alpha(theme.palette.primary.main, 0.1),
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                borderRadius: 4,
              }
            }}
          />
        </Box>

        {/* Statistics */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Iconify 
              icon="solar:cart-3-bold" 
              width={20} 
              color={theme.palette.info.main}
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {t('financialGoals.goalCard.monthlySaving')}
            </Typography>
            <Typography variant="h6" fontWeight={600} color="info.main">
              {monthlyRequired.toLocaleString('vi-VN')}₫
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Iconify 
              icon="solar:pen-bold" 
              width={20} 
              color={theme.palette.success.main}
              sx={{ mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {t('financialGoals.goalCard.estimatedCompletion')}
            </Typography>
            <Typography variant="h6" fontWeight={600} color="success.main">
              {estimatedCompletion || 'N/A'}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
