import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Button,
  Stack,
  Chip,
  LinearProgress,
  alpha,
  useTheme,
  IconButton,
  Fade,
  CircularProgress,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { UserProfile } from './types';

// ----------------------------------------------------------------------

interface ProfileHeroCardProps {
  profile: UserProfile;
  onAvatarUpload: (file: File) => Promise<void>;
  onProfileUpdate: (updatedProfile: Partial<UserProfile>) => Promise<void>;
}

export function ProfileHeroCard({ profile, onAvatarUpload, onProfileUpdate }: ProfileHeroCardProps) {
  const { t } = useTranslation('profileSettings');
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        await onAvatarUpload(file);
        await onProfileUpdate({ avatar: URL.createObjectURL(file) });
      } catch (error) {
        console.error('Avatar upload failed:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return theme.palette.success.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getSecurityLevelText = (level: string) => {
    switch (level) {
      case 'high':
        return t('security.high');
      case 'medium':
        return t('security.medium');
      case 'low':
        return t('security.low');
      default:
        return t('security.unknown');
    }
  };

  const getAccountStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'suspended':
        return theme.palette.error.main;
      case 'inactive':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getAccountStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return t('status.active');
      case 'suspended':
        return t('status.suspended');
      case 'inactive':
        return t('status.inactive');
      default:
        return t('status.unknown');
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 120,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          opacity: 0.1,
        }}
      />

      <CardContent sx={{ p: 4, position: 'relative' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
          {/* Avatar Section */}
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={profile.avatar || undefined}
              sx={{
                width: 120,
                height: 120,
                border: `4px solid ${theme.palette.background.paper}`,
                boxShadow: theme.shadows[8],
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: theme.shadows[12],
                },
              }}
              onClick={handleAvatarClick}
            >
              {!profile.avatar && (
                <Iconify icon="solar:settings-bold-duotone" width={60} height={60} />
              )}
            </Avatar>

            {/* Online Indicator */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                width: 24,
                height: 24,
                borderRadius: '50%',
                bgcolor: theme.palette.success.main,
                border: `3px solid ${theme.palette.background.paper}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: theme.palette.success.main,
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              />
            </Box>

            {/* Upload Button */}
            <IconButton
              sx={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                width: 40,
                height: 40,
                bgcolor: theme.palette.primary.main,
                color: 'white',
                boxShadow: theme.shadows[4],
                '&:hover': {
                  bgcolor: theme.palette.primary.dark,
                  transform: 'scale(1.1)',
                },
              }}
              onClick={handleAvatarClick}
              disabled={isUploading}
            >
              {isUploading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Iconify icon="solar:pen-bold" width={20} />
              )}
            </IconButton>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </Box>

          {/* Profile Information */}
          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h3" sx={{ fontWeight: 600, mb: 1 }}>
              {profile.fullName}
            </Typography>

            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              @{profile.username}
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
              <Chip
                icon={<Iconify icon="solar:chat-round-dots-bold" width={16} />}
                label={profile.email}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.875rem' }}
              />
              <Chip
                icon={<Iconify icon="solar:wallet-money-bold" width={16} />}
                label={profile.phoneNumber}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.875rem' }}
              />
            </Stack>

            {/* Status and Security Level */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {t('accountStatus')}:
                </Typography>
                <Chip
                  label={getAccountStatusText(profile.accountStatus)}
                  size="small"
                  sx={{
                    bgcolor: alpha(getAccountStatusColor(profile.accountStatus), 0.1),
                    color: getAccountStatusColor(profile.accountStatus),
                    fontWeight: 500,
                  }}
                />
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  {t('securityLevel')}:
                </Typography>
                <Chip
                  label={getSecurityLevelText(profile.securityLevel)}
                  size="small"
                  sx={{
                    bgcolor: alpha(getSecurityLevelColor(profile.securityLevel), 0.1),
                    color: getSecurityLevelColor(profile.securityLevel),
                    fontWeight: 500,
                  }}
                />
              </Stack>
            </Stack>
          </Box>

          {/* Join Date */}
          <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t('joinDate')}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              {new Date(profile.joinDate).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </Box>
        </Stack>

        {/* Security Score Progress */}
        <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {t('securityScore')}
            </Typography>
            <Typography variant="body2" fontWeight={600} color="primary.main">
              85/100
            </Typography>
          </Stack>
          <LinearProgress
            value={85}
            variant="determinate"
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
