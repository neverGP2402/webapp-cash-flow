import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';

import {
  Card,
  CardContent,
  Box,
  Typography,
  useTheme,
  alpha,
} from '@mui/material';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { Iconify } from 'src/components/iconify';

import type { AssetGrowthData } from 'src/types/financial-reports';

// ----------------------------------------------------------------------

interface AssetGrowthChartProps {
  data: AssetGrowthData[];
}

type TimeRange = '30days' | '90days' | '1year';

export function AssetGrowthChart({ data }: AssetGrowthChartProps) {
  const { t } = useTranslation('financialReports');
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState<TimeRange>('90days');

  const filteredData = useMemo(() => {
    const daysMap = {
      '30days': 30,
      '90days': 90,
      '1year': 365,
    };
    const daysToKeep = daysMap[timeRange];
    return data.slice(-daysToKeep);
  }, [data, timeRange]);

  const stats = useMemo(() => {
    if (filteredData.length === 0) return null;

    const currentValue = filteredData[filteredData.length - 1].value;
    const startValue = filteredData[0].value;
    const change = currentValue - startValue;
    const changePercent = ((change / startValue) * 100);
    const highestValue = Math.max(...filteredData.map((d: AssetGrowthData) => d.value));
    const lowestValue = Math.min(...filteredData.map((d: AssetGrowthData) => d.value));

    return { currentValue, change, changePercent, highestValue, lowestValue };
  }, [filteredData]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: alpha(theme.palette.success.main, 0.1),
                mr: 2,
                color: theme.palette.success.main,
              }}
            >
              <Iconify icon={'solar:trend-up-bold' as any} width={24} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {t('sections.assetGrowth.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('sections.assetGrowth.subtitle')}
              </Typography>
            </Box>
          </Box>

          {/* Time Range Selector */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {(['30days', '90days', '1year'] as TimeRange[]).map((range) => (
              <Box
                key={range}
                onClick={() => setTimeRange(range)}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  bgcolor: timeRange === range ? 'primary.main' : 'transparent',
                  color: timeRange === range ? 'primary.contrastText' : 'text.secondary',
                  '&:hover': {
                    bgcolor: timeRange === range ? 'primary.dark' : alpha(theme.palette.primary.main, 0.08),
                  },
                }}
              >
                {t(`filters.${range}`)}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Stats Summary */}
        {stats && (
          <Box sx={{ display: 'flex', gap: 4, mb: 3, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                {t('sections.assetGrowth.currentValue')}
              </Typography>
              <Typography variant="h6" fontWeight={700} color="success.main">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(stats.currentValue)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                {t('sections.assetGrowth.change')}
              </Typography>
              <Typography variant="h6" fontWeight={700} color={stats.change >= 0 ? 'success.main' : 'error.main'}>
                {stats.change >= 0 ? '+' : ''}{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(stats.change)}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                {t('sections.assetGrowth.changePercent')}
              </Typography>
              <Typography variant="h6" fontWeight={700} color={stats.changePercent >= 0 ? 'success.main' : 'error.main'}>
                {stats.changePercent >= 0 ? '+' : ''}{stats.changePercent.toFixed(2)}%
              </Typography>
            </Box>
          </Box>
        )}

        {/* Chart */}
        <Box sx={{ height: 280, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorAssetValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={alpha(theme.palette.divider, 0.1)}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
                }}
                tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatCurrency}
                tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload, label }: any) => {
                  if (active && payload && payload.length) {
                    return (
                      <Box
                        sx={{
                          p: 2,
                          bgcolor: 'background.paper',
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 2,
                          boxShadow: theme.shadows[4],
                        }}
                      >
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                          {label && new Date(label).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(payload[0].value as number)}
                        </Typography>
                      </Box>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={theme.palette.success.main}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorAssetValue)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}