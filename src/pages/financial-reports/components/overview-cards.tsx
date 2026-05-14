import { useTranslation } from 'react-i18next';
import { useState, useEffect, useRef } from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { OverviewMetric } from 'src/types/financial-reports';

// ----------------------------------------------------------------------

interface OverviewCardsProps {
  metrics: OverviewMetric[];
}

// Animated number counter component
function AnimatedNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const requestRef = useRef<number>(undefined);
  const startTimeRef = useRef<number>(undefined);

  useEffect(() => {
    const animate = (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const progress = Math.min((time - startTimeRef.current) / duration, 1);
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(easeOut * value));

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      }
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [value, duration]);

  return (
    <span>
      {new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(displayValue)}
    </span>
  );
}

export function OverviewCards({ metrics }: OverviewCardsProps) {
  const { t } = useTranslation('financialReports');
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
        gap: 3,
        mb: 4,
      }}
    >
      {metrics.map((metric, index) => (
        <Paper
          key={metric.id}
          sx={{
            p: 3,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            background: `linear-gradient(135deg, ${alpha(metric.color, 0.05)}, ${alpha(metric.color, 0.02)})`,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 12px 32px ${alpha(metric.color, 0.15)}`,
            },
            animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2.5,
                backgroundColor: alpha(metric.color, 0.12),
                color: metric.color,
              }}
            >
              <Iconify icon={metric.icon as any} width={24} />
            </Avatar>

            {metric.trend !== 0 && (
              <Chip
                icon={
                  <Iconify
                    icon={(metric.trendDirection === 'up' ? 'solar:arrow-up-bold' : 'solar:arrow-down-bold') as any}
                    width={14}
                  />
                }
                label={`${Math.abs(metric.trend)}%`}
                size="small"
                color={metric.trendDirection === 'up' ? 'success' : 'error'}
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  height: 28,
                }}
              />
            )}
          </Box>

          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                mb: 0.5,
                color: metric.id === 'expense' || metric.id === 'debt' ? 'error.main' : 'text.primary',
              }}
            >
              <AnimatedNumber value={metric.value} />
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t(`overview.${metric.label}`)}
            </Typography>
          </Box>
        </Paper>
      ))}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
}