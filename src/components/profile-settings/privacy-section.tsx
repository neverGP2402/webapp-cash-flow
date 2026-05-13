import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Switch,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { UserProfile } from './types';

// ----------------------------------------------------------------------

interface PrivacySectionProps {
  profile: UserProfile;
  onUpdate: (updatedProfile: Partial<UserProfile>) => Promise<void>;
}

export function PrivacySection({ profile, onUpdate }: PrivacySectionProps) {
  const { t } = useTranslation('profileSettings');
  const theme = useTheme();
  
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async (key: string) => {
    setIsUpdating(true);
    try {
      await onUpdate({ [key]: !profile[key as keyof UserProfile] });
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const privacyItems = [
    {
      key: 'hideBalance',
      icon: 'solar:eye-closed-bold',
      title: t('privacy.hideBalance'),
      description: t('privacy.hideBalanceDescription'),
    },
    {
      key: 'quickLock',
      icon: 'solar:shield-keyhole-bold-duotone',
      title: t('privacy.quickLock'),
      description: t('privacy.quickLockDescription'),
    },
    {
      key: 'requireAuthToViewAssets',
      icon: 'solar:shield-warning-bold',
      title: t('privacy.requireAuthToViewAssets'),
      description: t('privacy.requireAuthToViewAssetsDescription'),
    },
    {
      key: 'limitSensitiveData',
      icon: 'solar:shield-keyhole-bold-duotone',
      title: t('privacy.limitSensitiveData'),
      description: t('privacy.limitSensitiveDataDescription'),
    },
  ];

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[4],
          borderColor: alpha(theme.palette.primary.main, 0.2),
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Section Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {t('privacy.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('privacy.subtitle')}
          </Typography>
        </Box>

        <Stack spacing={2}>
          {privacyItems.map((item) => (
            <Box
              key={item.key}
              sx={{
                p: 2,
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
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Iconify icon="solar:shield-keyhole-bold-duotone" width={18} />
                  </Box>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.25, fontSize: '0.875rem' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      {item.description}
                    </Typography>
                  </Box>
                </Stack>
                <Switch
                  checked={profile[item.key as keyof UserProfile] as boolean}
                  onChange={() => handleToggle(item.key)}
                  disabled={isUpdating}
                  color="primary"
                  size="small"
                />
              </Stack>
            </Box>
          ))}
        </Stack>

        {/* Privacy Notice */}
        <Alert 
          severity="info" 
          sx={{ 
            mt: 3, 
            borderRadius: 2,
            fontSize: '0.8rem',
          }}
          icon={<Iconify icon="solar:shield-warning-bold" width={18} />}
        >
          <Typography variant="body2">
            {t('privacy.notice')}
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );
}
