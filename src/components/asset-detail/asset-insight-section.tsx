import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  Box,
  Typography,
  alpha,
  useTheme,
  Fade,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { AssetInsight } from 'src/types/asset-detail';

interface AssetInsightSectionProps {
  insights: AssetInsight[];
  isLoading?: boolean;
}

export function AssetInsightSection({ insights, isLoading = false }: AssetInsightSectionProps) {
  const { t } = useTranslation('assetDetail');
  const theme = useTheme();

  const getInsightIcon = (type: AssetInsight['type']) => {
    switch (type) {
      case 'performance':
        return 'solar:chart-square-bold';
      case 'profit':
        return 'solar:trending-up-bold';
      case 'growth':
        return 'solar:rocket-bold';
      case 'comparison':
        return 'solar:scale-bold';
      case 'recommendation':
        return 'solar:lightbulb-bold';
      default:
        return 'solar:info-circle-bold';
    }
  };

  const getInsightColor = (type: AssetInsight['type']) => {
    switch (type) {
      case 'performance':
        return theme.palette.primary.main;
      case 'profit':
        return theme.palette.success.main;
      case 'growth':
        return theme.palette.info.main;
      case 'comparison':
        return theme.palette.warning.main;
      case 'recommendation':
        return theme.palette.secondary.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getPriorityColor = (priority: AssetInsight['priority']) => {
    switch (priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const formatValue = (value: number) => {
    return value.toLocaleString('vi-VN');
  };

  const renderInsightCard = (insight: AssetInsight) => (
    <Card
      key={insight.id}
      sx={{
        p: 2,
        borderRadius: 3,
        border: `1px solid ${alpha(getInsightColor(insight.type), 0.2)}`,
        background: alpha(getInsightColor(insight.type), 0.05),
        transition: 'all 0.3s ease',
        height: '100%',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[8],
          background: alpha(getInsightColor(insight.type), 0.08),
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: getPriorityColor(insight.priority),
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        },
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: alpha(getInsightColor(insight.type), 0.2),
              mr: 2,
              color: getInsightColor(insight.type),
              flexShrink: 0,
            }}
          >
            <Iconify icon={getInsightIcon(insight.type) as any} width={24} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mr: 1 }}>
                {insight.title}
              </Typography>
              <Chip
                label={insight.priority}
                size="small"
                sx={{
                  backgroundColor: alpha(getPriorityColor(insight.priority), 0.1),
                  color: getPriorityColor(insight.priority),
                  fontSize: '10px',
                  fontWeight: 600,
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {insight.description}
            </Typography>
            
            {insight.value !== undefined && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="h6" fontWeight={700} color={getInsightColor(insight.type)}>
                  {formatValue(insight.value)}₫
                </Typography>
              </Box>
            )}
            
            {insight.percentage !== undefined && (
              <Typography variant="body1" fontWeight={600} color={getInsightColor(insight.type)}>
                {insight.percentage > 0 ? '+' : ''}{insight.percentage.toFixed(2)}%
              </Typography>
            )}
          </Box>
          
          {/* Action Button */}
          <Tooltip title="Xem chi tiết">
            <IconButton size="small" sx={{ ml: 1 }}>
              <Iconify icon={("solar:arrow-right-bold" as any)} width={16} />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Card
        sx={{
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          height: 300,
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

  if (insights.length === 0) {
    return (
      <Card
        sx={{
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <CardContent sx={{ p: 3, textAlign: 'center' }}>
          <Iconify icon={("solar:lightbulb-bold" as any)} width={48} sx={{ mb: 2, opacity: 0.3 }} />
          <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
            {t('insights.noInsights')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Chưa có thông tin phân tích nào cho tài sản này
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
              <Iconify icon={("solar:lightbulb-bold" as any)} width={24} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" fontWeight={600}>
                {t('insights.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {insights.length} thông tin chi tiết
              </Typography>
            </Box>
          </Box>

          {/* Insights Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
              gap: 2,
            }}
          >
            {insights.map(renderInsightCard)}
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
}
