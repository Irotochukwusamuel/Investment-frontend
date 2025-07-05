import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '../api';

export interface Bank {
  id: string;
  name: string;
  code: string;
  sortCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface BankDetails {
  _id: string;
  userId: string;
  bankName: string;
  bankCode: string;
  sortCode: string;
  accountNumber: string;
  accountName: string;
  isActive: boolean;
  isVerified: boolean;
  verifiedAt?: string;
  verificationData?: any;
  createdAt: string;
  updatedAt: string;
}

export interface AccountVerification {
  accountNumber: string;
  accountName: string;
  bankCode: string;
  bankName: string;
}

export interface CreateBankDetailsDto {
  bankName: string;
  bankCode: string;
  sortCode: string;
  accountNumber: string;
  accountName: string;
}

export interface UpdateBankDetailsDto {
  bankName?: string;
  bankCode?: string;
  sortCode?: string;
  accountNumber?: string;
  accountName?: string;
  isActive?: boolean;
}

// Get list of banks
export const useBankList = () => {
  return useQuery({
    queryKey: ['banks'],
    queryFn: async (): Promise<Bank[]> => {
      const response = await api.get('/payments/banks');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

// Verify account details
export const useVerifyAccount = () => {
  return useMutation({
    mutationFn: async ({ accountNumber, sortCode }: { accountNumber: string; sortCode: string }): Promise<AccountVerification> => {
      const response = await api.get(`/payments/verify-account?accountNumber=${accountNumber}&sortCode=${sortCode}`);
      
      // Handle the nested response structure
      const apiData = response.data.data;
      
      // Check if the response has the nested account structure
      if (apiData.account) {
        return {
          accountNumber: apiData.account.accountNumber,
          accountName: apiData.account.accountName,
          bankCode: apiData.account.bankCode,
          bankName: apiData.account.bankName || '', // May need to be populated from bank list
        };
      }
      
      // Fallback to direct structure if no nested account
      return {
        accountNumber: apiData.accountNumber,
        accountName: apiData.accountName,
        bankCode: apiData.bankCode,
        bankName: apiData.bankName || '',
      };
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to verify account details';
      toast.error(message);
    },
  });
};

// Get user bank details
export const useBankDetails = () => {
  return useQuery({
    queryKey: ['bank-details'],
    queryFn: async (): Promise<BankDetails[]> => {
      const response = await api.get('/users/bank-details');
      return response.data;
    },
  });
};

// Get active bank details for withdrawals
export const useActiveBankDetails = () => {
  return useQuery({
    queryKey: ['active-bank-details'],
    queryFn: async (): Promise<BankDetails | null> => {
      const response = await api.get('/users/bank-details/active');
      return response.data;
    },
  });
};

// Create bank details
export const useCreateBankDetails = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateBankDetailsDto): Promise<BankDetails> => {
      const response = await api.post('/users/bank-details', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-details'] });
      toast.success('Bank details saved successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to save bank details';
      toast.error(message);
    },
  });
};

// Update bank details
export const useUpdateBankDetails = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateBankDetailsDto }): Promise<BankDetails> => {
      const response = await api.patch(`/users/bank-details/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-details'] });
      toast.success('Bank details updated successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update bank details';
      toast.error(message);
    },
  });
};

// Delete bank details
export const useDeleteBankDetails = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await api.delete(`/users/bank-details/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-details'] });
      toast.success('Bank details deleted successfully');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete bank details';
      toast.error(message);
    },
  });
}; 