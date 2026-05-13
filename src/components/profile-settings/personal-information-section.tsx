import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  TextField,
  Button,
  IconButton,
  Chip,
  Fade,
  CircularProgress,
  useTheme,
  alpha,
  Grid,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { UserProfile } from './types';

// ----------------------------------------------------------------------

interface PersonalInformationSectionProps {
  profile: UserProfile;
  onUpdate: (updatedProfile: Partial<UserProfile>) => Promise<void>;
}

export function PersonalInformationSection({ profile, onUpdate }: PersonalInformationSectionProps) {
  const { t } = useTranslation('profileSettings');
  const theme = useTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: profile.fullName,
    username: profile.username,
    email: profile.email,
    phoneNumber: profile.phoneNumber,
    birthday: profile.birthday,
    gender: profile.gender,
    address: profile.address,
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      fullName: profile.fullName,
      username: profile.username,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      birthday: profile.birthday,
      gender: profile.gender,
      address: profile.address,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      fullName: profile.fullName,
      username: profile.username,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      birthday: profile.birthday,
      gender: profile.gender,
      address: profile.address,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof typeof editForm, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const getGenderText = (gender: string) => {
    switch (gender) {
      case 'male':
        return t('gender.male');
      case 'female':
        return t('gender.female');
      case 'other':
        return t('gender.other');
      default:
        return gender;
    }
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
              {t('personalInfo.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('personalInfo.subtitle')}
            </Typography>
          </Box>

          {!isEditing ? (
            <Button
              variant="outlined"
              startIcon={<Iconify icon="solar:pen-bold" width={18} />}
              onClick={handleEdit}
              sx={{ borderRadius: 2 }}
            >
              {t('common.edit')}
            </Button>
          ) : (
            <Stack direction="row" spacing={1}>
              <Button
                variant="text"
                onClick={handleCancel}
                disabled={isSaving}
                sx={{ borderRadius: 2 }}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={isSaving}
                startIcon={isSaving ? <CircularProgress size={16} /> : <Iconify icon="eva:checkmark-fill" width={18} />}
                sx={{ borderRadius: 2 }}
              >
                {t('common.save')}
              </Button>
            </Stack>
          )}
        </Stack>

        <Fade in={!isEditing} timeout={300}>
          <Box>
            {/* Display Mode */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {t('personalInfo.fullName')}
                  </Typography>
                  <Typography variant="body1">{profile.fullName}</Typography>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {t('personalInfo.username')}
                  </Typography>
                  <Typography variant="body1">@{profile.username}</Typography>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {t('personalInfo.email')}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1">{profile.email}</Typography>
                    <Chip
                      label={t('personalInfo.verified')}
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main,
                        fontSize: '0.75rem',
                        height: 20,
                      }}
                    />
                  </Stack>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {t('personalInfo.phoneNumber')}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body1">{profile.phoneNumber}</Typography>
                    <Chip
                      label={t('personalInfo.verified')}
                      size="small"
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main,
                        fontSize: '0.75rem',
                        height: 20,
                      }}
                    />
                  </Stack>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {t('personalInfo.birthday')}
                  </Typography>
                  <Typography variant="body1">
                    {new Date(profile.birthday).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Stack spacing={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {t('personalInfo.gender')}
                  </Typography>
                  <Typography variant="body1">{getGenderText(profile.gender)}</Typography>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Stack spacing={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {t('personalInfo.address')}
                  </Typography>
                  <Typography variant="body1">{profile.address}</Typography>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Fade>

        <Fade in={isEditing} timeout={300}>
          <Box>
            {/* Edit Mode */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t('personalInfo.fullName')}
                  value={editForm.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  disabled={isSaving}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t('personalInfo.username')}
                  value={editForm.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  disabled={isSaving}
                  InputProps={{
                    startAdornment: '@',
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t('personalInfo.email')}
                  type="email"
                  value={editForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isSaving}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t('personalInfo.phoneNumber')}
                  value={editForm.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  disabled={isSaving}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label={t('personalInfo.birthday')}
                  type="date"
                  value={editForm.birthday}
                  onChange={(e) => handleInputChange('birthday', e.target.value)}
                  disabled={isSaving}
                  InputLabelProps={{ shrink: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  select
                  label={t('personalInfo.gender')}
                  value={editForm.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  disabled={isSaving}
                  SelectProps={{ native: true }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  <option value="male">{t('gender.male')}</option>
                  <option value="female">{t('gender.female')}</option>
                  <option value="other">{t('gender.other')}</option>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label={t('personalInfo.address')}
                  value={editForm.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={isSaving}
                  multiline
                  rows={2}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>
          </Box>
        </Fade>
      </CardContent>
    </Card>
  );
}
