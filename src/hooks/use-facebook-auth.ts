import { useState, useCallback, useEffect } from 'react';
import { useToast } from 'src/components/toast';
import { socialAuthService } from 'src/services/social-auth.service';
import { SOCIAL_AUTH_CONFIG, OAUTH_ENDPOINTS, generateState } from 'src/config/social-auth.config';

declare global {
  interface Window {
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

export function useFacebookAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const initializeFacebookAuth = useCallback(() => {
    if (!window.FB || !SOCIAL_AUTH_CONFIG.facebook?.appId) {
      console.warn('Facebook Auth: Missing configuration');
      return;
    }

    window.FB.init({
      appId: SOCIAL_AUTH_CONFIG.facebook.appId,
      cookie: true,
      xfbml: true,
      version: SOCIAL_AUTH_CONFIG.facebook.version,
    });
  }, []);

  const handleFacebookResponse = useCallback(async (response: any) => {
    try {
      setIsLoading(true);

      if (response.authResponse) {
        const { accessToken } = response.authResponse;

        // Get user info from Facebook
        window.FB.api('/me', { fields: 'id,name,email,picture' }, async (userData: any) => {
          try {
            // Login with backend
            const result = await socialAuthService.socialLogin({
              provider: 'facebook',
              access_token: accessToken,
              email: userData.email,
              name: userData.name,
              avatar: userData.picture?.data?.url,
            });

            if (result.status === 'success') {
              localStorage.setItem('access_token', result.data.access_token);
              localStorage.setItem('refresh_token', result.data.refresh_token);
              
              showSuccess('Facebook login successful!');
              window.location.href = '/dashboard';
            }
          } catch (error: any) {
            socialAuthService.handleSocialError(error);
            showError(error.message);
          } finally {
            setIsLoading(false);
          }
        });
      }
    } catch (error: any) {
      socialAuthService.handleSocialError(error);
      showError(error.message);
      setIsLoading(false);
    }
  }, [showSuccess, showError]);

  const signInWithFacebook = useCallback(() => {
    if (!window.FB) {
      showError('Facebook login not available. Please refresh the page.');
      return;
    }

    setIsLoading(true);

    window.FB.login(
      handleFacebookResponse,
      { scope: SOCIAL_AUTH_CONFIG.facebook?.scope || 'email,public_profile' }
    );
  }, [handleFacebookResponse, showError]);

  const renderFacebookButton = useCallback((elementId: string) => {
    if (!window.FB) return;

    const button = document.createElement('div');
    button.className = 'fb-login-button';
    button.setAttribute('data-width', '300');
    button.setAttribute('data-size', 'large');
    button.setAttribute('data-button-type', 'continue_with');
    button.setAttribute('data-layout', 'default');
    button.setAttribute('data-auto-logout-link', 'false');
    button.setAttribute('data-use-continue-as', 'true');
    button.textContent = 'Continue with Facebook';

    const container = document.getElementById(elementId);
    if (container) {
      container.innerHTML = '';
      container.appendChild(button);
      
      button.onclick = signInWithFacebook;
    }
  }, [signInWithFacebook]);

  useEffect(() => {
    // Load Facebook SDK
    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';

    window.fbAsyncInit = () => {
      initializeFacebookAuth();
    };

    script.onerror = () => {
      showError('Failed to load Facebook SDK');
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [initializeFacebookAuth, showError]);

  return {
    isLoading,
    signInWithFacebook,
    renderFacebookButton,
  };
}
