'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export interface WithdrawalRequest {
  amount: number;
  currency: 'naira' | 'usdt';
  withdrawalMethod: 'bank_transfer' | 'crypto';
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    bankCode: string;
    sortCode: string;
  };
  cryptoDetails?: {
    walletAddress: string;
    network: string;
  };
}

export interface Withdrawal {
  _id: string;
  userId: string;
  amount: number;
  currency: 'naira' | 'usdt';
  fee: number;
  netAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  withdrawalMethod: 'bank_transfer' | 'crypto';
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    bankCode: string;
    sortCode: string;
  };
  cryptoDetails?: {
    walletAddress: string;
    network: string;
  };
  reference: string;
  externalReference?: string;
  processedAt?: string;
  processedBy?: string;
  failureReason?: string;
  notes?: string[];
  createdAt: string;
  updatedAt: string;
}

// Create withdrawal request
export const useCreateWithdrawal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: WithdrawalRequest): Promise<Withdrawal> => {
      const response = await api.post('/withdrawals', data);
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success('Withdrawal request submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to submit withdrawal request';
      toast.error(message);
    },
  });
};

// Get user withdrawals
export const useWithdrawals = (options?: {
  status?: string;
  limit?: number;
  page?: number;
}) => {
  const queryParams = new URLSearchParams();
  if (options?.status) queryParams.append('status', options.status);
  if (options?.limit) queryParams.append('limit', options.limit.toString());
  if (options?.page) queryParams.append('page', options.page.toString());

  return useQuery({
    queryKey: ['withdrawals', options],
    queryFn: async (): Promise<{
      withdrawals: Withdrawal[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
      };
    }> => {
      const response = await api.get(`/withdrawals?${queryParams.toString()}`);
      return response.data.data;
    },
  });
};

// Get single withdrawal
export const useWithdrawal = (id: string) => {
  return useQuery({
    queryKey: ['withdrawal', id],
    queryFn: async (): Promise<Withdrawal> => {
      const response = await api.get(`/withdrawals/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Cancel withdrawal
export const useCancelWithdrawal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<Withdrawal> => {
      const response = await api.patch(`/withdrawals/${id}/cancel`);
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success('Withdrawal cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['withdrawal', data._id] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to cancel withdrawal';
      toast.error(message);
    },
  });
};

// Admin: Process withdrawal
export const useProcessWithdrawal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      action, 
      externalReference,
      notes 
    }: { 
      id: string; 
      action: 'approve' | 'reject'; 
      externalReference?: string;
      notes?: string;
    }): Promise<Withdrawal> => {
      const response = await api.patch(`/withdrawals/${id}/process`, {
        action,
        externalReference,
        notes,
      });
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success(`Withdrawal ${data.status} successfully`);
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['withdrawal', data._id] });
      queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to process withdrawal';
      toast.error(message);
    },
  });
};

// Admin: Get all withdrawals
export const useAdminWithdrawals = (options?: {
  status?: string;
  userId?: string;
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  const queryParams = new URLSearchParams();
  if (options?.status) queryParams.append('status', options.status);
  if (options?.userId) queryParams.append('userId', options.userId);
  if (options?.limit) queryParams.append('limit', options.limit.toString());
  if (options?.page) queryParams.append('page', options.page.toString());
  if (options?.sortBy) queryParams.append('sortBy', options.sortBy);
  if (options?.sortOrder) queryParams.append('sortOrder', options.sortOrder);

  return useQuery({
    queryKey: ['admin-withdrawals', options],
    queryFn: async (): Promise<{
      withdrawals: Withdrawal[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
      };
      stats: {
        totalAmount: number;
        pendingCount: number;
        processingCount: number;
        completedCount: number;
        failedCount: number;
      };
    }> => {
      const response = await api.get(`/admin/withdrawals?${queryParams.toString()}`);
      return response.data.data;
    },
  });
};

// Get withdrawal statistics
export const useWithdrawalStats = (period?: 'day' | 'week' | 'month' | 'year') => {
  return useQuery({
    queryKey: ['withdrawal-stats', period],
    queryFn: async (): Promise<{
      totalAmount: number;
      totalCount: number;
      pendingAmount: number;
      pendingCount: number;
      completedAmount: number;
      completedCount: number;
      failedAmount: number;
      failedCount: number;
      averageAmount: number;
      averageProcessingTime: number; // in hours
    }> => {
      const response = await api.get(`/withdrawals/stats${period ? `?period=${period}` : ''}`);
      return response.data.data;
    },
  });
}; 