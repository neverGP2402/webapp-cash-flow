import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';

import {
  Card,
  CardContent,
  Box,
  Typography,
  useTheme,
  alpha,
  Skeleton,
} from '@mui/material';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import { Iconify } from 'src/components/iconify';

import type { CashFlowData } from 'src/types/financial-reports';

// ----------------------------------------------------------------------

interface CashFlowChartProps {
  data: CashFlowData[];
}

type TimeRange = '7days' | '30days' | '90days';

export function CashFlowChart({ data }: CashFlowChartProps) {
  const { t } = useTranslation('financialReports');
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState<TimeRange>('30days');

  const filteredData = useMemo(() => {
    const daysMap = {
      '7days': 7,
      '30days': 30,
      '90days': 90,
    };
    const daysToKeep = daysMap[timeRange];
    return data.slice(-daysToKeep);
  }, [data, timeRange]);

  const chartOptions = useMemo(() => {
    const formatCurrency = (value: number) => {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      }
      if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}K`;
      }
      return value.toString();
    };

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    };

    return {
      tooltip: {
        content: ({ active, payload, label }: any) => {
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
                  {formatDate(label)}
                </Typography>
                {payload.map((entry: any, index: number) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: entry.color,
                      }}
                    />
                    <Typography variant="body2">
                      {entry.name}: {new Intl.NumberFormat('vi-VN').format(Math.round(entry.value))}₫
                    </Typography>
                  </Box>
                ))}
              </Box>
            );
          }
          return null;
        },
      },
    };
  }, [theme]);

  return (
    <Card
      sx={{
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        height: '100%',
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
                background: alpha(theme.palette.primary.main, 0.1),
                mr: 2,
                color: theme.palette.primary.main,
              }}
            >
              <Iconify icon={'solar:graph-up-bold' as any} width={24} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {t('sections.cashFlow.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('sections.cashFlow.subtitle')}
              </Typography>
            </Box>
          </Box>

          {/* Time Range Selector */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {(['7days', '30days', '90days'] as TimeRange[]).map((range) => (
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

        {/* Chart */}
        <Box sx={{ height: 300, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.error.main} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={theme.palette.error.main} stopOpacity={0} />
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
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                  return value;
                }}
                tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={chartOptions.tooltip as any} />
              <Legend
                verticalAlign="top"
                height={36}
                formatter={(value) => (
                  <Typography variant="body2" color="text.secondary">
                    {value}
                  </Typography>
                )}
              />
              <Area
                type="monotone"
                dataKey="income"
                name={t('sections.cashFlow.income')}
                stroke={theme.palette.success.main}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorIncome)"
                animationDuration={1500}
              />
              <Area
                type="monotone"
                dataKey="expense"
                name={t('sections.cashFlow.expense')}
                stroke={theme.palette.error.main}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorExpense)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}