import { useTranslation } from 'react-i18next';

import {
  Box,
  Typography,
  Button,
  useTheme,
  alpha,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface EmptyGoalStateProps {
  onCreateGoal: () => void;
}

export function EmptyGoalState({ onCreateGoal }: EmptyGoalStateProps) {
  const { t } = useTranslation('common');
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        textAlign: 'center',
        py: 4,
      }}
    >
      {/* Illustration */}
      <Box
        sx={{
          mb: 4,
          position: 'relative',
          width: 200,
          height: 200,
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.dark, 0.2)})`,
            border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }}
        >
          <Iconify 
            icon="solar:check-circle-bold" 
            width={80} 
            color={alpha(theme.palette.primary.main, 0.6)}
          />
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ maxWidth: 400, mx: 'auto' }}>
        <Typography
          variant="h3"
          fontWeight={700}
          sx={{
            mb: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {t('financialGoals.emptyState.title')}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, lineHeight: 1.6 }}
        >
          {t('financialGoals.emptyState.subtitle')}
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={<Iconify icon="solar:check-circle-bold" width={20} />}
          onClick={onCreateGoal}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              boxShadow: `0 12px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {t('financialGoals.emptyState.createFirstGoal')}
        </Button>
      </Box>

      {/* Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 40,
          left: 40,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: alpha(theme.palette.primary.main, 0.3),
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 60,
          right: 60,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: alpha(theme.palette.secondary.main, 0.3),
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 80,
          left: 80,
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: alpha(theme.palette.warning.main, 0.3),
        }}
      />
    </Box>
  );
}
