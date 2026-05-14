import type { StackProps } from '@mui/material/Stack';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function NavUpgrade({ sx, ...other }: StackProps) {
  return (
    <Box
      sx={[
        {
          mb: 4,
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {/* <Box
        component="img"
        alt="Cash Flow"
        src="/assets/images/logo.png"
        sx={{ width: 70, my: 2 }}
      /> */}

      <Typography
        variant="h6"
        sx={[
          (theme) => ({
            background: `linear-gradient(to right, ${theme.vars.palette.secondary.main}, ${theme.vars.palette.warning.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            color: 'transparent',
          }),
        ]}
      >
        Xin chào!
      </Typography>

      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
        {`Chào mừng đến với `}
        <Box component="strong" sx={{ color: 'text.primary' }}>
          Cash Flow
        </Box>
      </Typography>

      {/* <Button
        href="#"
        target="_blank"
        variant="contained"
        color="inherit"
      >
        Đăng xuất
      </Button> */}
    </Box>
  );
}
