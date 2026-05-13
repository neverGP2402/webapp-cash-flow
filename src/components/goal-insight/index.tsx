import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { GoalInsight as GoalInsightType } from 'src/types/financial-goal';

interface GoalInsightProps {
  insights: GoalInsightType;
}

export function GoalInsight({ insights }: GoalInsightProps) {
  const { t } = useTranslation('common');
  const theme = useTheme();

  return (
    <Card
      sx={{
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        height: '100%',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          {t('financialGoals.insights.title')}
        </Typography>

        {/* Current Pace */}
        <Card
          sx={{
            p: 2,
            borderRadius: 3,
            mb: 2,
            background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.05)}, ${alpha(theme.palette.info.dark, 0.1)})`,
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Iconify 
              icon="solar:pen-bold" 
              width={20} 
              color={theme.palette.info.main}
              sx={{ mr: 2 }}
            />
            <Typography variant="body2" color="text.secondary">
              {t('financialGoals.insights.currentPace')}
            </Typography>
          </Box>
          <Typography variant="h6" fontWeight={600} color="info.main">
            {t('financialGoals.insights.willCompleteIn')} {insights.currentPaceCompletion}
          </Typography>
        </Card>

        {/* Priority Goal */}
        {insights.priorityGoal && (
          <Card
            sx={{
              p: 2,
              borderRadius: 3,
              mb: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.05)}, ${alpha(theme.palette.warning.dark, 0.1)})`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Iconify 
                icon="solar:cart-3-bold" 
                width={20} 
                color={theme.palette.warning.main}
                sx={{ mr: 2 }}
              />
              <Typography variant="body2" color="text.secondary">
                {t('financialGoals.insights.priorityGoal')}
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight={600} color="warning.main" noWrap>
              {insights.priorityGoal.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              {t('financialGoals.insights.focusOn')}
            </Typography>
          </Card>
        )}

        {/* Goals Lists */}
        <List sx={{ p: 0 }}>
          {insights.aheadGoals.length > 0 && (
            <ListItem sx={{ px: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Iconify 
                  icon="solar:check-circle-bold" 
                  width={18} 
                  color={theme.palette.success.main}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">
                      {insights.aheadGoals.length} {t('financialGoals.insights.aheadGoal')}
                    </Typography>
                    <Chip
                      label={t('financialGoals.insights.keepGoing')}
                      size="small"
                      color="success"
                      sx={{ fontSize: 10, height: 20 }}
                    />
                  </Box>
                }
              />
            </ListItem>
          )}

          {insights.delayedGoals.length > 0 && (
            <ListItem sx={{ px: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Iconify 
                  icon="solar:cart-3-bold" 
                  width={18} 
                  color={theme.palette.error.main}
                />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">
                      {insights.delayedGoals.length} {t('financialGoals.goalStatus.delayed')}
                    </Typography>
                    <Chip
                      label="Cần tập trung"
                      size="small"
                      color="error"
                      sx={{ fontSize: 10, height: 20 }}
                    />
                  </Box>
                }
              />
            </ListItem>
          )}
        </List>

        {/* Motivational Quote */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: 3,
            background: alpha(theme.palette.primary.main, 0.05),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            💡 {t('financialGoals.createGoal.motivationQuote')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
