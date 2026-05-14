import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Typography, alpha, Chip, Alert } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { DebtWarning } from 'src/types/debt-management';

interface DebtWarningsProps {
  warnings: DebtWarning[];
}

export function DebtWarnings({ warnings }: DebtWarningsProps) {
  const { t } = useTranslation('debtManagement');

  const getSeverityColor = (severity: DebtWarning['severity']) => {
    const colors = {
      low: '#22c55e',
      medium: '#f59e0b',
      high: '#ef4444',
    };
    return colors[severity];
  };

  const getSeverityBg = (severity: DebtWarning['severity']) => {
    const colors = {
      low: alpha('#22c55e', 0.1),
      medium: alpha('#f59e0b', 0.1),
      high: alpha('#ef4444', 0.1),
    };
    return colors[severity];
  };

  const getWarningIcon = (type: DebtWarning['type']) => {
    const icons = {
      overdue: 'solar:info-circle-bold',
      upcoming: 'solar:info-circle-bold',
      highInterest: 'solar:info-circle-bold',
      unpaid: 'solar:info-circle-bold',
    };
    return icons[type];
  };

  if (warnings.length === 0) {
    return null;
  }

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: `1px solid ${alpha('#000', 0.06)}`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: alpha('#ef4444', 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}
          >
            ⚠️
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {t('warnings.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {warnings.length} {warnings.length === 1 ? 'cảnh báo' : 'cảnh báo'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {warnings.map((warning) => (
            <Alert
              key={warning.id}
              severity={warning.severity === 'high' ? 'error' : warning.severity === 'medium' ? 'warning' : 'info'}
              sx={{
                borderRadius: 2,
                alignItems: 'flex-start',
                '& .MuiAlert-icon': {
                  fontSize: 24,
                },
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {warning.debt.counterparty.name}
                  </Typography>
                  <Chip
                    label={warning.severity}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: 10,
                      bgcolor: getSeverityBg(warning.severity),
                      color: getSeverityColor(warning.severity),
                      fontWeight: 600,
                      ml: 1,
                    }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {warning.message}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                  {warning.days !== undefined && (
                    <Typography variant="caption" color="text.secondary">
                      {warning.type === 'overdue'
                        ? t('warnings.daysOverdue', { days: warning.days })
                        : t('warnings.daysUntilDue', { days: warning.days })}
                    </Typography>
                  )}
                  {warning.interestRate !== undefined && (
                    <Typography variant="caption" color="text.secondary">
                      {t('warnings.interestRate', { rate: warning.interestRate })}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Alert>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
