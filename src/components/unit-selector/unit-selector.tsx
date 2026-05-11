import { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
} from '@mui/material';
import { unitService, UnitData } from 'src/services/unit-service';

interface UnitSelectorProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function UnitSelector({
  value,
  onChange,
  label = 'Đơn vị tính',
  disabled = false,
  fullWidth = true,
}: UnitSelectorProps) {
  const [units, setUnits] = useState<UnitData[]>([]);
  const [loading, setLoading] = useState(true);

  // Load units on component mount
  useEffect(() => {
    loadUnits();
  }, []);

  const loadUnits = async () => {
    try {
      setLoading(true);
      const data = await unitService.getUnits();
      setUnits(data);
    } catch (err) {
      console.error('Failed to load units:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormControl fullWidth={fullWidth}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        label={label}
        disabled={disabled || loading}
      >
        {loading ? (
          <MenuItem disabled>
            <Box sx={{ display: 'flex', alignItems: 'center', py: 1 }}>
              <CircularProgress size={16} sx={{ mr: 1 }} />
              Đang tải...
            </Box>
          </MenuItem>
        ) : (
          units.map((unit) => (
            <MenuItem key={unit.id} value={unit.id}>
              {unit.name}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
}
