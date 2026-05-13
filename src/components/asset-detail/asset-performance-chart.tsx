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
  Fade,
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
        easing: 'easeinout',
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
      theme.palette.success.main,
      theme.palette.error.main,
    ],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth' as const,
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      type: 'datetime' as const,
      labels: {
        format: 'dd/MM',
        style: {
          colors: theme.palette.text.secondary,
          fontSize: '12px',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `${(value / 1000000).toFixed(1)}M`,
        style: {
          colors: theme.palette.text.secondary,
          fontSize: '12px',
        },
      },
    },
    tooltip: {
      x: {
        format: 'dd MMM yyyy HH:mm',
      },
      y: {
        formatter: (value: number) => `${value.toLocaleString('vi-VN')}₫`,
      },
      theme: 'light',
      style: {
        fontSize: '12px',
      },
    },
    grid: {
      borderColor: alpha(theme.palette.divider, 0.1),
      strokeDashArray: 3,
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
    },
    legend: {
      show: true,
      position: 'top' as const,
      horizontalAlign: 'right' as const,
      labels: {
        colors: theme.palette.text.secondary,
        useSeriesColors: false,
      },
      markers: {
        size: 8,
        strokeWidth: 0,
        fillColors: [theme.palette.primary.main],
      },
    },
  }), [theme]);

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
      {
        name: t('chart.profit'),
        data: filteredData.map(point => ({
          x: new Date(point.timestamp).getTime(),
          y: point.profit,
        })),
      },
    ];
  }, [filteredData, t]);

  if (isLoading) {
    return (
      <Card
        sx={{
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          height: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {t('loading')}
        </Typography>
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
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
                <Typography variant="h6" fontWeight={600}>
                  {t('chart.title')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {periods.find(p => p.value === selectedPeriod)?.label}
                </Typography>
              </Box>
            </Box>

            {/* Period Filter */}
            <ButtonGroup size="small">
              {periods.map((period) => (
                <Button
                  key={period.value}
                  variant={selectedPeriod === period.value ? 'contained' : 'outlined'}
                  onClick={() => onPeriodChange(period.value)}
                  sx={{
                    px: 2,
                    py: 1,
                    fontSize: '12px',
                    fontWeight: 500,
                  }}
                >
                  {period.label}
                </Button>
              ))}
            </ButtonGroup>
          </Box>

          {/* Chart */}
          <Box sx={{ height: 300, position: 'relative' }}>
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
                  Không có dữ liệu cho khoảng thời gian này
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
}
