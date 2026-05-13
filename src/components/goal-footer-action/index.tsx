import { useTranslation } from 'react-i18next';

import {
  Box,
  Button,
  useTheme,
  alpha,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface GoalFooterActionProps {
  onCancel: () => void;
  onSubmit: () => void;
  isValid: boolean;
}

export function GoalFooterAction({ onCancel, onSubmit, isValid }: GoalFooterActionProps) {
  const { t } = useTranslation('common');
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 3,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        background: 'white',
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          size="large"
          onClick={onCancel}
          sx={{
            flex: 1,
            borderRadius: 3,
            py: 1.5,
            borderColor: alpha(theme.palette.divider, 0.5),
            color: 'text.secondary',
            '&:hover': {
              borderColor: alpha(theme.palette.divider, 0.8),
              background: alpha(theme.palette.action.hover, 0.04),
            }
          }}
        >
          {t('financialGoals.createGoal.cancel')}
        </Button>

        <Button
          variant="contained"
          size="large"
          onClick={onSubmit}
          disabled={!isValid}
          startIcon={<Iconify icon="solar:check-circle-bold" width={20} />}
          sx={{
            flex: 2,
            borderRadius: 3,
            py: 1.5,
            background: isValid
              ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
              : alpha(theme.palette.action.disabled, 0.1),
            color: isValid ? 'white' : alpha(theme.palette.text.secondary, 0.5),
            boxShadow: isValid
              ? `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`
              : 'none',
            '&:hover': {
              background: isValid
                ? `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                : alpha(theme.palette.action.hover, 0.1),
              boxShadow: isValid
                ? `0 12px 32px ${alpha(theme.palette.primary.main, 0.4)}`
                : `0 4px 12px ${alpha(theme.palette.action.hover, 0.15)}`,
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {t('financialGoals.createGoal.createGoal')}
        </Button>
      </Box>
    </Box>
  );
}
