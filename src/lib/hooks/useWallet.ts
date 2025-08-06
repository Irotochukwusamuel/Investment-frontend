import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, endpoints, handleApiResponse } from '../api';
import { toast } from 'sonner';
import { useUser } from './useAuth';

// Types
export interface WalletBalance {
  walletBalances: {
    naira: number;
    usdt: number;
  };
  profitBalances: {
    naira: number;
    usdt: number;
  };
  lockedBalances: {
    naira: number;
    usdt: number;
  };
  lockedWelcomeBonuses: {
    naira: number;
    usdt: number;
  };
  lockedReferralBonuses: {
    naira: number;
    usdt: number;
  };
  totalBalance: {
    naira: number;
    usdt: number;
  };
  totalInvested: number;
  totalEarnings: number;
  referralEarnings: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'roi' | 'bonus' | 'referral' | 'transfer' | 'fee' | 'refund';
  amount: number;
  currency: 'naira' | 'usdt';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  description: string;
  reference: string;
  externalReference?: string;
  investmentId?: string;
  planId?: string;
  relatedTransactionId?: string;
  fee?: number;
  feePercentage?: number;
  netAmount?: number;
  exchangeRate?: number;
  convertedAmount?: number;
  convertedCurrency?: string;
  paymentMethod?: string;
  paymentProvider?: string;
  paymentDetails?: {
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
    walletAddress?: string;
    network?: string;
    transactionHash?: string;
  };
  metadata?: {
    ip?: string;
    userAgent?: string;
    location?: string;
    device?: string;
    [key: string]: any;
  };
  processedAt?: string;
  processedBy?: string;
  failedAt?: string;
  failureReason?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  retryCount: number;
  nextRetryAt?: string;
  isReversed: boolean;
  reversalTransactionId?: string;
  reversedAt?: string;
  reversedBy?: string;
  reversalReason?: string;
  notes: string[];
  tags?: string[];
  priority: number;
  isAutomated: boolean;
  scheduledAt?: string;
  executedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepositData {
  amount: number;
  currency: 'naira' | 'usdt';
  paymentMethod: 'bank_transfer' | 'crypto' | 'card';
  paymentGateway?: string;
  metadata?: Record<string, any>;
}

export interface CreateWithdrawalData {
  amount: number;
  currency: 'naira' | 'usdt';
  notes?: string;
}

export interface TransferData {
  fromWallet: 'main' | 'profit';
  toWallet: 'main' | 'profit';
  amount: number;
  currency: 'NGN' | 'USDT';
}

export interface WalletStats {
  totalDeposits: number;
  totalWithdrawals: number;
  totalInvestments: number;
  totalEarnings: number;
  totalFees: number;
  netProfit: number;
  averageDeposit: number;
  averageWithdrawal: number;
  depositCount: number;
  withdrawalCount: number;
  investmentCount: number;
  transactionCount: number;
  recentTransactions: Transaction[];
  monthlyStats: Array<{
    month: string;
    deposits: number;
    withdrawals: number;
    investments: number;
    earnings: number;
  }>;
}

// Wallet hooks
export const useWalletBalance = () => {
  const { data: user } = useUser();
  
  return useQuery({
    queryKey: ['wallet', 'balance', user?.id],
    queryFn: async () => {
      // Get current user's wallet
      const response = await api.get(`/wallets?userId=${user?.id}`);
      const wallets = handleApiResponse<any[]>(response);
      
      // Get the main wallet (should be the only wallet now)
      const mainWallet = wallets.find(w => w.type === 'main') || { nairaBalance: 0, usdtBalance: 0 };
      
      // Get detailed bonus information
      const bonusResponse = await api.get(`/wallets/user/${user?.id}/bonuses`);
      const bonusDetails = handleApiResponse<any>(bonusResponse);
      
      return {
        walletBalances: {
          naira: mainWallet.nairaBalance || 0,
          usdt: mainWallet.usdtBalance || 0,
        },
        profitBalances: {
          naira: 0, // No separate profit wallet
          usdt: 0,
        },
        lockedBalances: {
          naira: bonusDetails.totalLockedBonuses?.naira || 0,
          usdt: bonusDetails.totalLockedBonuses?.usdt || 0,
        },
        lockedWelcomeBonuses: {
          naira: bonusDetails.lockedWelcomeBonuses?.naira || 0,
          usdt: bonusDetails.lockedWelcomeBonuses?.usdt || 0,
        },
        lockedReferralBonuses: {
          naira: bonusDetails.lockedReferralBonuses?.naira || 0,
          usdt: bonusDetails.lockedReferralBonuses?.usdt || 0,
        },
        totalBalance: {
          naira: (mainWallet.nairaBalance || 0) + (bonusDetails.totalLockedBonuses?.naira || 0),
          usdt: (mainWallet.usdtBalance || 0) + (bonusDetails.totalLockedBonuses?.usdt || 0),
        },
        totalInvested: mainWallet.totalInvestments || 0,
        totalEarnings: mainWallet.totalEarnings || 0,
        referralEarnings: mainWallet.totalReferralEarnings || 0,
      };
    },
    enabled: !!user?.id, // Only run query when user is available
  });
};

export const useCreateDeposit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateDepositData) => {
      const response = await api.post('/transactions', {
        type: 'deposit',
        amount: data.amount,
        currency: data.currency,
        description: `Deposit via ${data.paymentMethod}`,
        status: 'pending',
      });
      return handleApiResponse<Transaction>(response);
    },
    onSuccess: () => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Deposit request created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create deposit request');
    },
  });
};

export const useCreateWithdrawal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateWithdrawalData) => {
      const response = await api.post('/withdrawals', {
        amount: data.amount,
        currency: data.currency,
        notes: data.notes,
      });
      return handleApiResponse<Transaction>(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['withdrawals', 'my'] });
      toast.success('Withdrawal request created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create withdrawal request');
    },
  });
};

export const useTransfer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: TransferData) => {
      const response = await api.post('/transactions', {
        type: 'transfer',
        amount: data.amount,
        currency: data.currency,
        description: `Transfer from ${data.fromWallet} to ${data.toWallet}`,
        status: 'pending',
      });
      return handleApiResponse<Transaction>(response);
    },
    onSuccess: () => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transfer completed successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to complete transfer');
    },
  });
};

export const useTransactionHistory = (filters?: {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  currency?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  return useQuery({
    queryKey: ['transactions', 'my', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.type) params.append('type', filters.type);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.currency) params.append('currency', filters.currency);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.sortBy) params.append('sortBy', filters.sortBy);
      if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
      
      const response = await api.get(`${endpoints.transactions.my}?${params.toString()}`);
     
      const transactions = handleApiResponse<Transaction[]>(response);
      
      return {
        transactions,
        pagination: {
          page: filters?.page || 1,
          limit: filters?.limit || 50,
          total: transactions.length,
          pages: 1,
        },
        };
    },
  });
};

export const useWalletStats = () => {
  return useQuery({
    queryKey: ['wallet', 'stats'],
    queryFn: async () => {
      const response = await api.get(endpoints.wallet.stats);
      return handleApiResponse<WalletStats>(response);
    },
  });
};

// Withdrawal settings hook
export const useWithdrawalSettings = () => {
  return useQuery({
    queryKey: ['settings', 'withdrawal'],
    queryFn: async () => {
      const response = await api.get(endpoints.settings.publicWithdrawal);
      
      let result;
      if (response.data && response.data.data) {
        result = response.data.data;
      } else {
        result = response.data;
      }
      
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - settings don't change often
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}; 

// Platform settings hook for deposit fees and limits
export const usePlatformSettings = () => {
  return useQuery({
    queryKey: ['settings', 'platform'],
    queryFn: async () => {
      const response = await api.get(endpoints.admin.settings);
      // If backend wraps in { data }, unwrap, else return as is
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 

export const useBonusWithdrawalPeriod = () => {
  return useQuery({
    queryKey: ['settings', 'bonusWithdrawalPeriod'],
    queryFn: async () => {
      const response = await api.get(endpoints.settings.bonusWithdrawalPeriod);
      const data = response.data;
      
      // Get the values from the response
      const value = data.bonusWithdrawalPeriod || 15;
      const unit = data.bonusWithdrawalUnit || 'days';
      
      // Calculate periodMs based on the unit
      let periodMs: number;
      switch (unit) {
        case 'minutes':
          periodMs = value * 60 * 1000;
          break;
        case 'hours':
          periodMs = value * 60 * 60 * 1000;
          break;
        case 'days':
        default:
          periodMs = value * 24 * 60 * 60 * 1000;
          break;
      }
      
      // Return both value and unit, with proper defaults
      const result = {
        value,
        unit,
        periodMs: data.bonusWithdrawalPeriodMs || periodMs,
        displayText: `${value} ${unit}`
      };
      
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - settings don't change often
    gcTime: 10 * 60 * 1000, // 10 minutes cache
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}; 

// Bonus countdown hook - fetches real-time countdown from backend
export const useBonusCountdown = () => {
  return useQuery({
    queryKey: ['users', 'bonus-countdown'],
    queryFn: async () => {
      const response = await api.get(endpoints.users.bonusCountdown);
      return handleApiResponse<{
        canWithdraw: boolean;
        timeLeft: string;
        daysLeft: number;
        nextWithdrawalDate?: string;
        progress: number;
        timeLeftMs: number;
        formattedTimeLeft: string;
      }>(response);
    },
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchIntervalInBackground: false,
    staleTime: 5000, // Consider data fresh for 5 seconds
    gcTime: 30 * 1000, // Cache for 30 seconds
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};

// User withdrawals hook - gets withdrawal data directly
export const useUserWithdrawals = () => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['withdrawals', 'my'],
    queryFn: async () => {
      const response = await api.get('/withdrawals/my');
      
      // Return the full response structure that the frontend expects
      const fullResponse = {
        success: response.data.success,
        data: response.data.data, // This is the withdrawals array
        stats: response.data.stats,
        total: response.data.total
      };
      
      return fullResponse;
    },
    staleTime: 0, // Always consider data stale - force refetch
    gcTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnMount: true, // Always refetch on mount
    refetchOnReconnect: true, // Refetch on reconnect
    retry: 1, // Retry once on failure
  });

  // Manual refresh function
  const refreshWithdrawals = () => {
    queryClient.invalidateQueries({ queryKey: ['withdrawals', 'my'] });
    queryClient.removeQueries({ queryKey: ['withdrawals', 'my'] });
  };

  return {
    ...query,
    refreshWithdrawals,
  };
}; 