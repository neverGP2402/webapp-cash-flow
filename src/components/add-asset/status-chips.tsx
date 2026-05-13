import { useTranslation } from 'react-i18next';
import { Box, Chip, alpha } from '@mui/material';
import { AssetStatus } from 'src/types/add-asset';

interface StatusChipsProps {
  options: AssetStatus[];
  value: string;
  onChange: (statusId: string) => void;
  error?: boolean;
  helperText?: string;
}

export default function StatusChips({
  options,
  value,
  onChange,
  error,
  helperText
}: StatusChipsProps) {
  const { t } = useTranslation('add-asset');

  const getStatusColor = (statusId: string): 'success' | 'warning' | 'error' | 'info' => {
    const colors: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
      holding: 'success',
      lending: 'warning',
      pledged: 'error',
      investing: 'info'
    };
    return colors[statusId] || 'info';
  };

  const getStatusIcon = (statusId: string) => {
    const icons: Record<string, string> = {
      holding: '🤲',
      lending: '🤝',
      pledged: '🔒',
      investing: '📈'
    };
    return icons[statusId] || '📄';
  };

  return (
    <Box>
      <Box sx={{ mb: 1 }}>
        <Box sx={{ fontSize: 13, fontWeight: 500, color: 'text.secondary' }}>
          {t('form.status.label')}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {options.map((option) => {
          const isSelected = value === option.id;
          const color = getStatusColor(option.id);

          return (
            <Chip
              key={option.id}
              icon={
                <Box component="span" sx={{ fontSize: 14 }}>
                  {getStatusIcon(option.id)}
                </Box>
              }
              label={option.name}
              onClick={() => onChange(option.id)}
              color={isSelected ? color : 'default'}
              variant={isSelected ? 'filled' : 'outlined'}
              sx={{
                height: 36,
                fontWeight: isSelected ? 600 : 400,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)'
                },
                ...(isSelected && {
                  boxShadow: `0px 4px 12px ${alpha(color === 'success' ? '#2e7d32' : color === 'warning' ? '#ed6c02' : color === 'error' ? '#d32f2f' : '#0288d1', 0.2)}`
                })
              }}
            />
          );
        })}
      </Box>
      {error && helperText && (
        <Box sx={{ mt: 0.5 }}>
          <Box component="span" sx={{ fontSize: 12, color: 'error.main' }}>
            {helperText}
          </Box>
        </Box>
      )}
    </Box>
  );
}