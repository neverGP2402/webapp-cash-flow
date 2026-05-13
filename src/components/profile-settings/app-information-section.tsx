import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Divider,
  useTheme,
  alpha,
  Link,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function AppInformationSection() {
  const { t } = useTranslation('profileSettings');
  const theme = useTheme();

  const appInfo = [
    {
      label: t('appInfo.version'),
      value: '1.0.0',
    },
    {
      label: t('appInfo.lastUpdate'),
      value: '2024-01-15',
    },
  ];

  const links = [
    {
      label: t('appInfo.privacyPolicy'),
      href: '#',
    },
    {
      label: t('appInfo.termsOfService'),
      href: '#',
    },
    {
      label: t('appInfo.supportCenter'),
      href: '#',
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
      <CardContent sx={{ p: 4 }}>
        {/* Section Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
            {t('appInfo.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('appInfo.subtitle')}
          </Typography>
        </Box>

        <Stack spacing={3}>
          {/* App Version Info */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 2 }}>
              {t('appInfo.appDetails')}
            </Typography>
            <Stack spacing={2}>
              {appInfo.map((info) => (
                <Stack
                  key={info.label}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.grey[500], 0.05),
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {info.label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {info.value}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>

          <Divider />

          {/* Legal & Support Links */}
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 2 }}>
              {t('appInfo.legalSupport')}
            </Typography>
            <Stack spacing={1.5}>
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  underline="hover"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'text.primary',
                    textDecoration: 'none',
                    '&:hover': {
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  <Iconify icon="eva:arrow-ios-forward-fill" width={16} />
                  <Typography variant="body2">{link.label}</Typography>
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Copyright */}
          <Box sx={{ pt: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
              © 2024 My Cash Flow. {t('appInfo.allRightsReserved')}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
