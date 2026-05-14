import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

import {
  Card,
  CardContent,
  Box,
  Typography,
  LinearProgress,
  useTheme,
  alpha,
  Avatar,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { CategorySpending } from 'src/types/financial-reports';

// ----------------------------------------------------------------------

interface SpendingAnalysisProps {
  categories: CategorySpending[];
}

export function SpendingAnalysis({ categories }: SpendingAnalysisProps) {
  const { t } = useTranslation('financialReports');
  const theme = useTheme();

  const totalSpending = useMemo(() => {
    return categories.reduce((sum, cat) => sum + cat.amount, 0);
  }, [categories]);

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: alpha(theme.palette.warning.main, 0.1),
                mr: 2,
                color: theme.palette.warning.main,
              }}
            >
              <Iconify icon={'solar:pie-chart-bold' as any} width={24} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700}>
                {t('sections.spendingAnalysis.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(totalSpending)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Categories List */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {categories.slice(0, 5).map((category, index) => (
            <Box key={category.category.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1.5,
                      bgcolor: alpha(category.category.color, 0.12),
                      color: category.category.color,
                      mr: 2,
                    }}
                  >
                    <Iconify icon={category.category.icon as any} width={16} />
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight={600}>
                      {category.category.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {category.transactionCount} transactions
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" fontWeight={600}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(category.amount)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {category.percentage.toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={category.percentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: alpha(category.category.color, 0.12),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: `linear-gradient(90deg, ${category.category.color}, ${alpha(category.category.color, 0.7)})`,
                  },
                }}
              />
            </Box>
          ))}
        </Box>

        {/* View All Link */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography
            variant="body2"
            color="primary.main"
            fontWeight={600}
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            {t('sections.spendingAnalysis.viewAll')} →
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}