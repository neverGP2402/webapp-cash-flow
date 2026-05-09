'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { authService, User } from 'src/services/auth.service';
import { useRouter } from 'src/routes/hooks';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = authService.isAuthenticated();

  // Check authentication on mount
  const checkAuth = async () => {
    try {
      const storedUser = authService.getUser();
      const token = authService.getAccessToken();

      if (storedUser && token) {
        setUser(storedUser);
      } else {
        // Clear invalid session
        authService.clearSession();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      authService.clearSession();
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = useCallback(async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      const response = await authService.loginAndStoreSession({
        username,
        password,
        // Device info and IP will be automatically added by the authService
      });

      if ((response.status === 'success' || response.status === 200) && response.data) {
        setUser(response.data.user);
        return { success: true };
      } else {
        return { success: false, error: response.message };
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Login failed';
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.logoutAndClearSession();
      setUser(null);
      router.push('/sign-in');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout even if API call fails
      authService.clearSession();
      setUser(null);
      router.push('/sign-in');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  // Check auth on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth
  }), [user, isLoading, isAuthenticated, login, logout, checkAuth]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// HOC to protect routes that require authentication
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/sign-in');
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      return <div>Loading...</div>; // Or your loading component
    }

    if (!isAuthenticated) {
      return null; // Will redirect
    }

    return <Component {...props} />;
  };
}
