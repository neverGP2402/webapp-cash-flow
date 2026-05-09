import { Card, CardContent, Typography, Box } from '@mui/material';
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

interface Insight {
  title: string;
  value: string;
  icon: string;
  color: string;
  trend?: 'up' | 'down';
}

export function AssetInsights() {
  const insights: Insight[] = [
    {
      title: 'Khoản chi lớn nhất',
      value: '12.000.000 đ',
      icon: 'mdi:cash-minus',
      color: '#f44336',
      trend: 'down'
    },
    {
      title: 'Tài sản tăng mạnh nhất',
      value: 'Crypto +15.2%',
      icon: 'mdi:trending-up',
      color: '#4caf50',
      trend: 'up'
    },
    {
      title: 'Hiệu quả tiết kiệm tháng này',
      value: 'Đạt 85% mục tiêu',
      icon: 'mdi:piggy-bank',
      color: '#667eea',
      trend: 'up'
      
    }
  ];

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.0.08)',
        p: 3,
      }}
    >
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Thông tin tài chính
        </Typography>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {insights.map((insight, index) => (
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
                    icon={insight.icon} 
                    style={{ 
                      fontSize: 24, 
                      marginRight: 12,
                      color: insight.color
                    }} 
                  />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {insight.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      {insight.trend && (
                        <Icon 
                          icon={insight.trend === 'up' ? 'mdi:trending-up' : 'mdi:trending-down'} 
                          style={{ 
                            fontSize: 16, 
                            marginRight: 4,
                            color: insight.color
                          }} 
                        />
                      )}
                      <Typography variant="h6" fontWeight="bold">
                        {insight.value}
                      </Typography>
                    </Box>
                    
                    <Typography 
                      variant="subtitle2" 
                      color="primary" 
                      sx={{ 
                        cursor: 'pointer',
                        textDecoration: 'none',
                        fontStyle: 'italic',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                      onClick={() => console.log(`View details for ${insight.title}`)}
                    >
                      {'Chi tiết'}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Box>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
