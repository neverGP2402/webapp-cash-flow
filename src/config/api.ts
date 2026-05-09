// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  VERSION: import.meta.env.VITE_API_VERSION || 'v1',
  ENDPOINTS: {
    AUTH: {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      SOCIAL_LOGIN: '/auth/social-login',
      LOGOUT: '/auth/logout',
    },
    TRANSACTION: '/transaction',
    ASSET: '/asset',
  },
} as const;

// Helper function to build API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}${endpoint}`;
};
