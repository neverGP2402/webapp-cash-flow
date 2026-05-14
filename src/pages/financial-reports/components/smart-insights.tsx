import { useTranslation } from 'react-i18next';

import {
  Box,
  Paper,
  Typography,
  useTheme,
  alpha,
  Alert,
  AlertTitle,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { SmartInsight } from 'src/types/financial-reports';

// ----------------------------------------------------------------------

interface SmartInsightsProps {
  insights: SmartInsight[];
}

export function SmartInsights({ insights }: SmartInsightsProps) {
  const { t } = useTranslation('financialReports');
  const theme = useTheme();

  const getAlertColor = (type: SmartInsight['type']) => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  const getAlertIcon = (type: SmartInsight['type']) => {
    switch (type) {
      case 'warning':
        return 'solar:danger-circle-bold';
      case 'success':
        return 'solar:check-circle-bold';
      case 'info':
        return 'solar:info-circle-bold';
      default:
        return 'solar:info-circle-bold';
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            background: alpha(theme.palette.info.main, 0.1),
            mr: 2,
            color: theme.palette.info.main,
          }}
        >
          <Iconify icon={'solar:lightbulb-bold' as any} width={24} />
        </Box>
        <Typography variant="h6" fontWeight={700}>
          {t('sections.insights.title')}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
          gap: 2,
        }}
      >
        {insights.map((insight) => (
          <Alert
            key={insight.id}
            severity={getAlertColor(insight.type)}
            icon={<Iconify icon={getAlertIcon(insight.type) as any} width={24} />}
            sx={{
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette[getAlertColor(insight.type)].main, 0.2)}`,
              bgcolor: alpha(theme.palette[getAlertColor(insight.type)].main, 0.05),
              '& .MuiAlert-icon': {
                color: theme.palette[getAlertColor(insight.type)].main,
              },
              '& .MuiAlert-message': {
                width: '100%',
              },
            }}
          >
            <AlertTitle sx={{ fontWeight: 600, mb: 0.5 }}>
              {t(`sections.insights.${insight.title}`, insight.title)}
            </AlertTitle>
            <Typography variant="body2" color="text.secondary">
              {t(`sections.insights.${insight.description}`, insight.description)}
            </Typography>
          </Alert>
        ))}
      </Box>
    </Box>
  );
}