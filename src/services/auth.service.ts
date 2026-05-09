import { buildApiUrl, API_CONFIG } from 'src/config/api';

// Types for API responses
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  birthday?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
  avatar?: string;
  province_id?: number;
  ward_id?: number;
  role_permission_id?: number;
}

export interface RegisterResponse {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  birthday?: string;
  age?: number;
  gender?: string;
  address?: string;
  avatar?: string;
  province_id?: number;
  ward_id?: number;
  status: string;
  register_date: string;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  device_info?: string;
  ip_address?: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    username: string;
    email: string;
    full_name?: string;
    last_login_time: string;
  };
}

export interface ApiResponse<T> {
  status: 'success' | 'created' | 'error';
  message: string;
  data?: T;
  error_code?: string;
  timestamp: string;
}

// Auth Service Class
class AuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
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
      console.error('API request failed:', error);
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
    return this.request<RegisterResponse>(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<ApiResponse<null>> {
    const token = localStorage.getItem('access_token');
    return this.request<null>(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Store tokens in localStorage
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Clear tokens
  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const authService = new AuthService();
