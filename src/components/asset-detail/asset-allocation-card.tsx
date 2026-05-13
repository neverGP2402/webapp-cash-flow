import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

import {
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  alpha,
  useTheme,
  Fade,
  CircularProgress,
} from '@mui/material';

import { Chart } from 'src/components/chart';
import { Iconify } from 'src/components/iconify';

import type { AssetAllocation } from 'src/types/asset-detail';

interface AssetAllocationCardProps {
  allocation: AssetAllocation;
  isLoading?: boolean;
}

export function AssetAllocationCard({ allocation, isLoading = false }: AssetAllocationCardProps) {
  const { t } = useTranslation('assetDetail');
  const theme = useTheme();
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      const timer = setInterval(() => {
        setAnimatedPercentage((prev) => {
          const next = prev + (allocation.allocationPercentage - prev) * 0.1;
          return Math.abs(next - allocation.allocationPercentage) < 0.1 ? allocation.allocationPercentage : next;
        });
      }, 50);

      return () => clearInterval(timer);
    }
  }, [allocation, isLoading]);

  const chartOptions = {
    chart: {
      type: 'donut' as const,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: 'easeinout' as const,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    colors: [
      theme.palette.primary.main,
      alpha(theme.palette.primary.main, 0.7),
      alpha(theme.palette.primary.main, 0.4),
      alpha(theme.palette.primary.main, 0.2),
      theme.palette.grey[300],
    ],
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: allocation.allocationPercentage.toFixed(1) + '%',
              fontSize: '24px',
              fontWeight: 700,
              color: theme.palette.text.primary,
            },
          },
        },
        expandOnClick: false,
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => `${value.toFixed(1)}%`,
      },
      theme: 'light',
      style: {
        fontSize: '12px',
      },
    },
    legend: {
      show: false,
    },
    states: {
      hover: {
        filter: {
          type: 'darken',
          value: 0.8,
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          plotOptions: {
            pie: {
              donut: {
                size: '65%',
              },
            },
          },
        },
      },
    ],
  };

  const chartSeries = [
    allocation.allocationPercentage,
    Math.max(0, 100 - allocation.allocationPercentage - 10),
    Math.max(0, 10),
  ].filter(val => val > 0);

  if (isLoading) {
    return (
      <Card
        sx={{
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          height: 280,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={60} />
      </Card>
    );
  }

  return (
    <Fade in={!isLoading} timeout={800}>
      <Card
        sx={{
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: alpha(theme.palette.primary.main, 0.1),
                mr: 2,
                color: theme.palette.primary.main,
              }}
            >
              <Iconify icon={("solar:pie-chart-2-bold" as any)} width={24} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={600}>
                {t('allocation.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('allocation.rank', { rank: allocation.rank, total: allocation.totalAssets })}
              </Typography>
            </Box>
          </Box>

          {/* Chart and Stats */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Donut Chart */}
            <Box sx={{ position: 'relative', width: 120, height: 120 }}>
              <Chart
                type="donut"
                series={chartSeries}
                options={chartOptions}
                sx={{ height: '100%', width: '100%' }}
              />
            </Box>

            {/* Stats */}
            <Box sx={{ flex: 1, ml: 3 }}>
              <Typography variant="h4" fontWeight={700} color="primary.main" sx={{ mb: 1 }}>
                {animatedPercentage.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t('allocation.portfolioPercentage', { percentage: animatedPercentage.toFixed(1) })}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {t('allocation.totalPortfolioValue')}
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {allocation.totalPortfolioValue.toLocaleString('vi-VN')}₫
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Giá trị tài sản
                </Typography>
                <Typography variant="body1" fontWeight={600} color="primary.main">
                  {allocation.assetValue.toLocaleString('vi-VN')}₫
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Progress Bar */}
          <Box sx={{ mt: 3 }}>
            <LinearProgress
              variant="determinate"
              value={animatedPercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                background: alpha(theme.palette.primary.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.dark, 0.8)})`,
                  borderRadius: 4,
                }
              }}
            />
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
}
