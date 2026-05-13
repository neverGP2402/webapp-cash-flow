import { useTranslation } from 'react-i18next';

import { Box, Typography, IconButton, Card, CardContent, TextField, styled, alpha } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { TransactionDetailItem } from 'src/types/transaction-drawer';

// ----------------------------------------------------------------------

interface TransactionDetailListProps {
  items: TransactionDetailItem[];
  onChange: (items: TransactionDetailItem[]) => void;
}

const DetailItemCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1.5),
}));

const ItemRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(1.5, 0),
}));

const StyledTextField = styled(TextField)<{ InputProps?: any }>(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1),
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.75rem',
  },
}));

const AddButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  color: theme.palette.primary.main,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: theme.spacing(1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  },
}));

const DelButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.error.main, 0.1),
  color: theme.palette.error.main,
  border: `1px solid ${theme.palette.error.main}`,
  borderRadius: theme.spacing(1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  },
}));

// ----------------------------------------------------------------------

export function TransactionDetailList({ items, onChange }: TransactionDetailListProps) {
  const { t } = useTranslation('common');

  const handleItemChange = (index: number, field: keyof TransactionDetailItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto calculate total
    newItems[index].total = newItems[index].quantity * newItems[index].price;
    
    onChange(newItems);
  };

  const handleAddItem = () => {
    const newItem: TransactionDetailItem = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      price: 0,
      total: 0,
    };
    onChange([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
        {t('transactionHistory.productDetails')}
      </Typography>
      
      {items.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 4, border: `2px dashed alpha('#000', 0.1)` }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {t('transactionHistory.noProducts')}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        items.map((item, index) => (
          <DetailItemCard key={item.id}>
            <CardContent sx={{ p: 2 }}>
              <Box>
                {/* First row - Product name */}
                <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StyledTextField
                    fullWidth
                    label={t('transactionHistory.productName')}
                    value={item.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    size="small"
                    InputProps={{ min: 1 }}
                  />
                </Box>
                
                {/* Second row - Quantity, Unit Price, Total, Delete button */}
                <ItemRow>
                  
                  <Box sx={{ width: 80 }}>
                    <StyledTextField
                      label={t('transactionHistory.quantity')}
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                      size="small"
                      InputProps={{ min: 1 }}
                    />
                  </Box>
                  
                  <Box sx={{ width: 100 }}>
                    <StyledTextField
                      label={t('transactionHistory.unitPrice')}
                      type="number"
                      value={item.price}
                      onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value) || 0)}
                      size="small"
                      InputProps={{ min: 0 }}
                    />
                  </Box>
                  
                  <Box sx={{ width: 100 }}>
                    <StyledTextField
                      label={t('transactionHistory.total')}
                      value={formatCurrency(item.total)}
                      disabled
                      size="small"
                    />
                  </Box>
                  
                  <DelButton onClick={() => handleRemoveItem(index)} size="small" color='error'>
                    <Iconify icon="mingcute:close-line" width={16} />
                  </DelButton>
                </ItemRow>
              </Box>
            </CardContent>
          </DetailItemCard>
        ))
      )}
      
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <AddButton onClick={handleAddItem}>
          <Iconify icon="mingcute:add-line" width={20} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              {t('transactionHistory.addProduct')}
            </Typography>
        </AddButton>
      </Box>
    </Box>
  );
}
