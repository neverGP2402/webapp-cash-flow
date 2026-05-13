import { useTranslation } from 'react-i18next';

import {
  Box,
  Typography,
  alpha,
  useTheme,
  Fade,
  Button,
  Container,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

interface AssetEmptyStateProps {
  onAddTransaction?: () => void;
  isLoading?: boolean;
}

export function AssetEmptyState({ onAddTransaction, isLoading = false }: AssetEmptyStateProps) {
  const { t } = useTranslation('assetDetail');
  const theme = useTheme();

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {t('loading')}
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in={!isLoading} timeout={800}>
      <Container maxWidth="md">
        <Box
          sx={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            py: 8,
          }}
        >
          {/* Illustration */}
          <Box
            sx={{
              mb: 4,
              position: 'relative',
              width: 200,
              height: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Background circle */}
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.dark, 0.05)})`,
                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            />
            
            {/* Main icon */}
            <Iconify 
              icon={("solar:wallet-money-bold" as any)} 
              width={80} 
              height={80}
              sx={{ 
                color: alpha(theme.palette.primary.main, 0.6),
                zIndex: 1,
              }}
            />
            
            {/* Floating elements */}
            <Box
              sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                animation: 'float 3s ease-in-out infinite',
              }}
            >
              <Iconify 
                icon={("solar:trending-up-bold" as any)} 
                width={24} 
                sx={{ color: theme.palette.success.main }}
              />
            </Box>
            
            <Box
              sx={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                animation: 'float 3s ease-in-out infinite 1s',
              }}
            >
              <Iconify 
                icon={("solar:chart-square-bold" as any)} 
                width={24} 
                sx={{ color: theme.palette.info.main }}
              />
            </Box>
            
            <Box
              sx={{
                position: 'absolute',
                top: 50,
                left: 30,
                animation: 'float 3s ease-in-out infinite 2s',
              }}
            >
              <Iconify 
                icon={("solar:coin-bold" as any)} 
                width={20} 
                sx={{ color: theme.palette.warning.main }}
              />
            </Box>
          </Box>

          {/* Content */}
          <Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
            {t('emptyState.title')}
          </Typography>
          
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ mb: 4, maxWidth: 500 }}
          >
            {t('emptyState.description')}
          </Typography>

          {/* CTA Button */}
          {onAddTransaction && (
            <Button
              variant="contained"
              size="large"
              startIcon={<Iconify icon={("solar:cart-add-bold" as any)} width={20} />}
              onClick={onAddTransaction}
              sx={{
                px: 4,
                py: 2,
                fontSize: '16px',
                fontWeight: 600,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[8],
                },
                transition: 'all 0.3s ease',
              }}
            >
              {t('emptyState.addTransaction')}
            </Button>
          )}

          {/* Feature highlights */}
          <Box sx={{ mt: 6, maxWidth: 600 }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 3 }}>
              Bắt đầu theo dõi tài sản của bạn:
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center' }}>
              {[
                {
                  icon: 'solar:cart-add-bold',
                  title: 'Thêm giao dịch',
                  description: 'Ghi lại mua/bán tài sản',
                },
                {
                  icon: 'solar:refresh-circle-bold',
                  title: 'Cập nhật giá',
                  description: 'Theo dõi giá thị trường',
                },
                {
                  icon: 'solar:chart-square-bold',
                  title: 'Phân tích hiệu suất',
                  description: 'Xem lời/lỗ và tăng trưởng',
                },
              ].map((feature, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    flex: { xs: '1 1 100%', sm: '1 1 30%' },
                    minWidth: 150,
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: alpha(theme.palette.primary.main, 0.1),
                      mb: 2,
                      color: theme.palette.primary.main,
                    }}
                  >
                    <Iconify icon={feature.icon as any} width={32} />
                  </Box>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Fade>
  );
}
