import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

import {
  Card,
  CardContent,
  Box,
  Typography,
  alpha,
  useTheme,
  IconButton,
  Tooltip,
  Chip,
  Skeleton,
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
        return 'solar:restart-bold';
      case 'transfer':
        return 'eva:arrow-ios-forward-fill';
      case 'profit_distribution':
        return 'solar:coin-bold';
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

  const groupEventsByTime = (eventList: AssetTimelineEvent[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      today: eventList.filter(event => new Date(event.timestamp) >= today),
      yesterday: eventList.filter(event => {
        const eventDate = new Date(event.timestamp);
        return eventDate >= yesterday && eventDate < today;
      }),
      thisWeek: eventList.filter(event => {
        const eventDate = new Date(event.timestamp);
        return eventDate >= thisWeek && eventDate < yesterday;
      }),
      thisMonth: eventList.filter(event => {
        const eventDate = new Date(event.timestamp);
        return eventDate >= thisMonth && eventDate < thisWeek;
      }),
      older: eventList.filter(event => new Date(event.timestamp) < thisMonth),
    };
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(amount));
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return t('common.justNow');
    if (diffHours < 24) return t('common.ago', { time: `${diffHours} ${t('common.hours')}` });
    if (diffDays < 7) return t('common.ago', { time: `${diffDays} ${t('common.days')}` });
    
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const groupedEvents = useMemo(() => groupEventsByTime(events), [events]);

  const TimelineItem = ({ event, isLast }: { event: AssetTimelineEvent; isLast: boolean }) => (
    <Box
      sx={{
        display: 'flex',
        position: 'relative',
        pb: isLast ? 0 : 3,
      }}
    >
      {/* Timeline Line */}
      {!isLast && (
        <Box
          sx={{
            position: 'absolute',
            left: 19,
            top: 40,
            bottom: 0,
            width: 2,
            background: alpha(theme.palette.divider, 0.2),
          }}
        />
      )}

      {/* Timeline Dot */}
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 3,
          background: alpha(getEventColor(event.type), 0.12),
          color: getEventColor(event.type),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          mr: 2.5,
          position: 'relative',
          zIndex: 1,
          border: `2px solid ${theme.palette.background.paper}`,
          boxShadow: `0 0 0 2px ${alpha(getEventColor(event.type), 0.2)}`,
        }}
      >
        <Iconify icon={getEventIcon(event.type) as any} width={20} />
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0, pt: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
          <Box>
            <Typography variant="body1" fontWeight={600} sx={{ mb: 0.25 }}>
              {event.title}
            </Typography>
            <Chip
              label={t(`timeline.eventTypes.${event.type}`)}
              size="small"
              sx={{
                height: 22,
                fontSize: '11px',
                fontWeight: 600,
                backgroundColor: alpha(getEventColor(event.type), 0.1),
                color: getEventColor(event.type),
                borderRadius: 1,
              }}
            />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
            {formatDateTime(event.timestamp)}
          </Typography>
        </Box>

        {/* Event Details */}
        <Box sx={{ mt: 1.5, pl: 2, borderLeft: `2px solid ${alpha(getEventColor(event.type), 0.2)}` }}>
          {event.amount && (
            <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ mb: 0.5 }}>
              {formatAmount(event.amount)}₫
            </Typography>
          )}
          
          {event.quantity !== undefined && event.price && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {event.quantity.toLocaleString('vi-VN')} × {formatAmount(event.price)}₫
            </Typography>
          )}

          {event.wallet && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Iconify icon="solar:wallet-money-bold" width={14} sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {event.wallet}
              </Typography>
            </Box>
          )}

          {event.note && (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              {event.note}
            </Typography>
          )}
        </Box>

        {/* Action */}
        <Tooltip title={t('timeline.viewDetails')}>
          <IconButton size="small" sx={{ mt: 1 }}>
            <Iconify icon="eva:arrow-ios-forward-fill" width={16} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  const EventGroup = ({ title, eventList }: { title: string; eventList: AssetTimelineEvent[] }) => {
    if (eventList.length === 0) return null;

    return (
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="subtitle2" 
          fontWeight={700} 
          color="text.secondary" 
          sx={{ 
            mb: 2.5, 
            textTransform: 'uppercase', 
            letterSpacing: 0.5,
            fontSize: '12px',
          }}
        >
          {title}
        </Typography>
        {eventList.map((event, index) => (
          <TimelineItem 
            key={event.id} 
            event={event} 
            isLast={index === eventList.length - 1} 
          />
        ))}
      </Box>
    );
  };

  if (isLoading) {
    return (
      <Card
        sx={{
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width={150} height={28} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width={80} height={20} />
            </Box>
          </Box>
          {[...Array(3)].map((_, index) => (
            <Box key={index} sx={{ display: 'flex', mb: 3 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2.5 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width={200} height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width={150} height={20} />
              </Box>
            </Box>
          ))}
        </CardContent>
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
        <CardContent sx={{ p: 5, textAlign: 'center' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: alpha(theme.palette.primary.main, 0.08),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <Iconify icon="solar:clock-circle-outline" width={36} sx={{ color: alpha(theme.palette.primary.main, 0.4) }} />
          </Box>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
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
    <Card
      sx={{
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: alpha(theme.palette.primary.main, 0.1),
              mr: 2,
              color: theme.palette.primary.main,
            }}
          >
            <Iconify icon="solar:clock-circle-outline" width={24} />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700}>
              {t('timeline.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {events.length} hoạt động
            </Typography>
          </Box>
        </Box>

        {/* Timeline Events */}
        <Box sx={{ maxHeight: 600, overflowY: 'auto', pr: 1 }}>
          <EventGroup title={t('timeline.today')} eventList={groupedEvents.today} />
          <EventGroup title={t('timeline.yesterday')} eventList={groupedEvents.yesterday} />
          <EventGroup title={t('timeline.thisWeek')} eventList={groupedEvents.thisWeek} />
          <EventGroup title={t('timeline.thisMonth')} eventList={groupedEvents.thisMonth} />
          <EventGroup title={t('timeline.older')} eventList={groupedEvents.older} />
        </Box>
      </CardContent>
    </Card>
  );
}