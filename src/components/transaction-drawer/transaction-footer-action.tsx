import { useTranslation } from 'react-i18next';

import { Box, Button, styled, alpha } from '@mui/material';

import type { TransactionDrawerState, ValidationErrors } from 'src/types/transaction-drawer';

// ----------------------------------------------------------------------

interface TransactionFooterActionProps {
  state: TransactionDrawerState;
  onCancel: () => void;
  onSave: () => void;
  onValidate: () => void;
}

const FooterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(3),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  position: 'sticky',
  bottom: 0,
  left: 0,
  right: 0,
}));

const CancelButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
  borderColor: theme.palette.divider,
  '&:hover': {
    backgroundColor: alpha(theme.palette.action.hover, 0.04),
  },
}));

const SaveButton = styled(Button)(({ theme }) => ({
  fontWeight: 600,
  '&:disabled': {
    color: theme.palette.action.disabled,
    backgroundColor: alpha(theme.palette.action.disabled, 0.12),
    borderColor: 'transparent',
  },
}));

// ----------------------------------------------------------------------

export function TransactionFooterAction({ state, onCancel, onSave, onValidate }: TransactionFooterActionProps) {
  const { t } = useTranslation();

  const hasErrors = Object.keys(state.errors).length > 0;
  const isFormValid = state.formData && state.formData.amount > 0 && 
                    state.formData.categoryId && 
                    state.formData.walletId && 
                    state.formData.date;

  return (
    <FooterContainer>
      <CancelButton
        variant="outlined"
        onClick={onCancel}
        disabled={state.isSubmitting}
      >
        {t('common.optional')}
      </CancelButton>
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onValidate}
          disabled={state.isSubmitting}
          sx={{ minWidth: 120 }}
        >
          {t('common.required')}
        </Button>
        
        <SaveButton
          variant="contained"
          onClick={onSave}
          disabled={!isFormValid || state.isSubmitting}
          sx={{ minWidth: 120 }}
        >
          {state.isSubmitting ? t('common.loading') : 'Lưu giao dịch'}
        </SaveButton>
      </Box>
    </FooterContainer>
  );
}
