import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Fade,
  useTheme,
  alpha,
} from '@mui/material';

import { ProfileHeroCard } from './profile-hero-card';
import { PersonalInformationSection } from './personal-information-section';
import { ApplicationSettingsSection } from './application-settings-section';
import { SecuritySection } from './security-section';
import { ActiveSessionsSection } from './active-sessions-section';
import { NotificationSettingsSection } from './notification-settings-section';
import { PrivacySection } from './privacy-section';
import { AppInformationSection } from './app-information-section';
import { DangerZoneSection } from './danger-zone-section';
import { ConfirmActionModal } from './confirm-action-modal';

import type { UserProfile, SecuritySettings, ActiveSession, NotificationSettings } from './types';

// ----------------------------------------------------------------------

export function ProfileSettingsPage() {
  const { t } = useTranslation('profileSettings');
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    description: string;
    action: string;
    onConfirm: () => void;
  } | null>(null);

  // Mock data loading
  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setUserProfile({
        id: '1',
        fullName: 'Nguyễn Văn A',
        username: 'nguyenvana',
        email: 'nguyenvana@example.com',
        phoneNumber: '+84 123 456 789',
        birthday: '1990-01-15',
        gender: 'male',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        avatar: null,
        joinDate: '2023-01-15',
        accountStatus: 'active',
        securityLevel: 'high',
        isOnline: true,
        language: 'vi',
        currency: 'VND',
        timezone: 'Asia/Ho_Chi_Minh',
        numberFormat: 'vi-VN',
        dateFormat: 'dd/MM/yyyy',
      });

      setSecuritySettings({
        twoFactorEnabled: true,
        pinEnabled: true,
        biometricEnabled: false,
        emailVerified: true,
        phoneVerified: true,
        lastPasswordChange: '2024-01-01',
        securityScore: 85,
      });

      setActiveSessions([
        {
          id: '1',
          device: 'Chrome on Windows',
          platform: 'Windows',
          browser: 'Chrome',
          ip: '192.168.1.100',
          location: 'TP.HCM, Vietnam',
          lastActive: new Date().toISOString(),
          isCurrent: true,
        },
        {
          id: '2',
          device: 'Safari on iPhone',
          platform: 'iOS',
          browser: 'Safari',
          ip: '192.168.1.101',
          location: 'TP.HCM, Vietnam',
          lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          isCurrent: false,
        },
      ]);

      setNotificationSettings({
        transactionAlerts: true,
        spendingWarnings: true,
        goalReminders: true,
        debtReminders: true,
        emailNotifications: true,
        pushNotifications: false,
      });

      setIsLoading(false);
    };

    loadProfileData();
  }, []);

  const handleProfileUpdate = async (updatedProfile: Partial<UserProfile>) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, ...updatedProfile });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const handleSecurityUpdate = async (updatedSettings: Partial<SecuritySettings>) => {
    if (securitySettings) {
      setSecuritySettings({ ...securitySettings, ...updatedSettings });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const handleNotificationUpdate = async (updatedSettings: Partial<NotificationSettings>) => {
    if (notificationSettings) {
      setNotificationSettings({ ...notificationSettings, ...updatedSettings });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  };

  const handleSessionLogout = async (sessionId: string) => {
    setActiveSessions(sessions => sessions.filter(s => s.id !== sessionId));
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const handleAllSessionsLogout = async () => {
    setActiveSessions(sessions => sessions.filter(s => s.isCurrent));
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const handleAvatarUpload = async (file: File) => {
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (userProfile) {
      const avatarUrl = URL.createObjectURL(file);
      setUserProfile({ ...userProfile, avatar: avatarUrl });
    }
  };

  const showConfirmModal = (title: string, description: string, action: string, onConfirm: () => void) => {
    setConfirmModal({
      open: true,
      title,
      description,
      action,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(null);
      },
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <Stack spacing={3}>
          {[...Array(8)].map((_, index) => (
            <Card key={index} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    height: 100,
                    bgcolor: alpha(theme.palette.grey[500], 0.1),
                    borderRadius: 2,
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  }

  return (
    <Fade in={!isLoading} timeout={800}>
      <Box sx={{ width: '100%', py: 3 }}>
        <Typography variant="h3" sx={{ mb: 4, fontWeight: 600, color: 'text.primary' }}>
          {t('pageTitle')}
        </Typography>

        <Stack spacing={4}>
          {/* Profile Hero Section */}
          <ProfileHeroCard
            profile={userProfile!}
            onAvatarUpload={handleAvatarUpload}
            onProfileUpdate={handleProfileUpdate}
          />

          {/* Main Content Grid */}
          <Grid container spacing={4}>
            {/* Left Column - Desktop Sticky */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Stack spacing={3} sx={{ position: 'sticky', top: 24 }}>
                {/* Application Settings */}
                <ApplicationSettingsSection
                  profile={userProfile!}
                  onUpdate={handleProfileUpdate}
                />

                {/* Privacy Section */}
                <PrivacySection
                  profile={userProfile!}
                  onUpdate={handleProfileUpdate}
                />
              </Stack>
            </Grid>

            {/* Right Column - Main Content */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Stack spacing={3}>
                {/* Personal Information */}
                <PersonalInformationSection
                  profile={userProfile!}
                  onUpdate={handleProfileUpdate}
                />

                {/* Security Section */}
                <SecuritySection
                  settings={securitySettings!}
                  onUpdate={handleSecurityUpdate}
                  onShowConfirm={showConfirmModal}
                />

                {/* Active Sessions */}
                <ActiveSessionsSection
                  sessions={activeSessions}
                  onSessionLogout={handleSessionLogout}
                  onAllSessionsLogout={handleAllSessionsLogout}
                />

                {/* Notification Settings */}
                <NotificationSettingsSection
                  settings={notificationSettings!}
                  onUpdate={handleNotificationUpdate}
                />

                {/* App Information */}
                <AppInformationSection />

                {/* Danger Zone */}
                <DangerZoneSection onShowConfirm={showConfirmModal} />
              </Stack>
            </Grid>
          </Grid>
        </Stack>

        {/* Confirmation Modal */}
        {confirmModal && (
          <ConfirmActionModal
            open={confirmModal.open}
            title={confirmModal.title}
            description={confirmModal.description}
            actionText={confirmModal.action}
            onConfirm={confirmModal.onConfirm}
            onCancel={() => setConfirmModal(null)}
          />
        )}
      </Box>
    </Fade>
  );
}
