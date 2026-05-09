import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import { Icon } from '@iconify/react';
import { AnalyticsNews } from 'src/sections/overview/analytics-news';
import { _posts, _tasks, _traffic, _timeline } from 'src/_mock';

// ----------------------------------------------------------------------

interface AssetCategory {
  name: string;
  icon: string;
  amount: number;
  change: number;
  value: string;
}

export function AssetCategories() {
  const categories: AssetCategory[] = [
    {
      name: 'Tiền mặt',
      icon: 'mdi:cash',
      amount: 25000000,
      change: 2.5,
      value: '25.000.000 đ'
    },
    {
      name: 'Ngân hàng',
      icon: 'mdi:bank',
      amount: 45000000,
      change: 1.8,
      value: '45.000.000 đ'
    },
    {
      name: 'Vàng',
      icon: 'mdi:gold',
      amount: 15000000,
      change: -1.2,
      value: '15.000.000 đ'
    },
    {
      name: 'Crypto',
      icon: 'mdi:bitcoin',
      amount: 12000000,
      change: 8.7,
      value: '12.000.000 đ'
    },
    {
      name: 'Tài sản khác',
      icon: 'mdi:package-variant',
      amount: 28000000,
      change: 0.5,
      value: '28.000.000 đ'
    }
  ];

  return (
    <>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.0.08)',
          p: 3,
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Danh mục tài sản
          </Typography>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {categories.map((category, index) => (
              <Box
                key={index}
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
                  p: 2,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Icon 
                      icon={category.icon} 
                      style={{ 
                        fontSize: 32, 
                        marginRight: 12,
                        color: category.change > 0 ? '#4caf50' : '#f44336'
                      }} 
                    />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {category.name}
                      </Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {category.value}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Số lượng
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {category.amount.toLocaleString('vi-VN')} đ
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Thay đổi
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Icon 
                        icon={category.change > 0 ? 'mdi:trending-up' : 'mdi:trending-down'} 
                        style={{ 
                          fontSize: 16, 
                          marginRight: 4,
                          color: category.change > 0 ? '#4caf50' : '#f44336'
                        }} 
                      />
                      <Typography 
                        variant="body1" 
                        fontWeight="medium"
                        sx={{ color: category.change > 0 ? '#4caf50' : '#f44336' }}
                      >
                        {category.change > 0 ? '+' : ''}{category.change}%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Box>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Grid size={{ xs: 12 }} sx={{ mt: 3 }}>
        <AnalyticsNews title="Danh sách chi tiết" list={_posts.slice(0, 5)} />
      </Grid>
    </>
  );
}
