import { useTranslation } from 'react-i18next';
import { Box, Typography, alpha, Chip, Divider } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import type { DebtContract } from 'src/types/debt-management';

interface DrawerContractInfoProps {
  contract: DebtContract;
}

export function DrawerContractInfo({ contract }: DrawerContractInfoProps) {
  const { t } = useTranslation('debtManagement');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        {t('drawer.contract.title')}
      </Typography>
      <Box
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: alpha('#000', 0.02),
          border: `1px solid ${alpha('#000', 0.06)}`,
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              {t('drawer.contract.contractNumber')}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {contract.contractNumber}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              {t('drawer.contract.signedDate')}
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {formatDate(contract.signedDate)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              {t('drawer.contract.loanType')}
            </Typography>
            <Chip
              label={t(`drawer.contract.loanTypes.${contract.loanType}`)}
              size="small"
              sx={{
                height: 24,
                fontSize: 11,
                bgcolor: alpha('#1976d2', 0.1),
                color: '#1976d2',
                fontWeight: 600,
              }}
            />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
              {t('drawer.contract.paymentCycle')}
            </Typography>
            <Chip
              label={t(`drawer.contract.paymentCycles.${contract.paymentCycle}`)}
              size="small"
              sx={{
                height: 24,
                fontSize: 11,
                bgcolor: alpha('#22c55e', 0.1),
                color: '#22c55e',
                fontWeight: 600,
              }}
            />
          </Box>
        </Box>

        {contract.notes && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                {t('drawer.contract.notes')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {contract.notes}
              </Typography>
            </Box>
          </>
        )}

        {contract.attachments && contract.attachments.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                {t('drawer.contract.attachments')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {contract.attachments.map((attachment) => (
                  <Box
                    key={attachment.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      p: 1.5,
                      borderRadius: 1,
                      bgcolor: alpha('#000', 0.02),
                      border: `1px solid ${alpha('#000', 0.06)}`,
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: alpha('#000', 0.04),
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1,
                        bgcolor: alpha('#1976d2', 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                      }}
                    >
                      📄
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight={600} sx={{ mb: 0.25 }}>
                        {attachment.fileName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(attachment.fileSize)}
                      </Typography>
                    </Box>
                    <Iconify icon="solar:eye-bold" width={20} color="text.secondary" />
                  </Box>
                ))}
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
