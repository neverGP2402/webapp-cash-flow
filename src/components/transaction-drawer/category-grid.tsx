import { useTranslation } from 'react-i18next';

import { Box, Typography, styled, alpha } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { Category, TransactionType } from 'src/types/transaction-drawer';

// ----------------------------------------------------------------------

interface CategoryGridProps {
  categories: Category[];
  selectedCategory: string;
  transactionType: TransactionType;
  onSelectCategory: (categoryId: string) => void;
}

const CategoryCard = styled(Box)<{ selected: boolean; color: string }>(({ theme, selected, color }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  border: `2px solid ${selected ? color : 'transparent'}`,
  backgroundColor: selected ? alpha(color, 0.1) : 'transparent',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  minHeight: 80,
  '&:hover': {
    backgroundColor: alpha(color, 0.05),
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  },
}));

const CategoryIcon = styled(Box)<{ color: string }>(({ theme, color }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  backgroundColor: color,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(1),
}));

const CategoryName = styled(Typography)<{ selected: boolean }>(({ theme, selected }) => ({
  fontSize: '0.875rem',
  fontWeight: selected ? 600 : 500,
  color: selected ? 'text.primary' : 'text.secondary',
  textAlign: 'center',
}));

// Mock categories data
const mockCategories: Category[] = [
  {
    id: 'food',
    name: 'Ăn uống',
    icon: 'solar:cart-3-bold',
    color: '#FF6B6B',
    type: 'expense',
  },
  {
    id: 'transport',
    name: 'Di chuyển',
    icon: 'solar:cart-3-bold',
    color: '#4ECDC4',
    type: 'expense',
  },
  {
    id: 'shopping',
    name: 'Mua sắm',
    icon: 'solar:cart-3-bold',
    color: '#FFD93D',
    type: 'expense',
  },
  {
    id: 'entertainment',
    name: 'Giải trí',
    icon: 'solar:cart-3-bold',
    color: '#6C63FF',
    type: 'expense',
  },
  {
    id: 'salary',
    name: 'Lương',
    icon: 'solar:cart-3-bold',
    color: '#4ECDC4',
    type: 'income',
  },
  {
    id: 'freelance',
    name: 'Freelance',
    icon: 'solar:cart-3-bold',
    color: '#6C63FF',
    type: 'income',
  },
  {
    id: 'investment',
    name: 'Đầu tư',
    icon: 'solar:cart-3-bold',
    color: '#FFD93D',
    type: 'expense',
  },
  {
    id: 'bills',
    name: 'Hóa đơn',
    icon: 'solar:cart-3-bold',
    color: '#FF6B6B',
    type: 'expense',
  },
];

// ----------------------------------------------------------------------

export function CategoryGrid({ categories, selectedCategory, transactionType, onSelectCategory }: CategoryGridProps) {
  const { t } = useTranslation('common');

  // Filter categories by transaction type
  const filteredCategories = categories.length > 0 
    ? categories.filter(cat => cat.type === transactionType)
    : mockCategories.filter(cat => cat.type === transactionType);

  const handleCategorySelect = (categoryId: string) => {
    onSelectCategory(categoryId);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
        {t('transactionHistory.filterByCategory')}
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 2 }}>
        {filteredCategories.map((category) => (
          <CategoryCard
            key={category.id}
            selected={selectedCategory === category.id}
            color={category.color}
            onClick={() => handleCategorySelect(category.id)}
          >
            <CategoryIcon color={category.color}>
              <Iconify icon="solar:cart-3-bold" width={20} />
            </CategoryIcon>
            
            <CategoryName selected={selectedCategory === category.id}>
              {category.name}
            </CategoryName>
          </CategoryCard>
        ))}
      </Box>
    </Box>
  );
}
