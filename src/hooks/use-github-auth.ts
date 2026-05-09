import { useState, useCallback, useEffect } from 'react';
import { useToast } from 'src/components/toast';
import { socialAuthService } from 'src/services/social-auth.service';
import { 
  SOCIAL_AUTH_CONFIG, 
  OAUTH_ENDPOINTS, 
  generateState, 
  generateCodeVerifier,
  base64UrlEncode 
} from 'src/config/social-auth.config';

export function useGitHubAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const generateAuthUrl = useCallback(() => {
    if (!SOCIAL_AUTH_CONFIG.github?.clientId) {
      console.warn('GitHub Auth: Missing configuration');
      return '';
    }

    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = base64UrlEncode(
      btoa(codeVerifier).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    );

    // Store for callback verification
    sessionStorage.setItem('github_oauth_state', state);
    sessionStorage.setItem('github_code_verifier', codeVerifier);

    const params = new URLSearchParams({
      client_id: SOCIAL_AUTH_CONFIG.github?.clientId || '',
      redirect_uri: SOCIAL_AUTH_CONFIG.github?.redirectUri || '',
      scope: SOCIAL_AUTH_CONFIG.github?.scope || '',
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    return `${OAUTH_ENDPOINTS.github.auth}?${params.toString()}`;
  }, []);

  const handleCallback = useCallback(async (code: string, state: string) => {
    try {
      setIsLoading(true);
      
      const storedState = sessionStorage.getItem('github_oauth_state');
      const codeVerifier = sessionStorage.getItem('github_code_verifier');

      if (state !== storedState) {
        throw new Error('Invalid state parameter');
      }

      // Exchange code for token (this should be done on backend for security)
      const tokenResponse = await fetch(OAUTH_ENDPOINTS.github.token, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: SOCIAL_AUTH_CONFIG.github?.clientId || '',
          client_secret: import.meta.env.VITE_GITHUB_CLIENT_SECRET,
          code: code,
          code_verifier: codeVerifier,
        }),
      });

      const tokenData = await tokenResponse.json();
      
      if (!tokenResponse.ok) {
        throw new Error('Failed to exchange code for token');
      }

      // Get user info with token
      const userResponse = await fetch(OAUTH_ENDPOINTS.github.userInfo, {
        headers: {
          'Authorization': `token ${tokenData.access_token}`,
        },
      });

      const userData = await userResponse.json();
      
      // Check email verification
      const emailsResponse = await fetch(OAUTH_ENDPOINTS.github.userEmails, {
        headers: {
          'Authorization': `token ${tokenData.access_token}`,
        },
      });

      const emails = await emailsResponse.json();
      const primaryEmail = emails.find((email: any) => email.primary && email.verified);

      if (!primaryEmail) {
        throw new Error('Email is required and must be verified');
      }

      // Login with backend
      const result = await socialAuthService.socialLogin({
        provider: 'github',
        access_token: tokenData.access_token,
        email: primaryEmail.email,
        name: userData.name || userData.login,
        avatar: userData.avatar_url,
      });

      if (result.status === 'success') {
        localStorage.setItem('access_token', result.data.access_token);
        localStorage.setItem('refresh_token', result.data.refresh_token);
        
        showSuccess('GitHub login successful!');
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      socialAuthService.handleSocialError(error);
      showError(error.message);
    } finally {
      setIsLoading(false);
      // Cleanup
      sessionStorage.removeItem('github_oauth_state');
      sessionStorage.removeItem('github_code_verifier');
    }
  }, [showSuccess, showError]);

  const signInWithGitHub = useCallback(() => {
    const authUrl = generateAuthUrl();
    if (!authUrl) {
      showError('GitHub login configuration missing');
      return;
    }

    // Open popup
    const width = 600;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const popup = window.open(
      authUrl,
      'github-login',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );

    if (!popup) {
      showError('Popup blocked. Please allow popups for this site.');
      return;
    }

    // Listen for popup messages
    const messageHandler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'github-success') {
        popup.close();
        handleCallback(event.data.code, event.data.state);
        window.removeEventListener('message', messageHandler);
      } else if (event.data.type === 'github-error') {
        popup.close();
        showError(event.data.error || 'GitHub login failed');
        window.removeEventListener('message', messageHandler);
      }
    };

    window.addEventListener('message', messageHandler);

    // Check if popup was closed manually
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageHandler);
        setIsLoading(false);
      }
    }, 1000);
  }, [generateAuthUrl, handleCallback, showError]);

  return {
    isLoading,
    signInWithGitHub,
  };
}
