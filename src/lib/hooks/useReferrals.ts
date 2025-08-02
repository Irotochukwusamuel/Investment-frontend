import { useQuery } from '@tanstack/react-query'
import { api, endpoints } from '@/lib/api'

export interface ReferredUser {
  id: string
  firstName: string
  lastName: string
  email: string
  isActive: boolean
  totalEarnings: number
  totalInvestments: number
  referralBonus: number
  bonusPaid: boolean
  status: 'pending' | 'active' | 'inactive' | 'completed'
  createdAt: string
  lastActivityAt?: string
  firstInvestmentAt?: string
}

export interface ReferralStats {
  totalReferrals: number
  activeReferrals: number
  totalEarnings: number
  totalEarningsUsdt: number
  totalBonus: number
  totalBonusUsdt: number
  pendingBonus: number
  pendingBonusUsdt: number
}

export interface ReferralsResponse {
  success: boolean
  data: ReferredUser[]
  stats: ReferralStats
  total: number
}

export function useReferrals() {
  return useQuery<ReferredUser[]>({
    queryKey: ['referrals'],
    queryFn: async () => {
      try {
        const response = await api.get<ReferralsResponse>(endpoints.referrals.getMyReferrals)
        
        // Validate response structure
        if (response.data && response.data.success && Array.isArray(response.data.data)) {
          return response.data.data
        }
        
        console.warn('Invalid referrals response structure:', response.data)
        return []
      } catch (error: any) {
        console.error('Failed to fetch referrals:', error)
        
        // Handle specific error cases
        if (error.response?.status === 401) {
          console.error('Unauthorized access to referrals')
        } else if (error.response?.status === 404) {
          console.error('Referrals endpoint not found')
        } else if (error.code === 'NETWORK_ERROR') {
          console.error('Network error while fetching referrals')
        }
        
        return []
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 401 (unauthorized) or 404 (not found)
      if (error.response?.status === 401 || error.response?.status === 404) {
        return false
      }
      return failureCount < 3
    },
  })
}

export function useReferralStats() {
  return useQuery<ReferralStats>({
    queryKey: ['referral-stats'],
    queryFn: async () => {
      try {
        const response = await api.get<ReferralStats>(endpoints.referrals.getMyStats)
        return response.data
      } catch (error: any) {
        console.error('Failed to fetch referral stats:', error)
        return {
          totalReferrals: 0,
          activeReferrals: 0,
          totalEarnings: 0,
          totalEarningsUsdt: 0,
          totalBonus: 0,
          totalBonusUsdt: 0,
          pendingBonus: 0,
          pendingBonusUsdt: 0
        }
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
} 