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
    avatar?: string;
    status: string;
    last_login_time: string;
    register_date?: string;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  avatar?: string;
  status: string;
  last_login_time: string;
  register_date?: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'created' | 'error' | 200 | 201 | 400 | 401 | 403 | 404 | 500;
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

  // Store tokens and user data in localStorage
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  // Store user data
  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Get refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  // Get user data
  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.clearSession();
        return null;
      }
    }
    return null;
  }

  // Clear all session data
  clearSession(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // Enhanced login method that stores session data
  async loginAndStoreSession(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await this.login(credentials);
      
      if ((response.status === 'success' || response.status === 200) && response.data) {
        // Store tokens and user data
        this.setTokens(response.data.access_token, response.data.refresh_token);
        this.setUser(response.data.user);
      }
      
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Logout and clear session
  async logoutAndClearSession(): Promise<void> {
    try {
      await this.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local session even if API call fails
      this.clearSession();
    }
  }
}

export const authService = new AuthService();
