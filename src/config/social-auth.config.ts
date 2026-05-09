import { SocialProviderConfig } from 'src/types/social-auth.types';

// Environment-based configuration
export const SOCIAL_AUTH_CONFIG: SocialProviderConfig = {
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    scope: 'openid email profile',
  },
  github: {
    clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || '',
    redirectUri: `${window.location.origin}/auth/github/callback`,
    scope: 'user:email',
  },
  facebook: {
    appId: import.meta.env.VITE_FACEBOOK_APP_ID || '',
    version: 'v18.0',
    scope: 'email,public_profile',
  },
};

// OAuth endpoints for each provider
export const OAUTH_ENDPOINTS = {
  google: {
    auth: 'https://accounts.google.com/o/oauth2/v2/auth',
    token: 'https://oauth2.googleapis.com/token',
    userInfo: 'https://www.googleapis.com/oauth2/v2/userinfo',
  },
  github: {
    auth: 'https://github.com/login/oauth/authorize',
    token: 'https://github.com/login/oauth/access_token',
    userInfo: 'https://api.github.com/user',
    userEmails: 'https://api.github.com/user/emails',
  },
  facebook: {
    auth: 'https://www.facebook.com/v18.0/dialog/oauth',
    token: 'https://graph.facebook.com/v18.0/oauth/access_token',
    userInfo: 'https://graph.facebook.com/v18.0/me',
  },
} as const;

// Helper functions
export const generateState = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const generateCodeVerifier = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => String.fromCharCode(byte)).join('');
};

export const base64UrlEncode = (str: string): string => {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
