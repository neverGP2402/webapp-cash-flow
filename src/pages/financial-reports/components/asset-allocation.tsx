 import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';

import {
  Card,
  CardContent,
  Box,
  Typography,
  useTheme,
  alpha,
  Avatar,
  Chip,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { AssetAllocation as AssetAllocationType } from 'src/types/financial-reports';

// ----------------------------------------------------------------------

interface AssetAllocationProps {
  allocation: AssetAllocationType[];
}

export function AssetAllocation({ allocation }: AssetAllocationProps) {
  const { t } = useTranslation('financialReports');
  const theme = useTheme();
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  const totalValue = useMemo(() => {
    return allocation.reduce((sum, item) => sum + item.value, 0);
  }, [allocation]);

  const selectedAssetData = useMemo(() => {
    if (!selectedAsset) return null;
    return allocation.find((a) => a.assetType.id === selectedAsset);
  }, [allocation, selectedAsset]);

  // Colors for pie chart segments
  const colors = allocation.map((_, index) => {
    const baseColors = [
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.primary.main,
      theme.palette.grey[500],
    ];
    return baseColors[index % baseColors.length];
  });

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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: alpha(theme.palette.info.main, 0.1),
              mr: 2,
              color: theme.palette.info.main,
            }}
          >
            <Iconify icon={'solar:chart-bold' as any} width={24} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {t('sections.assetAllocation.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(totalValue)}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          {/* Asset List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {allocation.map((item, index) => (
              <Box
                key={item.assetType.id}
                onClick={() => setSelectedAsset(item.assetType.id === selectedAsset ? null : item.assetType.id)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  bgcolor: selectedAsset === item.assetType.id ? alpha(colors[index], 0.08) : 'transparent',
                  border: `1px solid ${selectedAsset === item.assetType.id ? alpha(colors[index], 0.3) : 'transparent'}`,
                  '&:hover': {
                    bgcolor: alpha(colors[index], 0.05),
                  },
                }}
              >
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: colors[index],
                    mr: 2,
                  }}
                />
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1.5,
                    bgcolor: alpha(colors[index], 0.12),
                    color: colors[index],
                    mr: 2,
                  }}
                >
                  <Iconify icon={item.assetType.icon as any} width={18} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {t(`sections.assetAllocation.${item.assetType.id}`) || item.assetType.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Intl.NumberFormat('vi-VN').format(Math.round(item.value / 1000000))}M ₫
                  </Typography>
                </Box>
                <Chip
                  label={`${item.percentage.toFixed(1)}%`}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    bgcolor: alpha(colors[index], 0.12),
                    color: colors[index],
                    height: 24,
                  }}
                />
              </Box>
            ))}
          </Box>

          {/* Visual Representation */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {/* Simple bar visualization instead of pie chart for simplicity */}
            <Box sx={{ width: '100%', maxWidth: 200 }}>
              {allocation.map((item, index) => (
                <Box key={item.assetType.id} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: colors[index],
                      mr: 1,
                    }}
                  />
                  <Box
                    sx={{
                      flex: 1,
                      height: 12,
                      borderRadius: 6,
                      bgcolor: alpha(colors[index], 0.2),
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        width: `${item.percentage}%`,
                        bgcolor: colors[index],
                        borderRadius: 6,
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1, minWidth: 40, textAlign: 'right' }}>
                    {item.percentage.toFixed(0)}%
                  </Typography>
                </Box>
              ))}
            </Box>

            {selectedAssetData && (
              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.background.default, 0.5),
                  width: '100%',
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                  {t(`sections.assetAllocation.${selectedAssetData.assetType.id}`) || selectedAssetData.assetType.name}
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(selectedAssetData.value)}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}