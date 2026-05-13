import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Autocomplete, TextField, Box, Paper, Typography, alpha } from '@mui/material';
import { AssetType } from 'src/types/add-asset';

interface AssetTypeSelectProps {
  value: AssetType | null;
  onChange: (asset: AssetType | null) => void;
  options: AssetType[];
  error?: boolean;
  helperText?: string;
}

export default function AssetTypeSelect({
  value,
  onChange,
  options,
  error,
  helperText
}: AssetTypeSelectProps) {
  const { t } = useTranslation('add-asset');

  const getAssetIcon = (assetCode: string) => {
    const icons: Record<string, string> = {
      gold: '🥇',
      silver: '🥈',
      usd: '💵',
      btc: '₿',
      eth: 'Ξ',
      crypto: '🪙',
      cash: '💰',
      eWallet: '📱',
      digitalAsset: '💎',
      other: '📦'
    };
    return icons[assetCode.toLowerCase()] || '📄';
  };

  return (
    <Autocomplete
      value={value}
      onChange={(_, newValue) => onChange(newValue)}
      options={options}
      getOptionLabel={(option) => option.asset_name}
      filterOptions={(options, state) => {
        const filtered = options.filter((option) =>
          option.asset_name.toLowerCase().includes(state.inputValue.toLowerCase()) ||
          option.asset_code.toLowerCase().includes(state.inputValue.toLowerCase())
        );
        return filtered;
      }}
      isOptionEqualToValue={(option, value) => option.asset_id === value?.asset_id}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('form.assetType.label')}
          placeholder={t('form.assetType.placeholder')}
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
                {getAssetIcon(value.asset_code)}
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
              width: 36,
              height: 36,
              borderRadius: 1,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1.5,
              fontSize: 18
            }}
          >
            {getAssetIcon(option.asset_code)}
          </Box>
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {option.asset_name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {option.asset_code}
            </Typography>
          </Box>
        </Box>
      )}
      noOptionsText={
        <Box sx={{ py: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {t('form.assetType.searchPlaceholder')}
          </Typography>
        </Box>
      }
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