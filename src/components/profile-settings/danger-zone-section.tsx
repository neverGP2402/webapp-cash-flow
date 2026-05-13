import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Button,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface DangerZoneSectionProps {
  onShowConfirm: (title: string, description: string, action: string, onConfirm: () => void) => void;
}

export function DangerZoneSection({ onShowConfirm }: DangerZoneSectionProps) {
  const { t } = useTranslation('profileSettings');
  const theme = useTheme();

  const handleDeleteAccount = () => {
    onShowConfirm(
      t('dangerZone.deleteAccount'),
      t('dangerZone.deleteAccountDescription'),
      t('dangerZone.delete'),
      () => {
        console.log('Account deleted');
      }
    );
  };

  const handleResetData = () => {
    onShowConfirm(
      t('dangerZone.resetData'),
      t('dangerZone.resetDataDescription'),
      t('dangerZone.reset'),
      () => {
        console.log('Data reset');
      }
    );
  };

  const handleLogoutAll = () => {
    onShowConfirm(
      t('dangerZone.logoutAll'),
      t('dangerZone.logoutAllDescription'),
      t('dangerZone.logout'),
      () => {
        console.log('Logged out from all devices');
      }
    );
  };

  const dangerActions = [
    {
      key: 'logoutAll',
      icon: 'solar:restart-bold',
      title: t('dangerZone.logoutAll'),
      description: t('dangerZone.logoutAllDescription'),
      action: handleLogoutAll,
      severity: 'warning' as const,
    },
    {
      key: 'resetData',
      icon: 'solar:trash-bin-trash-bold',
      title: t('dangerZone.resetData'),
      description: t('dangerZone.resetDataDescription'),
      action: handleResetData,
      severity: 'error' as const,
    },
    {
      key: 'deleteAccount',
      icon: 'solar:shield-warning-bold',
      title: t('dangerZone.deleteAccount'),
      description: t('dangerZone.deleteAccountDescription'),
      action: handleDeleteAccount,
      severity: 'error' as const,
    },
  ];

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: `2px solid ${alpha(theme.palette.error.main, 0.3)}`,
        bgcolor: alpha(theme.palette.error.main, 0.02),
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[8],
          borderColor: alpha(theme.palette.error.main, 0.5),
          bgcolor: alpha(theme.palette.error.main, 0.05),
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Section Header */}
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.error.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Iconify icon="solar:shield-warning-bold" width={24} color={theme.palette.error.main} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5, color: theme.palette.error.main }}>
                {t('dangerZone.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('dangerZone.subtitle')}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Warning Alert */}
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            fontSize: '0.875rem',
          }}
          icon={<Iconify icon="solar:shield-warning-bold" width={20} />}
        >
          <Typography variant="body2">
            {t('dangerZone.warning')}
          </Typography>
        </Alert>

        {/* Danger Actions */}
        <Stack spacing={2}>
          {dangerActions.map((action) => (
            <Box
              key={action.key}
              sx={{
                p: 3,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                bgcolor: alpha(theme.palette.error.main, 0.02),
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: alpha(theme.palette.error.main, 0.05),
                  borderColor: alpha(theme.palette.error.main, 0.5),
                },
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={{ xs: 2, sm: 0 }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Iconify icon="solar:shield-warning-bold" width={20} color={theme.palette.error.main} />
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.25 }}>
                      {action.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {action.description}
                    </Typography>
                  </Box>
                </Stack>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={action.action}
                  sx={{ 
                    borderRadius: 2,
                    minWidth: { xs: '100%', sm: 'auto' },
                  }}
                >
                  {action.key === 'logoutAll' ? t('dangerZone.logout') : 
                   action.key === 'resetData' ? t('dangerZone.reset') : 
                   t('dangerZone.delete')}
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
