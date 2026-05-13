import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Switch,
  Divider,
  useTheme,
  alpha,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { NotificationSettings } from './types';

// ----------------------------------------------------------------------

interface NotificationSettingsSectionProps {
  settings: NotificationSettings;
  onUpdate: (updatedSettings: Partial<NotificationSettings>) => Promise<void>;
}

export function NotificationSettingsSection({ settings, onUpdate }: NotificationSettingsSectionProps) {
  const { t } = useTranslation('profileSettings');
  const theme = useTheme();
  
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async (key: keyof NotificationSettings) => {
    setIsUpdating(true);
    try {
      await onUpdate({ [key]: !settings[key] });
    } catch (error) {
      console.error('Failed to update notification settings:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const notificationItems = [
    {
      key: 'transactionAlerts' as const,
      icon: 'solar:wallet-money-bold',
      title: t('notifications.transactionAlerts'),
      description: t('notifications.transactionAlertsDescription'),
    },
    {
      key: 'spendingWarnings' as const,
      icon: 'solar:shield-warning-bold',
      title: t('notifications.spendingWarnings'),
      description: t('notifications.spendingWarningsDescription'),
    },
    {
      key: 'goalReminders' as const,
      icon: 'solar:coin-bold',
      title: t('notifications.goalReminders'),
      description: t('notifications.goalRemindersDescription'),
    },
    {
      key: 'debtReminders' as const,
      icon: 'solar:bell-bing-bold-duotone',
      title: t('notifications.debtReminders'),
      description: t('notifications.debtRemindersDescription'),
    },
  ];

  const deliveryMethods = [
    {
      key: 'emailNotifications' as const,
      icon: 'solar:chat-round-dots-bold',
      title: t('notifications.emailNotifications'),
      description: t('notifications.emailNotificationsDescription'),
    },
    {
      key: 'pushNotifications' as const,
      icon: 'solar:bell-bing-bold-duotone',
      title: t('notifications.pushNotifications'),
      description: t('notifications.pushNotificationsDescription'),
    },
  ];

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
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
            {t('notifications.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('notifications.subtitle')}
          </Typography>
        </Box>

        <Stack spacing={3}>
          {/* Notification Types */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 2 }}>
              {t('notifications.types')}
            </Typography>
            <Stack spacing={2}>
              {notificationItems.map((item) => (
                <Box
                  key={item.key}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.grey[500], 0.05),
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={2}
                  >
                    <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Iconify icon="solar:bell-bing-bold-duotone" width={20} />
                      </Box>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.25 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      </Box>
                    </Stack>
                    <Switch
                      checked={settings[item.key]}
                      onChange={() => handleToggle(item.key)}
                      disabled={isUpdating}
                      color="primary"
                    />
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>

          <Divider />

          {/* Delivery Methods */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 2 }}>
              {t('notifications.deliveryMethods')}
            </Typography>
            <Stack spacing={2}>
              {deliveryMethods.map((item) => (
                <Box
                  key={item.key}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.grey[500], 0.05),
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    spacing={2}
                  >
                    <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Iconify icon="solar:bell-bing-bold-duotone" width={20} />
                      </Box>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.25 }}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      </Box>
                    </Stack>
                    <Switch
                      checked={settings[item.key]}
                      onChange={() => handleToggle(item.key)}
                      disabled={isUpdating}
                      color="primary"
                    />
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
