import { Card, CardContent, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
}

export function RecentTransactions() {
  const transactions: Transaction[] = [
    {
      id: '1',
      title: 'Lương tháng 10',
      amount: 25000000,
      type: 'income',
      date: '01/10/2024',
      category: 'Thu nhập'
    },
    {
      id: '2',
      title: 'Mua sắm RTX 4070',
      amount: -12000000,
      type: 'expense',
      date: '28/10/2024',
      category: 'Điện tử'
    },
    {
      id: '3',
      title: 'Dividend cổ phiếu',
      amount: 5000000,
      type: 'income',
      date: '30/10/2024',
      category: 'Đầu tư'
    },
    {
      id: '4',
      title: 'Đi ăn nhà hàng',
      amount: -3500000,
      type: 'expense',
      date: '02/11/2024',
      category: 'Ăn uống'
    },
    {
      id: '5',
      title: 'Bán vàng',
      amount: 8000000,
      type: 'income',
      date: '05/11/2024',
      category: 'Tài sản'
    }
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
          Hoạt động gần đây
        </Typography>
        <List sx={{ p: 0 }}>
          {transactions.map((transaction) => (
            <ListItem
              key={transaction.id}
              sx={{
                borderRadius: 2,
                mb: 1,
                borderLeft: `3px solid ${transaction.type === 'income' ? '#4caf50' : '#f44336'}`,
                backgroundColor: 'rgba(0,0,0,0.02)',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateX(4px)',
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box sx={{ mr: 2 }}>
                  <Icon 
                    icon={transaction.type === 'income' ? 'mdi:arrow-down-circle' : 'mdi:arrow-up-circle'} 
                    style={{ 
                      fontSize: 20, 
                      color: transaction.type === 'income' ? '#4caf50' : '#f44336'
                    }} 
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {transaction.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {transaction.category} • {transaction.date}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography 
                      variant="body1" 
                      fontWeight="medium"
                      sx={{ 
                        color: transaction.type === 'income' ? '#4caf50' : '#f44336' 
                      }}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {Math.abs(transaction.amount).toLocaleString('vi-VN')} đ
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
