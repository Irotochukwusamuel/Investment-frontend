import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, endpoints, handleApiResponse } from '../api';
import { toast } from 'sonner';

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