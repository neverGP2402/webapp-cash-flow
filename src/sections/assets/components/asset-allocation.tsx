import { Card, CardContent, Typography, Box, List, ListItem, ListItemText, LinearProgress } from '@mui/material';
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

export function AssetAllocation() {
  const allocations = [
    { name: 'Tiền mặt', value: 20, color: '#4caf50' },
    { name: 'Ngân hàng', value: 36, color: '#2196f3' },
    { name: 'Vàng', value: 12, color: '#ffc107' },
    { name: 'Crypto', value: 10, color: '#9c27b0' },
    { name: 'Tài sản khác', value: 22, color: '#ff9800' },
  ];

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
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Phân bổ tài sản
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {allocations.map((allocation, index) => (
            <Box key={index}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: allocation.color,
                      marginRight: 1,
                    }}
                  />
                  <Typography variant="body1" fontWeight="medium">
                    {allocation.name}
                  </Typography>
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  {allocation.value}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={allocation.value}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: allocation.color,
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
