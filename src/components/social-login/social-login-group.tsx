import { Box } from '@mui/material';
import { useGoogleAuth } from 'src/hooks/use-google-auth';
import { useGitHubAuth } from 'src/hooks/use-github-auth';
import { useFacebookAuth } from 'src/hooks/use-facebook-auth';
import { SocialLoginButton } from './social-login-button';
import { SocialLoginSeparator } from './social-login-separator';
import { SocialLoginConfigWarning } from './social-login-config-warning';
import { SOCIAL_AUTH_CONFIG } from 'src/config/social-auth.config';

interface SocialLoginGroupProps {
  showSeparator?: boolean;
  buttonVariant?: 'horizontal' | 'vertical';
  fullWidth?: boolean;
  circular?: boolean;
}

export function SocialLoginGroup({ 
  showSeparator = true, 
  buttonVariant = 'vertical',
  fullWidth = false,
  circular = false
}: SocialLoginGroupProps) {
  const { signInWithGoogle, isLoading: googleLoading } = useGoogleAuth();
  const { signInWithGitHub, isLoading: githubLoading } = useGitHubAuth();
  const { signInWithFacebook, isLoading: facebookLoading } = useFacebookAuth();

  // Check for missing configurations
  const missingProviders = [];
  if (!SOCIAL_AUTH_CONFIG.google?.clientId) missingProviders.push('google');
  if (!SOCIAL_AUTH_CONFIG.github?.clientId) missingProviders.push('github');
  if (!SOCIAL_AUTH_CONFIG.facebook?.appId) missingProviders.push('facebook');

  const buttonContainerSx = circular ? {
    display: 'flex',
    gap: 1.5,
    justifyContent: 'center',
    mb: 2,
  } : {
    display: buttonVariant === 'horizontal' ? 'flex' : 'block',
    gap: buttonVariant === 'horizontal' ? 2 : 1,
    justifyContent: buttonVariant === 'horizontal' ? 'center' : 'stretch',
    mb: buttonVariant === 'vertical' ? 1 : 0,
  };

  return (
    <>
      {/* {missingProviders.length > 0 && (
        <SocialLoginConfigWarning missingProviders={missingProviders} />
      )} */}
      
      {showSeparator && <SocialLoginSeparator />}
      
      <Box sx={buttonContainerSx}>
        <SocialLoginButton
          provider="google"
          onClick={signInWithGoogle}
          isLoading={googleLoading}
          fullWidth={fullWidth || buttonVariant === 'vertical'}
          circular={circular}
          sx={!circular ? {
            mb: buttonVariant === 'vertical' ? 1 : 0,
          } : undefined}
        />
        
        {/* <SocialLoginButton
          provider="github"
          onClick={signInWithGitHub}
          isLoading={githubLoading}
          fullWidth={fullWidth || buttonVariant === 'vertical'}
          circular={circular}
          sx={!circular ? {
            mb: buttonVariant === 'vertical' ? 1 : 0,
          } : undefined}
        /> */}
        
        <SocialLoginButton
          provider="facebook"
          onClick={signInWithFacebook}
          isLoading={facebookLoading}
          fullWidth={fullWidth || buttonVariant === 'vertical'}
          circular={circular}
        />
      </Box>
    </>
  );
}
