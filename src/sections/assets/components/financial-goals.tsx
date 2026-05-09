import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

export function FinancialGoals() {
  const currentAmount = 85000000; // 85 triệu VND
  const targetAmount = 100000000; // 100 triệu VND
  const progress = (currentAmount / targetAmount) * 100;

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0,0,0,0.0.08)',
        p: 3,
        height: '100%',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon 
            icon="mdi:target" 
            style={{ 
              fontSize: 32, 
              marginRight: 12,
              color: '#667eea'
            }} 
          />
          <Typography variant="h6" fontWeight="bold">
            Mục tiêu tài chính
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Mục tiêu năm 2024
          </Typography>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {targetAmount.toLocaleString('vi-VN')} đ
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Tiến độ
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#667eea',
                borderRadius: 6,
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {progress.toFixed(1)}% hoàn thành
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {currentAmount.toLocaleString('vi-VN')} đ
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Còn lại để đạt mục tiêu
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="#667eea">
            {(targetAmount - currentAmount).toLocaleString('vi-VN')} đ
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
