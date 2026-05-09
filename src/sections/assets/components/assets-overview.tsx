import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

export function AssetsOverview() {
  const totalAssets = 125000000; // 125 triệu VND
  const monthlyChange = 5.2; // %
  const totalProfit = 8500000; // 8.5 triệu VND
  const totalDebt = 15000000; // 15 triệu VND
  const goalProgress = 68; // %

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        p: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
      }}
    >
      <CardContent>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Tổng quan tài sản
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h2" fontWeight="bold">
              {totalAssets.toLocaleString('vi-VN')} đ
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {monthlyChange > 0 ? (
                <Icon icon="mdi:trending-up" style={{ marginRight: 8, color: '#4caf50' }} />
              ) : (
                <Icon icon="mdi:trending-down" style={{ marginRight: 8, color: '#f44336' }} />
              )}
              <Typography variant="body1" sx={{ color: monthlyChange > 0 ? '#4caf50' : '#f44336' }}>
                {monthlyChange > 0 ? '+' : ''}{monthlyChange}% tháng này
              </Typography>
            </Box>
          </Box>
          
          <Icon icon="mdi:account-balance" style={{ fontSize: 40, opacity: 0.8 }} />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <Icon icon="mdi:chart-line" style={{ marginRight: 8, fontSize: 20 }} />
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Tổng lợi nhuận
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight="bold">
              +{totalProfit.toLocaleString('vi-VN')} đ
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
              Tổng công nợ
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {totalDebt.toLocaleString('vi-VN')} đ
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
              Mục tiêu tài chính
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {goalProgress}% hoàn thành
              </Typography>
              <LinearProgress
                variant="determinate"
                value={goalProgress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#4caf50',
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
