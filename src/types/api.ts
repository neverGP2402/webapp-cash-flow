// Common API Response Types

export interface ApiResponse<T> {
  status: string | number;
  message: string;
  data: T;
  error_code?: string;
  timestamp?: string;
}

export interface PaginatedApiResponse<T> {
  status: string;
  message: string;
  data: T[];
}

// Common API Request Types
export interface CreateRequest {
  code: string;
  name: string;
}

export interface UpdateRequest {
  code?: string;
  name?: string;
}

// Auth-specific types
export interface AuthRequest {
  username: string;
  password: string;
  device_info?: string;
  ip_address?: string;
  origin?: string;
  user_agent?: string;
}

export interface SocialAuthRequest {
  provider: string;
  token: string;
  device_info?: string;
  ip_address?: string;
}
