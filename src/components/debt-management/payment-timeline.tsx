import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Typography, alpha, Avatar, Chip } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { DebtTimelineItem } from 'src/types/debt-management';

interface PaymentTimelineProps {
  timeline: DebtTimelineItem[];
}

export function PaymentTimeline({ timeline }: PaymentTimelineProps) {
  const { t } = useTranslation('debtManagement');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t('timeline.today') || 'Hôm nay';
    if (diffDays === 1) return t('timeline.yesterday') || 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ${t('timeline.daysAgo') || 'ngày trước'}`;

    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getTimelineIcon = (type: DebtTimelineItem['type'], status: DebtTimelineItem['status']) => {
    if (type === 'payment') {
      return status === 'completed' ? 'solar:check-circle-bold' : 'solar:clock-circle-bold';
    }
    if (type === 'due') {
      return status === 'overdue' ? 'solar:danger-circle-bold' : 'solar:info-circle-bold';
    }
    return 'solar:bell-bold';
  };

  const getTimelineColor = (type: DebtTimelineItem['type'], status: DebtTimelineItem['status']) => {
    if (type === 'payment' && status === 'completed') return '#22c55e';
    if (type === 'payment' && status === 'pending') return '#f59e0b';
    if (type === 'due' && status === 'overdue') return '#ef4444';
    if (type === 'due' && status === 'pending') return '#3b82f6';
    return '#8b5cf6';
  };

  const groupedTimeline = timeline.reduce((acc, item) => {
    const dateKey = new Date(item.date).toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(item);
    return acc;
  }, {} as Record<string, DebtTimelineItem[]>);

  if (timeline.length === 0) {
    return (
      <Card
        sx={{
          borderRadius: 3,
          border: `1px solid ${alpha('#000', 0.06)}`,
          p: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="body1" color="text.secondary">
          {t('timeline.noPayments') || 'Chưa có thanh toán nào'}
        </Typography>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: `1px solid ${alpha('#000', 0.06)}`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
          {t('timeline.title')}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {Object.entries(groupedTimeline).map(([dateKey, items]) => (
            <Box key={dateKey}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 600 }}>
                {formatDate(dateKey)}
              </Typography>
              {items.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: alpha(getTimelineColor(item.type, item.status), 0.05),
                    border: `1px solid ${alpha(getTimelineColor(item.type, item.status), 0.1)}`,
                    mb: 1.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: alpha(getTimelineColor(item.type, item.status), 0.08),
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: alpha(getTimelineColor(item.type, item.status), 0.15),
                      flexShrink: 0,
                    }}
                  >
                    <Iconify
                      icon={getTimelineIcon(item.type, item.status) as any}
                      width={20}
                      color={getTimelineColor(item.type, item.status)}
                    />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {item.debt.counterparty.name}
                      </Typography>
                      <Typography variant="body2" fontWeight={700} color={getTimelineColor(item.type, item.status)}>
                        {formatCurrency(item.amount)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {item.type === 'payment' ? t('timeline.payment') : t('timeline.due')}
                      </Typography>
                      <Chip
                        label={item.status === 'completed' ? t('status.paid') : item.status === 'overdue' ? t('status.overdue') : t('status.pending')}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: 10,
                          bgcolor: alpha(getTimelineColor(item.type, item.status), 0.1),
                          color: getTimelineColor(item.type, item.status),
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    {item.note && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {item.note}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
