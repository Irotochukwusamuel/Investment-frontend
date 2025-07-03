import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, handleApiResponse } from '../api';
import { toast } from 'sonner';

interface WithdrawBonusResponse {
  success: boolean;
  message: string;
  amount?: number;
}

export const useWithdrawBonus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (): Promise<WithdrawBonusResponse> => {
      const response = await api.post('/investments/withdraw-bonus');
      return handleApiResponse<WithdrawBonusResponse>(response);
    },
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate and refetch related queries
        queryClient.invalidateQueries({ queryKey: ['wallet'] });
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        queryClient.invalidateQueries({ queryKey: ['investments'] });
        queryClient.invalidateQueries({ queryKey: ['investment-stats'] });
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to withdraw bonus');
    },
  });
}; 