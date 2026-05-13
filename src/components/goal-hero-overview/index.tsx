import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  useTheme,
  alpha,
  Grid,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { FinancialGoal } from 'src/types/financial-goal';

interface GoalHeroOverviewProps {
  goals: FinancialGoal[];
  totalTarget: number;
  totalSaved: number;
  activeCount: number;
}

export function GoalHeroOverview({ goals, totalTarget, totalSaved, activeCount }: GoalHeroOverviewProps) {
  const { t } = useTranslation('common');
  const theme = useTheme();

  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;
  
  const estimatedCompletion = goals.length > 0 ? (() => {
    const activeGoals = goals.filter(g => g.status === 'active');
    if (activeGoals.length === 0) return 'N/A';
    
    const avgTimeToComplete = activeGoals.reduce((sum, goal) => {
      const monthsToDeadline = Math.max(1, (new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30));
      return sum + monthsToDeadline;
    }, 0) / activeGoals.length;
    
    return new Date(Date.now() + (avgTimeToComplete * 30 * 24 * 60 * 60 * 1000)).toLocaleDateString('vi-VN', {
      month: 'long',
      year: 'numeric'
    });
  })() : 'N/A';

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Box>
      <Card
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.dark, 0.1)})`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s ease-in-out infinite',
          }
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 }, position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  color: 'white',
                  mr: 2
                }}
              >
                <Iconify icon="solar:cart-3-bold" width={32} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={700} color="text.primary">
                  {t('financialGoals.heroOverview.buildYourFuture', 'Xây dựng tương lai tài chính của bạn')}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                  {t('financialGoals.heroOverview.activeGoals', 'Mục tiêu đang hoạt động')}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Stats Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
              gap: 3,
            }}
          >
            <Box>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: alpha(theme.palette.primary.main, 0.1),
                    mb: 1
                  }}
                >
                  <Iconify icon="solar:cart-3-bold" width={24} color={theme.palette.primary.main} />
                </Box>
                <Typography variant="h3" fontWeight={700} color="primary.main">
                  {totalTarget.toLocaleString('vi-VN')}₫
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('financialGoals.heroOverview.totalTarget', 'Tổng mục tiêu')}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: alpha(theme.palette.success.main, 0.1),
                    mb: 1
                  }}
                >
                  <Iconify icon="solar:check-circle-bold" width={24} color={theme.palette.success.main} />
                </Box>
                <Typography variant="h3" fontWeight={700} color="success.main">
                  {totalSaved.toLocaleString('vi-VN')}₫
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('financialGoals.heroOverview.totalSaved', 'Đã tích lũy')}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: alpha(theme.palette.warning.main, 0.1),
                    mb: 1
                  }}
                >
                  <Iconify icon="solar:cart-3-bold" width={24} color={theme.palette.warning.main} />
                </Box>
                <Typography variant="h3" fontWeight={700} color="warning.main">
                  {overallProgress.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('financialGoals.heroOverview.overallProgress', 'Tiến độ tổng thể')}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: alpha(theme.palette.info.main, 0.1),
                    mb: 1
                  }}
                >
                  <Iconify icon="solar:pen-bold" width={24} color={theme.palette.info.main} />
                </Box>
                <Typography variant="h3" fontWeight={700} color="info.main">
                  {estimatedCompletion}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('financialGoals.heroOverview.estimatedCompletion', 'Dự kiến hoàn thành')}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Progress Bar */}
          <Box>
            <Box sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {t('financialGoals.heroOverview.overallProgress', 'Tiến độ tổng thể')}
                </Typography>
                <Typography variant="body2" fontWeight={600} color="primary.main">
                  {overallProgress.toFixed(1)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={overallProgress}
                sx={{
                  height: 12,
                  borderRadius: 6,
                  background: alpha(theme.palette.primary.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    borderRadius: 6,
                    transition: 'all 0.6s ease'
                  }
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box
        component="style"
        children={`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `}
      />
    </Box>
  );
}
