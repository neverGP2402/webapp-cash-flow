import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/material';

interface SocialLoginSeparatorProps {
  text?: string;
}

export function SocialLoginSeparator({ text = 'OR' }: SocialLoginSeparatorProps) {
  return (
    <Box sx={{ width: '100%', my: 3 }}>
      <Divider 
        sx={{ 
          '&::before, &::after': { 
            borderTopStyle: 'dashed' 
          } 
        }}
      >
        <Typography
          variant="overline"
          sx={{ 
            color: 'text.secondary', 
            fontWeight: 'fontWeightMedium',
            textTransform: 'uppercase',
          }}
        >
          {text}
        </Typography>
      </Divider>
    </Box>
  );
}
