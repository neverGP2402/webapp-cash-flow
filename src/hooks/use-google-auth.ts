import { useState, useCallback, useEffect } from 'react';
import { useToast } from 'src/components/toast';
import { socialAuthService } from 'src/services/social-auth.service';
import { SOCIAL_AUTH_CONFIG, OAUTH_ENDPOINTS, generateState } from 'src/config/social-auth.config';

declare global {
  interface Window {
    gapi?: any;
    google?: any;
  }
}

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const initializeGoogleAuth = useCallback(() => {
    if (!window.google) {
      console.warn('Google Auth: Google SDK not loaded');
      return;
    }

    const clientId = SOCIAL_AUTH_CONFIG.google?.clientId;
    if (!clientId) {
      console.warn('Google Auth: Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable.');
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
  }, []);

  const handleGoogleResponse = useCallback(async (response: any) => {
    try {
      setIsLoading(true);
      
      if (response.credential) {
        // Validate token with backend
        const result = await socialAuthService.socialLogin({
          provider: 'google',
          access_token: response.credential,
        });

        if (result.status === 'success') {
          // Store tokens
          localStorage.setItem('access_token', result.data.access_token);
          localStorage.setItem('refresh_token', result.data.refresh_token);
          
          showSuccess('Google login successful!');
          window.location.href = '/dashboard';
        }
      }
    } catch (error: any) {
      socialAuthService.handleSocialError(error);
      showError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [showSuccess, showError]);

  const signInWithGoogle = useCallback(() => {
    const clientId = SOCIAL_AUTH_CONFIG.google?.clientId;
    if (!clientId) {
      showError('Google Sign-In not configured. Please contact administrator.');
      return;
    }

    if (!window.google) {
      showError('Google Sign-In not available. Please refresh the page.');
      return;
    }

    setIsLoading(true);
    
    try {
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setIsLoading(false);
        }
      });
    } catch (error) {
      setIsLoading(false);
      showError('Failed to initiate Google Sign-In');
    }
  }, [showError]);

  const renderGoogleButton = useCallback((elementId: string) => {
    const clientId = SOCIAL_AUTH_CONFIG.google?.clientId;
    if (!clientId) {
      console.warn('Google Auth: Cannot render button - missing Client ID');
      return;
    }

    if (!window.google) {
      console.warn('Google Auth: Cannot render button - SDK not loaded');
      return;
    }

    window.google.accounts.id.renderButton(
      document.getElementById(elementId),
      {
        theme: 'filled_blue',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
      }
    );
  }, []);

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      initializeGoogleAuth();
    };

    script.onerror = () => {
      showError('Failed to load Google Sign-In');
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [initializeGoogleAuth, showError]);

  return {
    isLoading,
    signInWithGoogle,
    renderGoogleButton,
  };
}
