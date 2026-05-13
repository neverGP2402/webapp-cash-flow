import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  Box,
  Typography,
  alpha,
  useTheme,
  Fade,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { AssetTimelineEvent } from 'src/types/asset-detail';

interface AssetTimelineProps {
  events: AssetTimelineEvent[];
  isLoading?: boolean;
}

export function AssetTimeline({ events, isLoading = false }: AssetTimelineProps) {
  const { t } = useTranslation('assetDetail');
  const theme = useTheme();

  const getEventIcon = (type: AssetTimelineEvent['type']) => {
    switch (type) {
      case 'buy':
        return 'solar:cart-add-bold';
      case 'sell':
        return 'solar:cart-remove-bold';
      case 'price_update':
        return 'solar:refresh-circle-bold';
      case 'transfer':
        return 'solar:arrow-right-up-bold';
      case 'profit_distribution':
        return 'solar:gift-bold';
      default:
        return 'solar:info-circle-bold';
    }
  };

  const getEventColor = (type: AssetTimelineEvent['type']) => {
    switch (type) {
      case 'buy':
        return theme.palette.success.main;
      case 'sell':
        return theme.palette.error.main;
      case 'price_update':
        return theme.palette.info.main;
      case 'transfer':
        return theme.palette.warning.main;
      case 'profit_distribution':
        return theme.palette.secondary.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const groupEventsByTime = (events: AssetTimelineEvent[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      today: events.filter(event => new Date(event.timestamp) >= today),
      yesterday: events.filter(event => {
        const eventDate = new Date(event.timestamp);
        return eventDate >= yesterday && eventDate < today;
      }),
      thisWeek: events.filter(event => {
        const eventDate = new Date(event.timestamp);
        return eventDate >= thisWeek && eventDate < yesterday;
      }),
      thisMonth: events.filter(event => {
        const eventDate = new Date(event.timestamp);
        return eventDate >= thisMonth && eventDate < thisWeek;
      }),
      older: events.filter(event => new Date(event.timestamp) < thisMonth),
    };
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('vi-VN');
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      return 'Vừa xong';
    } else if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const groupedEvents = groupEventsByTime(events);

  const renderEventItem = (event: AssetTimelineEvent) => (
    <Box
      key={event.id}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        py: 2,
        px: 2,
        borderRadius: 2,
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: alpha(theme.palette.action.hover, 0.04),
        },
      }}
    >
      {/* Event Icon */}
      <Box
        sx={{
          p: 1,
          borderRadius: 2,
          background: alpha(getEventColor(event.type), 0.1),
          mr: 2,
          color: getEventColor(event.type),
          flexShrink: 0,
        }}
      >
        <Iconify icon={getEventIcon(event.type) as any} width={20} />
      </Box>

      {/* Event Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Typography variant="body2" fontWeight={600} sx={{ mr: 1 }}>
            {event.title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDateTime(event.timestamp)}
          </Typography>
        </Box>

        {event.amount && (
          <Typography variant="body1" fontWeight={700} color="primary.main" sx={{ mb: 0.5 }}>
            {formatAmount(event.amount)}₫
          </Typography>
        )}

        {event.quantity && event.price && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {event.quantity.toLocaleString('vi-VN')} × {formatAmount(event.price)}₫
          </Typography>
        )}

        {event.wallet && (
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
            Ví: {event.wallet}
          </Typography>
        )}

        {event.note && (
          <Typography variant="caption" color="text.secondary">
            {event.note}
          </Typography>
        )}
      </Box>

      {/* Action Button */}
      <Tooltip title="Xem chi tiết">
        <IconButton size="small" sx={{ ml: 1 }}>
          <Iconify icon="solar:eye-bold" width={16} />
        </IconButton>
      </Tooltip>
    </Box>
  );

  const renderEventGroup = (title: string, events: AssetTimelineEvent[]) => {
    if (events.length === 0) return null;

    return (
      <Box key={title} sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 2, px: 2 }}>
          {title}
        </Typography>
        {events.map(renderEventItem)}
        {events.length < groupedEvents.older.length && <Divider sx={{ my: 2 }} />}
      </Box>
    );
  };

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

  if (events.length === 0) {
    return (
      <Card
        sx={{
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <Iconify icon={("solar:clock-circle-bold" as any)} width={48} sx={{ mb: 2, opacity: 0.3 }} />
          <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
            {t('timeline.noEvents')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Chưa có hoạt động nào cho tài sản này
          </Typography>
        </CardContent>
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
              <Iconify icon={("solar:clock-circle-bold" as any)} width={24} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={600}>
                {t('timeline.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {events.length} hoạt động
              </Typography>
            </Box>
          </Box>

          {/* Timeline Events */}
          <Box sx={{ maxHeight: 500, overflowY: 'auto' }}>
            {renderEventGroup(t('timeline.today'), groupedEvents.today)}
            {renderEventGroup(t('timeline.yesterday'), groupedEvents.yesterday)}
            {renderEventGroup(t('timeline.thisWeek'), groupedEvents.thisWeek)}
            {renderEventGroup(t('timeline.thisMonth'), groupedEvents.thisMonth)}
            {renderEventGroup(t('timeline.older'), groupedEvents.older)}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
}
