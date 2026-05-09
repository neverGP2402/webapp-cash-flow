import { 
  SocialProvider, 
  SocialLoginRequest, 
  SocialLoginResponse, 
  SocialAuthError 
} from 'src/types';
import { buildApiUrl, API_CONFIG } from 'src/config/api';
import { ApiResponse, SocialAuthRequest } from 'src/types';

class SocialAuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = buildApiUrl(endpoint);
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Social auth API request failed:', error);
      throw error;
    }
  }

  async socialLogin(loginData: SocialLoginRequest): Promise<ApiResponse<SocialLoginResponse>> {
    const socialAuthRequest: SocialAuthRequest = {
      provider: loginData.provider,
      token: loginData.access_token,
      device_info: navigator.userAgent,
      ip_address: await this.getClientIP(),
    };
    
    return this.request<ApiResponse<SocialLoginResponse>>(
      API_CONFIG.ENDPOINTS.AUTH.SOCIAL_LOGIN,
      {
        method: 'POST',
        body: JSON.stringify(socialAuthRequest),
      }
    );
  }

  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return '127.0.0.1';
    }
  }

  // Provider-specific token validation
  async validateGoogleToken(token: string): Promise<any> {
    const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`);
    if (!response.ok) {
      throw new Error('Invalid Google token');
    }
    return response.json();
  }

  async validateGitHubToken(token: string): Promise<any> {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Invalid GitHub token');
    }
    return response.json();
  }

  async validateFacebookToken(token: string): Promise<any> {
    const response = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`
    );
    if (!response.ok) {
      throw new Error('Invalid Facebook token');
    }
    return response.json();
  }

  // Handle social login errors
  handleSocialError(error: any): void {
    const errorMessages: Record<string, string> = {
      'EMAIL_REQUIRED': 'Email is required from social provider. Please grant email permission.',
      'EMAIL_NOT_VERIFIED': 'Your email is not verified. Please verify your email with the provider.',
      'INVALID_TOKEN': 'Invalid access token. Please try logging in again.',
      'PROVIDER_ERROR': 'Provider error occurred. Please try again.',
      'RATE_LIMITED': 'Too many attempts. Please try again later.',
    };

    const errorCode = error.error_code || 'PROVIDER_ERROR';
    const message = errorMessages[errorCode] || error.message || 'Social login failed';

    throw new Error(message);
  }
}

export const socialAuthService = new SocialAuthService();
