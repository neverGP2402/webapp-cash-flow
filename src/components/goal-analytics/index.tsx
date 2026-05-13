import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  useTheme,
  alpha,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { GoalAnalytics as GoalAnalyticsType } from 'src/types/financial-goal';

interface GoalAnalyticsProps {
  analytics: GoalAnalyticsType;
}

export function GoalAnalytics({ analytics }: GoalAnalyticsProps) {
  const { t } = useTranslation('common');
  const theme = useTheme();

  const renderGoalCard = (goal: GoalAnalyticsType['closestGoal'], title: string, icon: string, color: string) => {
    if (!goal) return null;

    const progress = (goal.currentAmount / goal.targetAmount) * 100;

    return (
      <Card
        sx={{
          p: 2,
          borderRadius: 3,
          border: `1px solid ${alpha(color, 0.2)}`,
          background: alpha(color, 0.05),
          height: '100%'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: alpha(color, 0.2),
              mr: 2,
              color
            }}
          >
            <Iconify icon="solar:cart-3-bold" width={20} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h6" fontWeight={600} noWrap>
              {goal.name}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t('financialGoals.goalCard.currentAmount')}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {goal.currentAmount.toLocaleString('vi-VN')}₫
            </Typography>
          </Box>
          
          <LinearProgress
            variant="determinate"
            value={Math.min(100, progress)}
            sx={{
              height: 6,
              borderRadius: 3,
              background: alpha(color, 0.2),
              '& .MuiLinearProgress-bar': {
                background: color,
                borderRadius: 3,
              }
            }}
          />
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            {progress.toFixed(1)}% {t('financialGoals.heroOverview.overallProgress').toLowerCase()}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2" color="text.secondary">
            {t('financialGoals.goalCard.targetAmount')}
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {goal.targetAmount.toLocaleString('vi-VN')}₫
          </Typography>
        </Box>
      </Card>
    );
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          {t('financialGoals.analytics.title')}
        </Typography>

        {/* Analytics Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
            mb: 3
          }}
        >
          {renderGoalCard(analytics.closestGoal, t('financialGoals.analytics.closestGoal', 'Mục tiêu gần hoàn thành nhất'), 'solar:check-circle-bold', theme.palette.success.main)}
          {renderGoalCard(analytics.hardestGoal, t('financialGoals.analytics.hardestGoal', 'Mục tiêu thách thức nhất'), 'solar:warning-circle-bold', theme.palette.warning.main)}
          {renderGoalCard(analytics.fastestGrowingGoal, t('financialGoals.analytics.fastestGrowing', 'Phát triển nhanh nhất'), 'solar:rocket-bold', theme.palette.info.main)}
        </Box>

        {/* Monthly Required */}
        <Card
          sx={{
            p: 2,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.dark, 0.1)})`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: alpha(theme.palette.primary.main, 0.2),
                mr: 2,
                color: theme.palette.primary.main
              }}
            >
              <Iconify icon="solar:cart-3-bold" width={20} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {t('financialGoals.analytics.monthlyRequired', 'Cần tiết kiệm mỗi tháng')}
              </Typography>
              <Typography variant="h4" fontWeight={700} color="primary.main">
                {analytics.monthlyRequired.toLocaleString('vi-VN')}₫
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('financialGoals.analytics.predictionProgress', 'Dự báo tiến độ')}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, analytics.predictionProgress)}
              sx={{
                height: 8,
                borderRadius: 4,
                background: alpha(theme.palette.primary.main, 0.2),
                '& .MuiLinearProgress-bar': {
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  borderRadius: 4,
                }
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {analytics.predictionProgress.toFixed(1)}% {t('financialGoals.analytics.predictionProgress', 'Dự báo tiến độ').toLowerCase()}
            </Typography>
          </Box>
        </Card>
      </CardContent>
    </Card>
  );
}
