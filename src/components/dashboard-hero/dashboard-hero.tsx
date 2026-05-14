import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  alpha,
  useTheme,
  Fade,
  Chip,
  Avatar,
  Skeleton,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';

interface DashboardHeroProps {
  userName?: string;
  totalAssets?: number;
  monthlyChange?: number;
  netWorth?: number;
  totalCash?: number;
  totalDebt?: number;
  isLoading?: boolean;
}

export function DashboardHero({
  userName = 'Bạn',
  totalAssets = 0,
  monthlyChange = 0,
  netWorth = 0,
  totalCash = 0,
  totalDebt = 0,
  isLoading = false,
}: DashboardHeroProps) {
  const { t, i18n } = useTranslation('dashboard');
  const theme = useTheme();
  const [animatedAssets, setAnimatedAssets] = useState(0);
  const [animatedNetWorth, setAnimatedNetWorth] = useState(0);

  // Count-up animation
  useEffect(() => {
    if (!isLoading) {
      const duration = 1500;
      const frameRate = 60;
      const totalFrames = duration / (1000 / frameRate);
      let frame = 0;

      const animate = () => {
        frame++;
        const progress = frame / totalFrames;
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        setAnimatedAssets(totalAssets * easeProgress);
        setAnimatedNetWorth(netWorth * easeProgress);

        if (frame < totalFrames) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [totalAssets, netWorth, isLoading]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('hero.greetingMorning');
    if (hour < 18) return t('hero.greetingAfternoon');
    return t('hero.greetingEvening');
  };

  const getStatusMessage = () => {
    if (monthlyChange > 5) return t('hero.positiveGrowth');
    if (monthlyChange > 0) return t('hero.stableGrowth');
    return t('hero.needsAttention');
  };

  const getStatusColor = () => {
    if (monthlyChange > 5) return 'success';
    if (monthlyChange > 0) return 'primary';
    return 'warning';
  };

  if (isLoading) {
    return (
      <Card
        sx={{
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.primary.dark, 0.1)})`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          minHeight: 280,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Skeleton variant="circular" width={56} height={56} sx={{ mr: 3 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width={250} height={48} sx={{ mb: 1 }} />
              <Skeleton variant="text" width={350} height={32} />
            </Box>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' }, gap: 3 }}>
            <Skeleton variant="text" width={200} height={60} />
            <Skeleton variant="text" width={200} height={60} />
            <Skeleton variant="text" width={200} height={60} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Fade in={!isLoading} timeout={800}>
      <Card
        sx={{
          borderRadius: 4,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.primary.dark, 0.12)})`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s ease-in-out infinite',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: alpha(theme.palette.primary.main, 0.05),
          },
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 5 }, position: 'relative', zIndex: 1 }}>
          {/* Greeting Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 3 }}>
            <Box
              sx={{
                p: 2.5,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                color: 'white',
                flexShrink: 0,
                boxShadow: `0px 8px 16px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              <Iconify icon="solar:wallet-money-bold" width={32} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5, lineHeight: 1.2 }}>
                {getGreeting()}, {userName} 👋
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Typography variant="body1" color="text.secondary">
                  {getStatusMessage()}
                </Typography>
                <Chip
                  label={`${monthlyChange >= 0 ? '+' : ''}${monthlyChange}%`}
                  color={getStatusColor() as any}
                  size="small"
                  sx={{ fontWeight: 600, height: 24 }}
                />
              </Box>
            </Box>
          </Box>

          {/* Key Metrics */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
              gap: 3,
            }}
          >
            {/* Total Assets */}
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                background: alpha(theme.palette.success.main, 0.08),
                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: alpha(theme.palette.success.main, 0.12),
                    mr: 2,
                  }}
                >
                  <Iconify icon="solar:wallet-money-bold" width={20} color={theme.palette.success.main} />
                </Avatar>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {t('hero.totalAssets')}
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={700} color="success.main" sx={{ lineHeight: 1.2 }}>
                {formatCurrency(animatedAssets)}
              </Typography>
            </Box>

            {/* Net Worth */}
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                background: alpha(theme.palette.primary.main, 0.08),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: alpha(theme.palette.primary.main, 0.12),
                    mr: 2,
                  }}
                >
                  <Iconify icon="solar:graph-up-bold" width={20} color={theme.palette.primary.main} />
                </Avatar>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {t('hero.netWorth')}
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight={700} color="primary.main" sx={{ lineHeight: 1.2 }}>
                {formatCurrency(animatedNetWorth)}
              </Typography>
            </Box>

            {/* Cash & Debt */}
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                background: alpha(theme.palette.info.main, 0.08),
                border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: alpha(theme.palette.info.main, 0.12),
                    mr: 2,
                  }}
                >
                  <Iconify icon="solar:cash-bold" width={20} color={theme.palette.info.main} />
                </Avatar>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {t('hero.totalCash')}
                </Typography>
              </Box>
              <Typography variant="h5" fontWeight={600} color="info.main" sx={{ lineHeight: 1.2 }}>
                {formatCurrency(totalCash)}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {t('hero.totalDebt')}: {formatCurrency(totalDebt)}
              </Typography>
            </Box>
          </Box>

          <style>{`
            @keyframes shimmer {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
          `}</style>
        </CardContent>
      </Card>
    </Fade>
  );
}