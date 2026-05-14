import { useTranslation } from 'react-i18next';
import { Box, Card, CardContent, Typography, Button, alpha } from '@mui/material';
import { Iconify } from 'src/components/iconify';

interface EmptyStateProps {
  onAddDebt?: () => void;
}

export function EmptyState({ onAddDebt }: EmptyStateProps) {
  const { t } = useTranslation('debtManagement');

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: `1px solid ${alpha('#000', 0.06)}`,
        textAlign: 'center',
        py: 8,
      }}
    >
      <CardContent>
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            bgcolor: alpha('#1976d2', 0.05),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <Typography variant="h3" sx={{ fontSize: 48 }}>
            📊
          </Typography>
        </Box>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
          {t('emptyState.title')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
          {t('emptyState.description')}
        </Typography>
        {onAddDebt && (
          <Button
            variant="contained"
            size="large"
            onClick={onAddDebt}
            startIcon={<Iconify icon="solar:check-circle-bold" width={20} />}
            sx={{
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontWeight: 600,
            }}
          >
            {t('emptyState.addFirstDebt')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
