import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Box,
  Drawer,
  Typography,
  IconButton,
  styled,
  alpha,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import {
  TransactionTypeSelector,
  AmountInput,
  CategoryGrid,
  WalletSelector,
  TransactionInfoForm,
  BillUpload,
  TransactionDetailList,
  TransactionFooterAction,
} from './index';

import type {
  TransactionDrawerProps,
  TransactionFormData,
  TransactionDrawerMode,
  TransactionType,
  ValidationErrors,
  TransactionDrawerState,
  Category,
  Wallet,
} from 'src/types/transaction-drawer';

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 520;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    borderRadius: theme.spacing(2, 2, 0, 0),
  },
  '& .MuiBackdrop-root': {
    backgroundColor: 'transparent',
  },
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(3),
}));

const ScrollContainer = styled(Box)(({ theme }) => ({
  overflowY: 'auto',
  maxHeight: 'calc(100vh - 200px)',
  paddingRight: theme.spacing(1),
}));

// ----------------------------------------------------------------------

export function TransactionDrawer({ open, mode, transaction, onClose, onSave }: TransactionDrawerProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [formData, setFormData] = useState<TransactionFormData>(() => ({
    type: 'expense',
    amount: 0,
    categoryId: '',
    walletId: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    referenceCode: '',
    tags: [],
    detailItems: [],
  }));

  const [errors, setErrors] = useState<ValidationErrors>({});

  const [state, setState] = useState<TransactionDrawerState>({
    formData,
    errors,
    isSubmitting: false,
    isUploading: false,
  });

  // Reset form when opening in create mode
  useEffect(() => {
    if (open && mode === 'create') {
      const resetFormData: TransactionFormData = {
        type: 'expense',
        amount: 0,
        categoryId: '',
        walletId: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        referenceCode: '',
        tags: [],
        detailItems: [],
      };
      
      setFormData(resetFormData);
      setErrors({});
      setState({
        formData: resetFormData,
        errors: {},
        isSubmitting: false,
        isUploading: false,
      });
    }
  }, [open, mode]);

  // Load transaction data when opening in edit mode
  useEffect(() => {
    if (open && mode === 'edit' && transaction) {
      setFormData({
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        categoryId: transaction.categoryId,
        walletId: transaction.walletId,
        date: transaction.date,
        description: transaction.description || '',
        referenceCode: transaction.referenceCode || '',
        tags: transaction.tags || [],
        detailItems: transaction.detailItems || [],
      });
    }
  }, [open, mode, transaction]);

  const handleTypeChange = (type: TransactionType) => {
    setFormData({ ...formData, type });
    if (type !== formData.type) {
      setFormData({ ...formData, categoryId: '' });
    }
  };

  const handleAmountChange = (amount: number) => {
    setFormData({ ...formData, amount });
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData({ ...formData, categoryId });
  };

  const handleWalletChange = (walletId: string) => {
    setFormData({ ...formData, walletId });
  };

  const handleFormChange = (newData: Partial<TransactionFormData>) => {
    setFormData({ ...formData, ...newData });
  };

  const handleErrorsChange = (newErrors: ValidationErrors) => {
    setErrors(newErrors);
  };

  const handleValidate = () => {
    const newErrors: ValidationErrors = {};
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Số tiền phải lớn hơn 0';
    }
    
    if (!formData.categoryId) {
      newErrors.category = 'Vui lòng chọn danh mục';
    }
    
    if (!formData.walletId) {
      newErrors.wallet = 'Vui lòng chọn ví';
    }
    
    if (!formData.date) {
      newErrors.date = 'Vui lòng chọn ngày giao dịch';
    }
    
    setErrors(newErrors);
  };

  const handleSave = async () => {
    handleValidate();
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    setState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const getTitle = () => {
    if (mode === 'create') {
      return t('transactionHistory.pageTitle');
    }
    return t('transactionHistory.pageTitle');
  };

  const mockCategories: Category[] = [
    { id: 'food', name: 'Ăn uống', icon: 'solar:cart-3-bold', color: '#FF6B6B', type: 'expense' },
    { id: 'transport', name: 'Di chuyển', icon: 'solar:cart-3-bold', color: '#4ECDC4', type: 'expense' },
    { id: 'shopping', name: 'Mua sắm', icon: 'solar:cart-3-bold', color: '#FFD93D', type: 'expense' },
    { id: 'salary', name: 'Lương', icon: 'solar:cart-3-bold', color: '#4ECDC4', type: 'income' },
    { id: 'freelance', name: 'Freelance', icon: 'solar:cart-3-bold', color: '#6C63FF', type: 'income' },
  ];

  const mockWallets: Wallet[] = [
    { id: 'cash', name: 'Tiền mặt', type: 'cash', balance: 2500000, currency: 'VND', icon: 'solar:cart-3-bold', color: '#4ECDC4' },
    { id: 'bank', name: 'MB Bank', type: 'bank', balance: 15000000, currency: 'VND', icon: 'solar:cart-3-bold', color: '#1976D2' },
    { id: 'credit', name: 'Credit Card', type: 'credit', balance: 5000000, currency: 'VND', icon: 'solar:cart-3-bold', color: '#FF6B6B' },
  ];

  return (
    <StyledDrawer
      anchor="right"
      open={open}
      onClose={handleCancel}
      variant={isMobile ? 'temporary' : 'persistent'}
      PaperProps={{
        sx: {
          width: isMobile ? '100%' : DRAWER_WIDTH,
          maxWidth: '100vw',
        },
      }}
    >
      <HeaderContainer>
        <Typography variant="h6" fontWeight={600}>
          {getTitle()}
        </Typography>,
        <CloseButton onClick={handleCancel}>
          <Iconify icon="solar:cart-3-bold" width={24} />
        </CloseButton>
      </HeaderContainer>

      <ContentContainer>
        <ScrollContainer>
          <TransactionTypeSelector
            value={formData.type}
            onChange={handleTypeChange}
          />

          <Box sx={{ my: 4 }}>
            <AmountInput
              value={formData.amount}
              onChange={handleAmountChange}
              type={formData.type}
            />
          </Box>

          <CategoryGrid
            categories={mockCategories}
            selectedCategory={formData.categoryId}
            transactionType={formData.type}
            onSelectCategory={handleCategoryChange}
          />

          <WalletSelector
            wallets={mockWallets}
            selectedWallet={formData.walletId}
            onSelectWallet={handleWalletChange}
          />

          <TransactionInfoForm
            formData={formData}
            errors={errors}
            onChange={handleFormChange}
            onErrorsChange={handleErrorsChange}
          />

          <BillUpload
            image={formData.receiptImage}
            onImageChange={(image: File | null) => handleFormChange({ receiptImage: image })}
          />

          <TransactionDetailList
            items={formData.detailItems || []}
            onChange={(items) => handleFormChange({ detailItems: items })}
          />
        </ScrollContainer>
      </ContentContainer>

      <TransactionFooterAction
        state={state}
        onCancel={handleCancel}
        onSave={handleSave}
        onValidate={handleValidate}
      />
    </StyledDrawer>
  );
}
