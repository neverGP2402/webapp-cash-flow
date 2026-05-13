import { useTranslation } from 'react-i18next';
import { Card, CardContent, Box, Typography, alpha, Avatar } from '@mui/material';
import { QuickInsight } from 'src/types/add-asset';

interface QuickInsightCardProps {
  insight: QuickInsight | null;
  loading?: boolean;
}

export default function QuickInsightCard({
  insight,
  loading
}: QuickInsightCardProps) {
  const { t } = useTranslation('add-asset');

  if (loading || !insight) {
    return null;
  }

  const insightConfig = {
    positive: {
      icon: '📈',
      gradient: `linear-gradient(135deg, ${alpha('#2e7d32', 0.08)} 0%, ${alpha('#2e7d32', 0.02)} 100%)`,
      borderColor: alpha('#2e7d32', 0.2),
      barColor: 'linear-gradient(90deg, #2e7d32 0%, #66bb6a 100%)',
      avatarBg: alpha('#2e7d32', 0.1)
    },
    negative: {
      icon: '📉',
      gradient: `linear-gradient(135deg, ${alpha('#d32f2f', 0.08)} 0%, ${alpha('#d32f2f', 0.02)} 100%)`,
      borderColor: alpha('#d32f2f', 0.2),
      barColor: 'linear-gradient(90deg, #d32f2f 0%, #ef5350 100%)',
      avatarBg: alpha('#d32f2f', 0.1)
    },
    neutral: {
      icon: '📊',
      gradient: `linear-gradient(135deg, ${alpha('#0288d1', 0.08)} 0%, ${alpha('#0288d1', 0.02)} 100%)`,
      borderColor: alpha('#0288d1', 0.2),
      barColor: 'linear-gradient(90deg, #0288d1 0%, #29b6f6 100%)',
      avatarBg: alpha('#0288d1', 0.1)
    }
  };

  const config = insightConfig[insight.type];

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: `1px solid ${config.borderColor}`,
        background: config.gradient,
        overflow: 'visible',
        position: 'relative'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: -1,
          left: -1,
          right: -1,
          height: 3,
          borderRadius: '3px 3px 0 0',
          background: config.barColor
        }}
      />
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: config.avatarBg,
              fontSize: 24,
              flexShrink: 0
            }}
          >
            {config.icon}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight={600}>
              {t('insight.title')}
            </Typography>
            <Typography variant="body1" fontWeight={600} color="text.primary">
              {insight.message}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}