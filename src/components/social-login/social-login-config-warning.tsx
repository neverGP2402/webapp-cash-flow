import { Alert, Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useAppTranslation } from 'src/hooks/use-translation';

// Use text emoji to avoid TypeScript icon issues
const WarningIcon = () => (
  <span style={{ fontSize: '20px' }}>⚠️</span>
);

interface SocialLoginConfigWarningProps {
  missingProviders: string[];
}

export function SocialLoginConfigWarning({ missingProviders }: SocialLoginConfigWarningProps) {
  const { t } = useAppTranslation();

  if (missingProviders.length === 0) {
    return null;
  }

  const getProviderConfigInstructions = (provider: string) => {
    switch (provider) {
      case 'google':
        return {
          name: t('socialLogin.configWarning.providers.google.name'),
          envVar: 'VITE_GOOGLE_CLIENT_ID',
          instructions: t('socialLogin.configWarning.providers.google.instructions'),
        };
      case 'github':
        return {
          name: t('socialLogin.configWarning.providers.github.name'),
          envVar: 'VITE_GITHUB_CLIENT_ID',
          instructions: t('socialLogin.configWarning.providers.github.instructions'),
        };
      case 'facebook':
        return {
          name: t('socialLogin.configWarning.providers.facebook.name'),
          envVar: 'VITE_FACEBOOK_APP_ID',
          instructions: t('socialLogin.configWarning.providers.facebook.instructions'),
        };
      default:
        return {
          name: t('socialLogin.configWarning.providers.default.name'),
          envVar: `${provider.toUpperCase()}_CLIENT_ID`,
          instructions: t('socialLogin.configWarning.providers.default.instructions'),
        };
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Alert 
        severity="warning" 
        icon={<Iconify icon="solar:shield-warning-bold" />}
        sx={{ 
          mb: 2,
          '& .MuiAlert-message': { width: '100%' }
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
          {t('socialLogin.configWarning.title')}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {t('socialLogin.configWarning.subtitle')}
        </Typography>
        <List dense>
          {missingProviders.map((provider) => {
            const config = getProviderConfigInstructions(provider);
            return (
              <ListItem key={provider} sx={{ py: 0.5, px: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                      {config.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                      {t('socialLogin.configWarning.environment')} {config.envVar}
                    </Typography>
                  }
                />
              </ListItem>
            );
          })}
        </List>
        <Typography variant="body2" sx={{ mt: 2 }}>
          {t('socialLogin.configWarning.instructions')}
        </Typography>
      </Alert>
    </Box>
  );
}
