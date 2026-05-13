import { useTranslation } from 'react-i18next';
import { Autocomplete, TextField, Box, Paper, Typography, alpha } from '@mui/material';
import { Wallet } from 'src/types/add-asset';

interface WalletSelectorProps {
  value: Wallet | null;
  onChange: (wallet: Wallet | null) => void;
  options: Wallet[];
  error?: boolean;
  helperText?: string;
}

export default function WalletSelector({
  value,
  onChange,
  options,
  error,
  helperText
}: WalletSelectorProps) {
  const { t } = useTranslation('add-asset');

  const getWalletIcon = (walletType: string) => {
    const icons: Record<string, string> = {
      bank: '🏦',
      eWallet: '📱',
      cash: '💰',
      crypto: '🔐',
      savings: '🏛️',
      investment: '📈',
      other: '👛'
    };
    return icons[walletType.toLowerCase()] || '💼';
  };

  return (
    <Autocomplete
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      options={options}
      getOptionLabel={(option) => option.wallet_name}
      isOptionEqualToValue={(option, value) => option.wallet_id === value?.wallet_id}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('form.wallet.label')}
          placeholder={t('form.wallet.placeholder')}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            startAdornment: value && (
              <Box
                component="span"
                sx={{
                  mr: 1,
                  fontSize: 20,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {getWalletIcon(value.wallet_type)}
              </Box>
            )
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          sx={{
            py: 1,
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04)
            }
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1.5,
              fontSize: 20
            }}
          >
            {getWalletIcon(option.wallet_type)}
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {option.wallet_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {option.bank_name || option.wallet_type}
            </Typography>
          </Box>
        </Box>
      )}
      PaperComponent={(props) => (
        <Paper
          {...props}
          elevation={0}
          sx={{
            borderRadius: 2,
            boxShadow: (theme) =>
              `0px 8px 24px ${alpha(theme.palette.common.black, 0.12)}`
          }}
        >
          {props.children}
        </Paper>
      )}
    />
  );
}