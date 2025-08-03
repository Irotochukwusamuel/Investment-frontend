import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, endpoints, handleApiResponse } from '../api';
import { toast } from 'sonner';
import { useEffect, useRef, useCallback, useState } from 'react';

// Types
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  referralCode?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  referralCode?: string;
  referredBy?: string;
  referralCount: number;
  totalReferralEarnings: number;
  firstActiveInvestmentDate?: string;
  lastBonusWithdrawalDate?: string;
  totalBonusWithdrawals: number;
  walletBalances: {
    naira: number;
    usdt: number;
  };
  totalInvestments: number;
  totalEarnings: number;
  status: string;
  emailVerified: boolean;
  createdAt: string;
  role: 'user' | 'admin' | 'moderator';
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface OtpData {
  email: string;
  type: 'email_verification' | 'password_reset' | 'login';
}

export interface VerifyOtpData {
  email: string;
  otp: string;
  type: 'email_verification' | 'password_reset' | 'login';
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isEmailVerified: boolean;
  };
  requiresEmailVerification: boolean;
}

export interface VerifyOtpResponse {
  message: string;
  verified: boolean;
  access_token?: string;
  user?: User;
  resetToken?: string;
  expiresAt?: string;
}

// Session timeout constants
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes warning before timeout

// Session timeout hook
export const useSessionTimeout = () => {
  const queryClient = useQueryClient();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(WARNING_TIME / 1000);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    queryClient.clear();
    setShowWarning(false);
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }, [queryClient]);

  const resetSessionTimer = useCallback(() => {
    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }

    // Hide warning if it was showing
    setShowWarning(false);

    // Update last activity
    lastActivityRef.current = Date.now();

    // Set warning timer (25 minutes)
    warningRef.current = setTimeout(() => {
      setShowWarning(true);
      setTimeRemaining(WARNING_TIME / 1000);
    }, SESSION_TIMEOUT - WARNING_TIME);

    // Set logout timer (30 minutes)
    timeoutRef.current = setTimeout(() => {
      toast.error('Your session has expired due to inactivity. Please log in again.');
      logout();
    }, SESSION_TIMEOUT);
  }, [logout]);

  const handleStayLoggedIn = useCallback(() => {
    resetSessionTimer();
  }, [resetSessionTimer]);

  const handleUserActivity = useCallback(() => {
    resetSessionTimer();
  }, [resetSessionTimer]);

  useEffect(() => {
    // Only set up session timeout if user is logged in
    const token = localStorage.getItem('access_token');
    if (!token) return;

    // Set up activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const activityHandler = () => {
      handleUserActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, activityHandler, true);
    });

    // Initial timer setup
    resetSessionTimer();

    // Cleanup function
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, activityHandler, true);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningRef.current) {
        clearTimeout(warningRef.current);
      }
    };
  }, [handleUserActivity, resetSessionTimer]);

  // Countdown effect for warning
  useEffect(() => {
    if (!showWarning) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          logout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showWarning, logout]);

  return {
    resetSessionTimer,
    lastActivity: lastActivityRef.current,
    showWarning,
    timeRemaining,
    handleStayLoggedIn,
    handleLogout: logout,
  };
};

// Auth hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await api.post(endpoints.auth.login, data);
      const result = handleApiResponse<AuthResponse>(response);
      
      // Store token
      localStorage.setItem('access_token', result.access_token);
      
      return result;
    },
    onSuccess: (data) => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.setQueryData(['user'], data.user);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await api.post(endpoints.auth.register, data);
      const result = handleApiResponse<RegisterResponse>(response);
      return result;
    },
    // Don't automatically set user data since registration requires email verification
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      // Since there's no logout endpoint, just clear local storage
      localStorage.removeItem('access_token');
    },
    onSuccess: () => {
      // Clear token and user data
      localStorage.removeItem('access_token');
      queryClient.clear();
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const response = await api.get(endpoints.users.profile);
      return handleApiResponse<User>(response);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await api.post(endpoints.auth.forgotPassword, { email });
      return handleApiResponse(response);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: { token?: string; email?: string; resetToken?: string; newPassword: string }) => {
      if (data.email && data.resetToken) {
        const response = await api.post(endpoints.auth.resetPasswordOtp, {
          email: data.email,
          resetToken: data.resetToken,
          newPassword: data.newPassword,
        });
        return handleApiResponse(response);
      } else {
        const response = await api.post(endpoints.auth.resetPassword, {
          token: data.token,
          newPassword: data.newPassword,
        });
        return handleApiResponse(response);
      }
    },
  });
};

// OTP hooks
export const useSendOtp = () => {
  return useMutation({
    mutationFn: async (data: OtpData) => {
      const response = await api.post(endpoints.auth.sendOtp, data);
      return handleApiResponse(response);
    },
  });
};

export const useVerifyOtp = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: VerifyOtpData) => {
      const response = await api.post(endpoints.auth.verifyOtp, data);
      return handleApiResponse<VerifyOtpResponse>(response);
    },
    onSuccess: (data, variables) => {
      // If email verification and we get an access token, log the user in
      if (variables.type === 'email_verification' && data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        queryClient.invalidateQueries({ queryKey: ['user'] });
        queryClient.setQueryData(['user'], data.user);
      } else if (variables.type === 'email_verification') {
        // Just email verification without login
        queryClient.invalidateQueries({ queryKey: ['user'] });
      }
    },
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: async (data: OtpData) => {
      const response = await api.post(endpoints.auth.resendOtp, data);
      return handleApiResponse(response);
    },
  });
};

// User profile hooks
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      const response = await api.patch(endpoints.users.updateProfile, data);
      return handleApiResponse<User>(response);
    },
    onSuccess: () => {
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const response = await api.post(endpoints.users.changePassword, data);
      return handleApiResponse(response);
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to change password');
    },
  });
};

// Main auth hook that combines all functionality
export const useAuth = () => {
  const { data: user, isLoading, error } = useUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const { resetSessionTimer, lastActivity, showWarning, timeRemaining, handleStayLoggedIn, handleLogout } = useSessionTimeout();
  const queryClient = useQueryClient();

  const isAuthenticated = !!user && !error;

  const login = async (credentials: LoginData) => {
    await loginMutation.mutateAsync(credentials);
  };

  const register = async (data: RegisterData) => {
    // This would typically be handled by a separate register mutation
    throw new Error('Register functionality should be handled separately');
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  const updateUser = (userData: Partial<User>) => {
    // This would typically update the user in the cache
    // For now, we'll just invalidate the query
    queryClient.invalidateQueries({ queryKey: ['user'] });
  };

  const checkAuth = async () => {
    // This would typically check if the current token is valid
    // For now, we'll just check if we have a user
    if (!user && !isLoading) {
      throw new Error('Not authenticated');
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    checkAuth,
    showWarning,
    timeRemaining,
    handleStayLoggedIn,
    handleLogout,
    resetSessionTimer,
    lastActivity,
  };
}; 