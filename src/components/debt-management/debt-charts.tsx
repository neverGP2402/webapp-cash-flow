import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Typography, useTheme, alpha } from '@mui/material';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DebtChart } from 'src/types/debt-management';

interface DebtChartsProps {
  charts: DebtChart[];
}

const COLORS = ['#1976d2', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function DebtCharts({ charts }: DebtChartsProps) {
  const { t } = useTranslation('debtManagement');
  const theme = useTheme();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(value));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  // Prepare data for debt vs paid chart
  const debtVsPaidData = charts.map((item) => ({
    date: item.date,
    debt: item.debt,
    paid: item.paid,
  }));

  // Prepare data for remaining debt chart
  const remainingDebtData = charts.map((item) => ({
    date: item.date,
    remaining: item.remaining,
  }));

  // Prepare data for debt distribution pie chart
  const debtDistributionData = charts.map((item, index) => ({
    name: formatDate(item.date),
    value: item.debt,
    color: COLORS[index % COLORS.length],
  }));

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

  if (charts.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        gap: 3,
        mb: 4,
      }}
    >
      {/* Debt vs Paid Chart */}
      <Card
        sx={{
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
            {t('charts.debtVsPaid')}
          </Typography>
          <Box sx={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={debtVsPaidData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPaid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.1)} vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => formatDate(value)}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={chartTooltip} />
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
                  dataKey="debt"
                  name={t('charts.debtVsPaid')}
                  stroke={theme.palette.primary.main}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorDebt)"
                  animationDuration={1500}
                />
                <Area
                  type="monotone"
                  dataKey="paid"
                  name={t('charts.paid')}
                  stroke={theme.palette.success.main}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorPaid)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* Remaining Debt Chart */}
      <Card
        sx={{
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
            {t('charts.remainingDebt')}
          </Typography>
          <Box sx={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={remainingDebtData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.1)} vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => formatDate(value)}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={chartTooltip} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => (
                    <Typography variant="body2" color="text.secondary">
                      {value}
                    </Typography>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="remaining"
                  name={t('charts.remainingDebt')}
                  stroke={theme.palette.warning.main}
                  strokeWidth={3}
                  dot={{ fill: theme.palette.warning.main }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      {/* Debt Distribution Chart */}
      <Card
        sx={{
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          gridColumn: { xs: '1', lg: '1 / -1' },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
            {t('charts.debtDistribution')}
          </Typography>
          <Box sx={{ height: 300, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={debtDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {debtDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
