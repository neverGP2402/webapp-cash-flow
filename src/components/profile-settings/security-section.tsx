import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Button,
  Switch,
  Chip,
  LinearProgress,
  Alert,
  useTheme,
  alpha,
  Grid,
  Divider,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { SecuritySettings } from './types';

// ----------------------------------------------------------------------

interface SecuritySectionProps {
  settings: SecuritySettings;
  onUpdate: (updatedSettings: Partial<SecuritySettings>) => Promise<void>;
  onShowConfirm: (title: string, description: string, action: string, onConfirm: () => void) => void;
}

export function SecuritySection({ settings, onUpdate, onShowConfirm }: SecuritySectionProps) {
  const { t } = useTranslation('profileSettings');
  const theme = useTheme();
  
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle2FA = async () => {
    if (settings.twoFactorEnabled) {
      onShowConfirm(
        t('security.disable2FA'),
        t('security.disable2FADescription'),
        t('security.disable'),
        async () => await onUpdate({ twoFactorEnabled: false })
      );
    } else {
      await onUpdate({ twoFactorEnabled: true });
    }
  };

  const handleTogglePIN = async () => {
    if (settings.pinEnabled) {
      onShowConfirm(
        t('security.disablePIN'),
        t('security.disablePINDescription'),
        t('security.disable'),
        async () => await onUpdate({ pinEnabled: false })
      );
    } else {
      await onUpdate({ pinEnabled: true });
    }
  };

  const handleToggleBiometric = async () => {
    await onUpdate({ biometricEnabled: !settings.biometricEnabled });
  };

  const handleChangePassword = () => {
    onShowConfirm(
      t('security.changePassword'),
      t('security.changePasswordDescription'),
      t('security.change'),
      async () => {
        // Simulate password change
        await onUpdate({ lastPasswordChange: new Date().toISOString() });
      }
    );
  };

  const handleLogoutAllDevices = () => {
    onShowConfirm(
      t('security.logoutAllDevices'),
      t('security.logoutAllDevicesDescription'),
      t('security.logout'),
      async () => {
        // Simulate logout all devices
        console.log('Logging out all devices...');
      }
    );
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getSecurityLevelText = (score: number) => {
    if (score >= 80) return t('security.excellent');
    if (score >= 60) return t('security.good');
    return t('security.weak');
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
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
            {t('security.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('security.subtitle')}
          </Typography>
        </Box>

        {/* Security Score */}
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: alpha(getSecurityScoreColor(settings.securityScore), 0.05),
            border: `1px solid ${alpha(getSecurityScoreColor(settings.securityScore), 0.2)}`,
            mb: 3,
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center">
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t('security.securityScore')}
                </Typography>
                <Chip
                  label={`${settings.securityScore}/100`}
                  size="small"
                  sx={{
                    bgcolor: alpha(getSecurityScoreColor(settings.securityScore), 0.1),
                    color: getSecurityScoreColor(settings.securityScore),
                    fontWeight: 600,
                  }}
                />
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t('security.scoreDescription', { level: getSecurityLevelText(settings.securityScore) })}
              </Typography>
              <LinearProgress
                value={settings.securityScore}
                variant="determinate"
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: alpha(theme.palette.grey[500], 0.2),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    bgcolor: getSecurityScoreColor(settings.securityScore),
                  },
                }}
              />
            </Box>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: alpha(getSecurityScoreColor(settings.securityScore), 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `2px solid ${alpha(getSecurityScoreColor(settings.securityScore), 0.3)}`,
              }}
            >
              <Iconify 
                icon="solar:shield-keyhole-bold-duotone" 
                width={40} 
                color={getSecurityScoreColor(settings.securityScore)}
              />
            </Box>
          </Stack>
        </Box>

        {/* Security Features */}
        <Stack spacing={3}>
          {/* Two-Factor Authentication */}
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.grey[500], 0.05) }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Iconify icon="solar:shield-keyhole-bold-duotone" width={24} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {t('security.twoFactorAuth')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('security.twoFactorAuthDescription')}
                  </Typography>
                </Box>
              </Stack>
              <Switch
                checked={settings.twoFactorEnabled}
                onChange={handleToggle2FA}
                disabled={isUpdating}
                color="primary"
              />
            </Stack>
          </Box>

          {/* PIN Code */}
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.grey[500], 0.05) }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Iconify icon="solar:shield-keyhole-bold-duotone" width={24} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {t('security.pinCode')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('security.pinCodeDescription')}
                  </Typography>
                </Box>
              </Stack>
              <Switch
                checked={settings.pinEnabled}
                onChange={handleTogglePIN}
                disabled={isUpdating}
                color="primary"
              />
            </Stack>
          </Box>

          {/* Biometric Authentication */}
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ p: 2, borderRadius: 2, bgcolor: alpha(theme.palette.grey[500], 0.05) }}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Iconify icon="solar:shield-warning-bold" width={24} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {t('security.biometricAuth')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('security.biometricAuthDescription')}
                  </Typography>
                </Box>
              </Stack>
              <Switch
                checked={settings.biometricEnabled}
                onChange={handleToggleBiometric}
                disabled={isUpdating}
                color="primary"
              />
            </Stack>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Security Actions */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Iconify icon="solar:shield-keyhole-bold-duotone" width={20} />}
                onClick={handleChangePassword}
                sx={{ borderRadius: 2, py: 1.5 }}
              >
                {t('security.changePassword')}
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Iconify icon="solar:restart-bold" width={20} />}
                onClick={handleLogoutAllDevices}
                sx={{ borderRadius: 2, py: 1.5 }}
              >
                {t('security.logoutAllDevices')}
              </Button>
            </Grid>
          </Grid>

          {/* Verification Status */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1.5 }}>
              {t('security.verificationStatus')}
            </Typography>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Iconify 
                  icon={settings.emailVerified ? "eva:checkmark-fill" : "solar:trash-bin-trash-bold"} 
                  width={16} 
                  color={settings.emailVerified ? theme.palette.success.main : theme.palette.error.main}
                />
                <Typography variant="body2">
                  {t('security.emailVerified')}
                </Typography>
                {settings.emailVerified && (
                  <Chip
                    label={t('security.verified')}
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
                      fontSize: '0.75rem',
                      height: 20,
                    }}
                  />
                )}
              </Stack>
              <Stack direction="row" spacing={2} alignItems="center">
                <Iconify 
                  icon={settings.phoneVerified ? "eva:checkmark-fill" : "solar:trash-bin-trash-bold"} 
                  width={16} 
                  color={settings.phoneVerified ? theme.palette.success.main : theme.palette.error.main}
                />
                <Typography variant="body2">
                  {t('security.phoneVerified')}
                </Typography>
                {settings.phoneVerified && (
                  <Chip
                    label={t('security.verified')}
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
                      fontSize: '0.75rem',
                      height: 20,
                    }}
                  />
                )}
              </Stack>
            </Stack>
          </Box>

          {/* Last Password Change */}
          <Alert 
            severity="info" 
            sx={{ borderRadius: 2 }}
            icon={<Iconify icon="solar:clock-circle-outline" width={20} />}
          >
            <Typography variant="body2">
              {t('security.lastPasswordChange', { 
                date: new Date(settings.lastPasswordChange).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              })}
            </Typography>
          </Alert>
        </Stack>
      </CardContent>
    </Card>
  );
}
