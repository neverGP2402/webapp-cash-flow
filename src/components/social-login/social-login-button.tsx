import { Button, ButtonProps, IconButton } from '@mui/material';
import { Box } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { CircularProgress } from '@mui/material';

interface SocialLoginButtonProps extends Omit<ButtonProps, 'children' | 'onClick'> {
  provider: 'google' | 'github' | 'facebook';
  onClick: () => void;
  isLoading?: boolean;
  fullWidth?: boolean;
  circular?: boolean;
}

const providerConfig = {
  google: {
    icon: 'logos:google-icon',
    color: '#4285F4',
    text: 'Continue with Google',
  },
  github: {
    icon: 'socials:github',
    color: '#333333',
    text: 'Continue with GitHub',
  },
  facebook: {
    icon: 'socials:facebook',
    color: '#1877F2',
    text: 'Continue with Facebook',
  },
};

export function SocialLoginButton({
  provider,
  onClick,
  isLoading = false,
  fullWidth = false,
  circular = false,
  ...props
}: SocialLoginButtonProps) {
  const config = providerConfig[provider];

  if (circular) {
    return (
      <Box
        onClick={onClick}
        sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: isLoading ? 'transparent' : `${config.color}08`,
          },
          '&:active': {
            backgroundColor: isLoading ? 'transparent' : `${config.color}12`,
          },
          opacity: isLoading ? 0.6 : 1,
          ...props.sx,
        }}
      >
        {isLoading ? (
          <CircularProgress size={20} sx={{ color: config.color }} />
        ) : (
          <Iconify 
            width={20} 
            height={20} 
            icon={config.icon as any} 
            sx={{ color: config.color }}
          />
        )}
      </Box>
    );
  }

  return (
    <Button
      fullWidth={fullWidth}
      size="large"
      variant="outlined"
      onClick={onClick}
      disabled={isLoading}
      sx={{
        borderColor: config.color,
        color: config.color,
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: `${config.color}08`,
          borderColor: config.color,
        },
        '&:active': {
          backgroundColor: `${config.color}12`,
        },
        '&.Mui-disabled': {
          borderColor: 'action.disabled',
          color: 'action.disabled',
        },
        ...props.sx,
      }}
      startIcon={
        isLoading ? (
          <CircularProgress size={20} sx={{ color: config.color }} />
        ) : (
          <Iconify 
            width={20} 
            height={20} 
            icon={config.icon as any} 
            sx={{ color: config.color }}
          />
        )
      }
      {...props}
    >
      {config.text}
    </Button>
  );
}
