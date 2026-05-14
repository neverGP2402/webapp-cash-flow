import { useTranslation } from 'react-i18next';
import { Box, Typography, alpha, useTheme } from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { DebtAnalysis } from 'src/types/debt-management';

interface DrawerDebtAnalysisProps {
  analysis: DebtAnalysis;
}

export function DrawerDebtAnalysis({ analysis }: DrawerDebtAnalysisProps) {
  const { t } = useTranslation('debtManagement');
  const theme = useTheme();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(value));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const chartTooltip = ({ active, payload, label }: any) => {
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
                {entry.name}: {formatCurrency(entry.value)}₫
              </Typography>
            </Box>
          ))}
        </Box>
      );
    }
    return null;
  };

  const repaymentTrendData = analysis.repaymentTrend.map((item) => ({
    date: item.date,
    value: item.value,
  }));

  const remainingDebtData = analysis.remainingDebt.map((item) => ({
    date: item.date,
    value: item.value,
  }));

  const monthlyPaymentData = analysis.monthlyPayment.map((item) => ({
    date: item.date,
    value: item.value,
  }));

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        {t('drawer.analysis.title')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Repayment Trend */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: alpha('#000', 0.02),
            border: `1px solid ${alpha('#000', 0.06)}`,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
            {t('drawer.analysis.repaymentTrend')}
          </Typography>
          <Box sx={{ height: 200, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={repaymentTrendData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRepayment" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.1)} vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => formatDate(value)}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={chartTooltip} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={theme.palette.primary.main}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRepayment)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Remaining Debt */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: alpha('#000', 0.02),
            border: `1px solid ${alpha('#000', 0.06)}`,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
            {t('drawer.analysis.remainingDebt')}
          </Typography>
          <Box sx={{ height: 200, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={remainingDebtData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.1)} vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => formatDate(value)}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={chartTooltip} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={theme.palette.warning.main}
                  strokeWidth={2}
                  dot={{ fill: theme.palette.warning.main }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Monthly Payment */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: alpha('#000', 0.02),
            border: `1px solid ${alpha('#000', 0.06)}`,
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
            {t('drawer.analysis.monthlyPayment')}
          </Typography>
          <Box sx={{ height: 200, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyPaymentData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMonthly" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.1)} vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => formatDate(value)}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={chartTooltip} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={theme.palette.success.main}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorMonthly)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
