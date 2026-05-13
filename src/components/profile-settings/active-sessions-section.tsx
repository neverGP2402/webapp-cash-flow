import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Button,
  Chip,
  useTheme,
  alpha,
  Grid,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { ActiveSession } from './types';

// ----------------------------------------------------------------------

interface ActiveSessionsSectionProps {
  sessions: ActiveSession[];
  onSessionLogout: (sessionId: string) => Promise<void>;
  onAllSessionsLogout: () => Promise<void>;
}

export function ActiveSessionsSection({ sessions, onSessionLogout, onAllSessionsLogout }: ActiveSessionsSectionProps) {
  const { t } = useTranslation('profileSettings');
  const theme = useTheme();

  const getDeviceIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'windows':
        return 'solar:home-angle-bold-duotone';
      case 'ios':
      case 'iphone':
        return 'solar:wallet-money-bold';
      case 'android':
        return 'solar:bell-bing-bold-duotone';
      default:
        return 'solar:settings-bold-duotone';
    }
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('sessions.justNow');
    if (diffMins < 60) return t('sessions.minutesAgo', { count: diffMins });
    if (diffHours < 24) return t('sessions.hoursAgo', { count: diffHours });
    return t('sessions.daysAgo', { count: diffDays });
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[8],
          borderColor: alpha(theme.palette.primary.main, 0.2),
        },
      }}
    >
      <CardContent sx={{ p: 4 }}>
        {/* Section Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
              {t('sessions.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('sessions.subtitle')}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            onClick={onAllSessionsLogout}
            sx={{ borderRadius: 2 }}
          >
            {t('sessions.logoutAll')}
          </Button>
        </Stack>

        {/* Sessions List */}
        <Grid container spacing={2}>
          {sessions.map((session) => (
            <Grid key={session.id} size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: `1px solid ${session.isCurrent 
                    ? alpha(theme.palette.primary.main, 0.3) 
                    : alpha(theme.palette.divider, 0.5)}`,
                  bgcolor: session.isCurrent 
                    ? alpha(theme.palette.primary.main, 0.05) 
                    : 'transparent',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: alpha(theme.palette.grey[500], 0.05),
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                  },
                }}
              >
                <Stack spacing={2}>
                  {/* Device Info */}
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Iconify icon={getDeviceIcon(session.platform)} width={24} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {session.device}
                        </Typography>
                        {session.isCurrent && (
                          <Chip
                            label={t('sessions.current')}
                            size="small"
                            sx={{
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              color: theme.palette.primary.main,
                              fontSize: '0.7rem',
                              height: 20,
                            }}
                          />
                        )}
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {session.location}
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Session Details */}
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="caption" color="text.secondary">
                        IP: {session.ip}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Iconify icon="solar:clock-circle-outline" width={14} />
                      <Typography variant="caption" color="text.secondary">
                        {t('sessions.lastActive')}: {formatLastActive(session.lastActive)}
                      </Typography>
                    </Stack>
                  </Stack>

                  {/* Logout Button */}
                  {!session.isCurrent && (
                    <Button
                      fullWidth
                      variant="text"
                      size="small"
                      onClick={() => onSessionLogout(session.id)}
                      sx={{ 
                        borderRadius: 2,
                        color: theme.palette.error.main,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.error.main, 0.05),
                        },
                      }}
                    >
                      {t('sessions.logout')}
                    </Button>
                  )}
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
