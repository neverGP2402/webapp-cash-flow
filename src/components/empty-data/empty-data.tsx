import { Box, Typography, Button } from '@mui/material';
import { Iconify } from 'src/components/iconify';

interface EmptyDataProps {
  title?: string;
  description?: string;
  icon?: string;
  action?: {
    text: string;
    onClick: () => void;
  };
}

export function EmptyData({ 
  title = 'Không có dữ liệu', 
  description = 'Không tìm thấy dữ liệu nào',
  icon = 'solar:document-text-outline',
  action 
}: EmptyDataProps) {
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
      <Box sx={{ mb: 3 }}>
        <Iconify 
          icon={icon as any} 
          sx={{ 
            fontSize: 64, 
            color: 'text.secondary',
            mb: 2 
          }} 
        />
      </Box>
      
      <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
        {title}
      </Typography>
      
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3, maxWidth: 400 }}>
        {description}
      </Typography>

      {action && (
        <Button
          variant="contained"
          startIcon={undefined}
          onClick={action.onClick}
          sx={{ mt: 2 }}
        >
          {action.text}
        </Button>
      )}
    </Box>
  );
}
