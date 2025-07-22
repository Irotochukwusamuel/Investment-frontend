import { useQuery } from '@tanstack/react-query';
import { api, endpoints } from '@/lib/api';

interface UsdtFeatureSettings {
  usdtWithdrawalEnabled: boolean;
  usdtInvestmentEnabled: boolean;
}

export const useUsdtSettings = () => {
  return useQuery<UsdtFeatureSettings>({
    queryKey: ['usdt-settings'],
    queryFn: async () => {
      const response = await api.get(endpoints.admin.usdtFeatures);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 