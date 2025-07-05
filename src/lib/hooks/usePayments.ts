import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { toast } from 'sonner';

export interface VirtualWallet {
  _id: string;
  userId: string;
  customerName: string;
  email: string;
  phone: string;
  amount: number;
  merchantReference: string;
  description: string;
  expireTimeInMin: number;
  expiresAt: string;
  status: 'PENDING' | 'ACTIVE' | 'PAID' | 'EXPIRED' | 'CANCELLED';
  fintavaId?: string;
  bank?: string;
  virtualAcctName?: string;
  virtualAcctNo?: string;
  paymentStatus?: string;
  requestTime?: string;
  paymentTime?: string;
  metadata?: Record<string, any>;
  webhookData?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVirtualWalletData {
  amount: number;
  expireTimeInMin?: number;
}

export interface VirtualWalletResponse {
  success: boolean;
  message: string;
  data: VirtualWallet;
}

export interface VirtualWalletsResponse {
  success: boolean;
  message: string;
  data: {
    wallets: VirtualWallet[];
    total: number;
    page: number;
    totalPages: number;
  };
}

const handleApiResponse = <T>(response: any): T => {
  if (response.data.success) {
    return response.data.data;
  }
  throw new Error(response.data.message || 'API request failed');
};

export const useCreateVirtualWallet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateVirtualWalletData) => {
      const response = await api.post('/payments/virtual-wallet/simple', data);
      return handleApiResponse<VirtualWallet>(response);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['virtual-wallets'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      toast.success('Virtual wallet created successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create virtual wallet';
      
      // Provide specific error messages for common issues
      if (errorMessage.includes('phone number is required')) {
        toast.error('Please update your phone number in your profile before creating a virtual wallet');
      } else if (errorMessage.includes('Invalid API Key')) {
        toast.error('Payment system configuration error. Please contact support.');
      } else {
        toast.error(errorMessage);
      }
    },
  });
};

export const useVirtualWallets = (options?: { limit?: number; page?: number }) => {
  return useQuery({
    queryKey: ['virtual-wallets', options],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.page) params.append('page', options.page.toString());
      
      const response = await api.get(`/payments/virtual-wallets?${params.toString()}`);
      return handleApiResponse<VirtualWalletsResponse['data']>(response);
    },
    staleTime: 30000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useVirtualWallet = (id: string) => {
  return useQuery({
    queryKey: ['virtual-wallet', id],
    queryFn: async () => {
      const response = await api.get(`/payments/virtual-wallet/${id}`);
      return handleApiResponse<VirtualWallet>(response);
    },
    enabled: !!id,
    staleTime: 10000, // 10 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCancelVirtualWallet = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/payments/virtual-wallet/${id}`);
      return handleApiResponse<VirtualWallet>(response);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['virtual-wallets'] });
      queryClient.invalidateQueries({ queryKey: ['virtual-wallet', data._id] });
      toast.success('Virtual wallet cancelled successfully');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to cancel virtual wallet';
      toast.error(errorMessage);
    },
  });
};

// Utility function to format time remaining
export const formatTimeRemaining = (expiresAt: string): string => {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();
  
  if (diff <= 0) {
    return 'Expired';
  }
  
  const minutes = Math.floor(diff / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  
  return `${seconds}s`;
};

// Utility function to check if virtual wallet is expired
export const isVirtualWalletExpired = (expiresAt: string): boolean => {
  const now = new Date();
  const expires = new Date(expiresAt);
  return expires.getTime() <= now.getTime();
};

// Utility function to get status color
export const getStatusColor = (status: VirtualWallet['status']): string => {
  switch (status) {
    case 'ACTIVE':
      return 'text-blue-600 bg-blue-50';
    case 'PAID':
      return 'text-green-600 bg-green-50';
    case 'EXPIRED':
      return 'text-red-600 bg-red-50';
    case 'CANCELLED':
      return 'text-gray-600 bg-gray-50';
    default:
      return 'text-yellow-600 bg-yellow-50';
  }
}; 