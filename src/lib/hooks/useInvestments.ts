import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, endpoints, handleApiResponse } from '../api';
import { toast } from 'sonner';

// Types
export interface InvestmentPlan {
  id: string;
  name: string;
  description: string;
  currency: 'naira' | 'usdt';
  minAmount: number;
  maxAmount: number;
  dailyRoi: number;
  totalRoi: number;
  duration: number;
  welcomeBonus: number;
  referralBonus: number;
  features: string[];
  popularity: number;
  totalInvestors: number;
  totalVolume: number;
  status: string;
  priority: number;
  icon?: string;
  color?: string;
  autoReinvestEnabled: boolean;
  earlyWithdrawalPenalty: number;
  minWithdrawalAmount: number;
  maxWithdrawalAmount: number;
  withdrawalProcessingTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface Investment {
  id: string;
  userId: string;
  planId: string;
  plan: InvestmentPlan;
  amount: number;
  currency: 'naira' | 'usdt';
  dailyRoi: number;
  totalRoi: number;
  duration: number;
  startDate: string;
  endDate: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'paused';
  totalEarnings: number;
  totalPayouts: number;
  pendingPayouts: number;
  dailyEarnings: number;
  projectedEarnings: number;
  progress: number;
  autoReinvest: boolean;
  autoReinvestPercentage: number;
  welcomeBonus: number;
  referralBonus: number;
  payoutHistory: Array<{
    id: string;
    amount: number;
    currency: 'naira' | 'usdt';
    type: 'roi';
    status: 'pending' | 'completed' | 'failed';
    createdAt: string;
    description: string;
    reference: string;
  }>;
  lastPayoutDate?: string;
  nextPayoutDate?: string;
  nextRoiUpdate?: string;
  earnedAmount: number;
  expectedReturn: number;
  lastRoiUpdate?: string;
}

export interface CreateInvestmentData {
  planId: string;
  amount: number;
  currency: 'naira' | 'usdt';
  autoReinvest?: boolean;
}

export interface InvestmentStats {
  totalInvestments: number;
  activeInvestments: number;
  totalAmount: number;
  totalEarnings: number;
  averageRoi: number;
  totalPayouts: number;
  pendingPayouts: number;
  completionRate: number;
  topPerformingPlan?: InvestmentPlan;
  recentInvestments: Investment[];
}

// Investment Plan hooks
export const useInvestmentPlans = (filters?: { currency?: string; status?: string }) => {
  return useQuery({
    queryKey: ['investment-plans', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.currency) params.append('currency', filters.currency);
      if (filters?.status) params.append('status', filters.status);
      
      const response = await api.get(`${endpoints.plans.all}?${params.toString()}`);
      return handleApiResponse<InvestmentPlan[]>(response);
    },
  });
};

export const useInvestmentPlan = (id: string) => {
  return useQuery({
    queryKey: ['investment-plan', id],
    queryFn: async () => {
      const response = await api.get(endpoints.plans.byId(id));
      return handleApiResponse<InvestmentPlan>(response);
    },
    enabled: !!id,
  });
};

// Investment hooks
export const useMyInvestments = () => {
  return useQuery({
    queryKey: ['investments', 'my'],
    queryFn: async () => {
      const response = await api.get(endpoints.investments.my);
      return handleApiResponse<Investment[]>(response);
    },
  });
};

export const useInvestment = (id: string) => {
  return useQuery({
    queryKey: ['investment', id],
    queryFn: async () => {
      const response = await api.get(endpoints.investments.byId(id));
      return handleApiResponse<Investment>(response);
    },
    enabled: !!id,
  });
};

export const useCreateInvestment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateInvestmentData) => {
      const response = await api.post(endpoints.investments.create, data);
      return handleApiResponse<Investment>(response);
    },
    onSuccess: (data) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      // Don't show toast here since we'll show the confirmation modal instead
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create investment');
    },
  });
};

export const useCancelInvestment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const response = await api.post(endpoints.investments.cancel(id), { reason });
      return handleApiResponse<Investment>(response);
    },
    onSuccess: () => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['investments'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      toast.success('Investment cancelled successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel investment');
    },
  });
};

export const useInvestmentStats = () => {
  return useQuery({
    queryKey: ['investments', 'stats'],
    queryFn: async () => {
      const response = await api.get(endpoints.investments.stats);
      return handleApiResponse<InvestmentStats>(response);
    },
  });
}; 