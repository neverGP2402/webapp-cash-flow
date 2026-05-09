import { useState, useEffect } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Box,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';

// Asset types from API documentation
export interface AssetType {
  code: string;
  name: string;
  icon: string;
  unit: string;
}

const assetTypes: AssetType[] = [
  { code: 'MONEY', name: 'Tiền mặt', icon: 'mdi:cash', unit: 'VNĐ' },
  { code: 'BANK', name: 'Ngân hàng', icon: 'mdi:bank', unit: 'VNĐ' },
  { code: 'GOLD', name: 'Vàng', icon: 'mdi:gold', unit: 'chỉ' },
  { code: 'CRYPTO', name: 'Crypto', icon: 'mdi:bitcoin', unit: 'coin' },
  { code: 'REAL_ESTATE', name: 'Bất động sản', icon: 'mdi:home', unit: 'căn' },
  { code: 'VEHICLE', name: 'Phương tiện', icon: 'mdi:car', unit: 'chiếc' },
  { code: 'ELECTRONIC', name: 'Điện tử', icon: 'mdi:cellphone', unit: 'cái' },
  { code: 'OTHER', name: 'Khác', icon: 'mdi:dots-horizontal', unit: 'cái' },
];

// E-wallet types from API documentation
export interface EWalletType {
  code: string;
  name: string;
  icon: string;
  provider: string;
}

const eWalletTypes: EWalletType[] = [
  { code: 'MOMO', name: 'MoMo', icon: 'simple-icons:momo', provider: 'MoMo' },
  { code: 'ZALOPAY', name: 'ZaloPay', icon: 'simple-icons:zalopay', provider: 'ZaloPay' },
  { code: 'VIETMONEY', name: 'VietMoney', icon: 'mdi:wallet', provider: 'Viettel Money' },
  { code: 'SHOPEEPAY', name: 'ShopeePay', icon: 'mdi:shopping', provider: 'ShopeePay' },
  { code: 'TIKOPAY', name: 'TikiPay', icon: 'mdi:shopping-outline', provider: 'TikiPay' },
];

interface AssetTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  label?: string;
  disabled?: boolean;
}

export function AssetTypeSelector({
  value,
  onChange,
  error = false,
  helperText,
  label = 'Loại tài sản',
  disabled = false,
}: AssetTypeSelectorProps) {
  const [assetType, setAssetType] = useState<AssetType | null>(null);

  useEffect(() => {
    const selected = assetTypes.find(type => type.code === value);
    setAssetType(selected || null);
  }, [value]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value;
    onChange(newValue);
  };

  return (
    <FormControl fullWidth error={error} disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        label={label}
        renderValue={(selected) => {
          const type = assetTypes.find(t => t.code === selected);
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Iconify 
                icon={(type?.icon || 'mdi:help-circle') as any} 
                sx={{ mr: 1, width: 20, height: 20 }} 
              />
              {type?.name || ''}
            </Box>
          );
        }}
      >
        {assetTypes.map((type) => (
          <MenuItem key={type.code} value={type.code}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Iconify 
                icon={type.icon as any} 
                sx={{ mr: 1, width: 20, height: 20 }} 
              />
              {type.name}
            </Box>
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

interface EWalletSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  label?: string;
  disabled?: boolean;
}

export function EWalletSelector({
  value,
  onChange,
  error = false,
  helperText,
  label = 'Ví điện tử',
  disabled = false,
}: EWalletSelectorProps) {
  const [walletType, setWalletType] = useState<EWalletType | null>(null);

  useEffect(() => {
    const selected = eWalletTypes.find(type => type.code === value);
    setWalletType(selected || null);
  }, [value]);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value;
    onChange(newValue);
  };

  return (
    <FormControl fullWidth error={error} disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        label={label}
        renderValue={(selected) => {
          const type = eWalletTypes.find(t => t.code === selected);
          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Iconify 
                icon={(type?.icon || 'mdi:help-circle') as any} 
                sx={{ mr: 1, width: 20, height: 20 }} 
              />
              {type?.name || ''}
            </Box>
          );
        }}
      >
        {eWalletTypes.map((type) => (
          <MenuItem key={type.code} value={type.code}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Iconify 
                icon={type.icon as any} 
                sx={{ mr: 1, width: 20, height: 20 }} 
              />
              {type.name}
            </Box>
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}

export { assetTypes, eWalletTypes };
