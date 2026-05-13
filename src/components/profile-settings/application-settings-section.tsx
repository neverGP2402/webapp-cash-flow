import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  useTheme,
  alpha,
  Grid,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { SUPPORTED_LANGUAGES } from 'src/locales/i18n.config';

import type { UserProfile } from './types';

// ----------------------------------------------------------------------

interface ApplicationSettingsSectionProps {
  profile: UserProfile;
  onUpdate: (updatedProfile: Partial<UserProfile>) => Promise<void>;
}

export function ApplicationSettingsSection({ profile, onUpdate }: ApplicationSettingsSectionProps) {
  const { t, i18n } = useTranslation('profileSettings');
  const theme = useTheme();
  
  const [isUpdating, setIsUpdating] = useState(false);

  const handleLanguageChange = async (language: string) => {
    setIsUpdating(true);
    try {
      // Change app language
      i18n.changeLanguage(language);
      localStorage.setItem('selectedLanguage', language);
      
      // Update profile
      await onUpdate({ language });
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCurrencyChange = async (currency: string) => {
    setIsUpdating(true);
    try {
      await onUpdate({ currency });
    } catch (error) {
      console.error('Failed to change currency:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTimezoneChange = async (timezone: string) => {
    setIsUpdating(true);
    try {
      await onUpdate({ timezone });
    } catch (error) {
      console.error('Failed to change timezone:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const currencies = [
    { code: 'VND', symbol: '₫', name: 'Việt Nam Đồng' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
  ];

  const timezones = [
    { value: 'Asia/Ho_Chi_Minh', label: 'TP.HCM, Việt Nam (GMT+7)' },
    { value: 'Asia/Tokyo', label: 'Tokyo, Nhật Bản (GMT+9)' },
    { value: 'UTC', label: 'UTC (GMT+0)' },
    { value: 'America/New_York', label: 'New York, USA (GMT-5)' },
  ];

  const numberFormats = [
    { value: 'vi-VN', label: '1.234,56' },
    { value: 'en-US', label: '1,234.56' },
    { value: 'ja-JP', label: '1,234.56' },
  ];

  const dateFormats = [
    { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY' },
    { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY' },
    { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD' },
    { value: 'dd-MM-yyyy', label: 'DD-MM-YYYY' },
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
            {t('appSettings.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('appSettings.subtitle')}
          </Typography>
        </Box>

        <Stack spacing={3}>
          {/* Language Selection */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1.5 }}>
              {t('appSettings.language')}
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                <Chip
                  key={code}
                  icon={<span>{lang.flag}</span>}
                  label={lang.name}
                  onClick={() => handleLanguageChange(code)}
                  disabled={isUpdating}
                  clickable
                  sx={{
                    bgcolor: i18n.language === code 
                      ? alpha(theme.palette.primary.main, 0.1) 
                      : alpha(theme.palette.grey[500], 0.1),
                    color: i18n.language === code 
                      ? theme.palette.primary.main 
                      : 'text.primary',
                    border: i18n.language === code 
                      ? `1px solid ${theme.palette.primary.main}` 
                      : `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    fontWeight: i18n.language === code ? 600 : 400,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>

          {/* Currency Selection */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1.5 }}>
              {t('appSettings.currency')}
            </Typography>
            <Grid container spacing={2}>
              {currencies.map((currency) => (
                <Grid key={currency.code} size={{ xs: 12, sm: 6 }}>
                  <Box
                    onClick={() => handleCurrencyChange(currency.code)}
                    sx={{
                      p: 2,
                      border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      bgcolor: profile.currency === currency.code 
                        ? alpha(theme.palette.primary.main, 0.05) 
                        : 'transparent',
                      borderColor: profile.currency === currency.code 
                        ? theme.palette.primary.main 
                        : alpha(theme.palette.divider, 0.5),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="h4" sx={{ fontWeight: 600 }}>
                        {currency.symbol}
                      </Typography>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {currency.code}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {currency.name}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Timezone Selection */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1.5 }}>
              {t('appSettings.timezone')}
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={profile.timezone || 'Asia/Ho_Chi_Minh'}
                onChange={(e) => handleTimezoneChange(e.target.value)}
                disabled={isUpdating}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              >
                {timezones.map((tz) => (
                  <MenuItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Number Format */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1.5 }}>
              {t('appSettings.numberFormat')}
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {numberFormats.map((format) => (
                <Chip
                  key={format.value}
                  label={format.label}
                  onClick={() => onUpdate({ numberFormat: format.value })}
                  disabled={isUpdating}
                  clickable
                  sx={{
                    bgcolor: profile.numberFormat === format.value 
                      ? alpha(theme.palette.primary.main, 0.1) 
                      : alpha(theme.palette.grey[500], 0.1),
                    color: profile.numberFormat === format.value 
                      ? theme.palette.primary.main 
                      : 'text.primary',
                    border: profile.numberFormat === format.value 
                      ? `1px solid ${theme.palette.primary.main}` 
                      : `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    fontWeight: profile.numberFormat === format.value ? 600 : 400,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>

          {/* Date Format */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1.5 }}>
              {t('appSettings.dateFormat')}
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {dateFormats.map((format) => (
                <Chip
                  key={format.value}
                  label={format.label}
                  onClick={() => onUpdate({ dateFormat: format.value })}
                  disabled={isUpdating}
                  clickable
                  sx={{
                    bgcolor: profile.dateFormat === format.value 
                      ? alpha(theme.palette.primary.main, 0.1) 
                      : alpha(theme.palette.grey[500], 0.1),
                    color: profile.dateFormat === format.value 
                      ? theme.palette.primary.main 
                      : 'text.primary',
                    border: profile.dateFormat === format.value 
                      ? `1px solid ${theme.palette.primary.main}` 
                      : `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    fontWeight: profile.dateFormat === format.value ? 600 : 400,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
