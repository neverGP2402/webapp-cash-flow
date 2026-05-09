// Social Authentication Types

export type SocialProvider = 'google' | 'github' | 'facebook';

export interface SocialUserProfile {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  username?: string;
  verified_email?: boolean;
}

export interface SocialLoginRequest {
  provider: SocialProvider;
  access_token: string;
  email?: string;
  name?: string;
  avatar?: string;
  device_info?: string;
  ip_address?: string;
}

export interface SocialLoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    full_name?: string;
    avatar?: string;
    status: string;
    last_login_time: string;
  };
}

export interface SocialAuthError {
  status: 'error';
  message: string;
  error_code: 'EMAIL_REQUIRED' | 'EMAIL_NOT_VERIFIED' | 'INVALID_TOKEN' | 'PROVIDER_ERROR' | 'RATE_LIMITED';
  timestamp: string;
}

// Provider-specific configurations
export interface GoogleConfig {
  clientId: string;
  scope: string;
}

export interface GitHubConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
}

export interface FacebookConfig {
  appId: string;
  version: string;
  scope: string;
}

export interface SocialProviderConfig {
  google?: GoogleConfig;
  github?: GitHubConfig;
  facebook?: FacebookConfig;
}

// OAuth flow states
export interface OAuthState {
  provider: SocialProvider;
  state: string;
  codeVerifier?: string;
}

// Event types for popup communication
export interface OAuthMessage {
  type: 'oauth-success' | 'oauth-error' | 'oauth-cancel';
  provider: SocialProvider;
  data?: any;
  error?: string;
}
