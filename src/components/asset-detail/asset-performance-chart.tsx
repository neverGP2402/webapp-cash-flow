import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  Box,
  Typography,
  ButtonGroup,
  Button,
  alpha,
  useTheme,
  Skeleton,
} from '@mui/material';

import { Chart } from 'src/components/chart';
import { Iconify } from 'src/components/iconify';

import type { AssetChartPoint, AssetChartPeriod } from 'src/types/asset-detail';

interface AssetPerformanceChartProps {
  chartData: AssetChartPoint[];
  selectedPeriod: AssetChartPeriod;
  onPeriodChange: (period: AssetChartPeriod) => void;
  isLoading?: boolean;
}

export function AssetPerformanceChart({ 
  chartData, 
  selectedPeriod, 
  onPeriodChange, 
  isLoading = false 
}: AssetPerformanceChartProps) {
  const { t } = useTranslation('assetDetail');
  const theme = useTheme();

  const periods: { value: AssetChartPeriod; label: string }[] = [
    { value: '7D', label: t('chart.filter.7D') },
    { value: '30D', label: t('chart.filter.30D') },
    { value: '90D', label: t('chart.filter.90D') },
    { value: '1Y', label: t('chart.filter.1Y') },
    { value: 'ALL', label: t('chart.filter.ALL') },
  ];

  const filteredData = useMemo(() => {
    if (!chartData.length) return [];
    
    const now = new Date();
    const filterMap = {
      '7D': 7,
      '30D': 30,
      '90D': 90,
      '1Y': 365,
      'ALL': Infinity,
    };

    const daysToFilter = filterMap[selectedPeriod];
    const cutoffDate = new Date(now.getTime() - daysToFilter * 24 * 60 * 60 * 1000);

    return chartData
      .filter(point => new Date(point.timestamp) >= cutoffDate)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [chartData, selectedPeriod]);

  const chartOptions = useMemo(() => ({
    chart: {
      type: 'area' as const,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
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
    colors: [theme.palette.primary.main],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth' as const,
      width: 3,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 90, 100],
        colorStops: [
          { offset: 0, color: alpha(theme.palette.primary.main, 0.4), opacity: 0.4 },
          { offset: 100, color: alpha(theme.palette.primary.main, 0.01), opacity: 0.01 },
        ],
      },
    },
    xaxis: {
      type: 'datetime' as const,
      labels: {
        format: 'dd/MM',
        style: {
          colors: theme.palette.text.secondary,
          fontSize: '11px',
          fontWeight: 500,
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => {
          if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
          }
          if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}K`;
          }
          return value.toString();
        },
        style: {
          colors: theme.palette.text.secondary,
          fontSize: '11px',
          fontWeight: 500,
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    tooltip: {
      theme: 'light' as const,
      x: {
        format: 'dd MMM yyyy',
        show: true,
      },
      y: {
        formatter: (value: number) => `${new Intl.NumberFormat('vi-VN').format(Math.round(value))}₫`,
        title: {
          formatter: () => t('chart.value'),
        },
      },
      style: {
        fontSize: '12px',
        fontWeight: 500,
      },
      marker: {
        show: true,
        size: 6,
        colors: [theme.palette.primary.main],
        strokeColor: theme.palette.background.paper,
        strokeWidth: 2,
      },
    },
    grid: {
      borderColor: alpha(theme.palette.divider, 0.08),
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    legend: {
      show: false,
    },
    markers: {
      size: 0,
      strokeWidth: 0,
      hover: {
        size: 6,
        sizeOffset: 3,
      },
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            height: 250,
          },
          xaxis: {
            labels: {
              rotate: -30,
            },
          },
        },
      },
    ],
  }), [theme, t]);

  const chartSeries = useMemo(() => {
    if (!filteredData.length) return [];

    return [
      {
        name: t('chart.value'),
        data: filteredData.map(point => ({
          x: new Date(point.timestamp).getTime(),
          y: point.value,
        })),
      },
    ];
  }, [filteredData, t]);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    if (!filteredData.length) return null;
    
    const firstValue = filteredData[0].value;
    const lastValue = filteredData[filteredData.length - 1].value;
    const change = lastValue - firstValue;
    const changePercent = ((change / firstValue) * 100);
    const highestValue = Math.max(...filteredData.map(d => d.value));
    const lowestValue = Math.min(...filteredData.map(d => d.value));
    
    return {
      change,
      changePercent,
      highestValue,
      lowestValue,
      currentValue: lastValue,
    };
  }, [filteredData]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(value));
  };

  if (isLoading) {
    return (
      <Card
        sx={{
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          height: 400,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Box>
                <Skeleton variant="text" width={150} height={28} sx={{ mb: 0.5 }} />
                <Skeleton variant="text" width={80} height={20} />
              </Box>
            </Box>
            <Skeleton variant="text" width={200} height={36} />
          </Box>
          <Skeleton variant="rectangular" width="100%" height={250} sx={{ borderRadius: 2 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: theme.palette.background.paper,
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: alpha(theme.palette.primary.main, 0.1),
                mr: 2,
                color: theme.palette.primary.main,
              }}
            >
              <Iconify icon={("solar:chart-square-bold" as any)} width={24} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {t('chart.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {periods.find(p => p.value === selectedPeriod)?.label}
              </Typography>
            </Box>
          </Box>

          {/* Period Filter */}
          <ButtonGroup 
            size="small" 
            variant="outlined"
            sx={{
              '& .MuiButtonGroup-grouped': {
                borderRadius: 2,
                px: 2,
                py: 1,
                fontWeight: 600,
                fontSize: '12px',
                textTransform: 'none',
              },
            }}
          >
            {periods.map((period) => (
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? 'contained' : 'text'}
                onClick={() => onPeriodChange(period.value)}
                sx={{
                  backgroundColor: selectedPeriod === period.value ? 'primary.main' : 'transparent',
                  color: selectedPeriod === period.value ? 'primary.contrastText' : 'text.secondary',
                  '&:hover': {
                    backgroundColor: selectedPeriod === period.value ? 'primary.dark' : alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                {period.label}
              </Button>
            ))}
          </ButtonGroup>
        </Box>

        {/* Summary Stats */}
        {summaryStats && (
          <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                {t('performance.currentValue')}
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {formatCurrency(summaryStats.currentValue)}₫
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Thay đổi
              </Typography>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                color={summaryStats.change >= 0 ? 'success.main' : 'error.main'}
              >
                {summaryStats.change >= 0 ? '+' : ''}{formatCurrency(summaryStats.change)}₫
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                % Thay đổi
              </Typography>
              <Typography 
                variant="h6" 
                fontWeight={700} 
                color={summaryStats.changePercent >= 0 ? 'success.main' : 'error.main'}
              >
                {summaryStats.changePercent >= 0 ? '+' : ''}{summaryStats.changePercent.toFixed(2)}%
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Cao nhất
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {formatCurrency(summaryStats.highestValue)}₫
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Thấp nhất
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {formatCurrency(summaryStats.lowestValue)}₫
              </Typography>
            </Box>
          </Box>
        )}

        {/* Chart */}
        <Box sx={{ height: 280, position: 'relative' }}>
          {filteredData.length > 0 ? (
            <Chart
              type="area"
              series={chartSeries}
              options={chartOptions}
              sx={{ height: '100%', width: '100%' }}
            />
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.palette.text.secondary,
              }}
            >
              <Iconify icon={("solar:chart-square-bold" as any)} width={48} sx={{ mb: 2, opacity: 0.3 }} />
              <Typography variant="body2" textAlign="center">
                {t('chart.noData')}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}