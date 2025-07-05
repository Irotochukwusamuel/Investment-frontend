'use client'

import { useUser } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WalletIcon, ChartBarIcon, ArrowTrendingUpIcon, ArrowDownTrayIcon, Cog6ToothIcon, UserIcon, BellIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Import admin components with dynamic loading
const NoticeBoardComponent = dynamic(() => import('@/components/admin/NoticeBoardComponent'), { ssr: false });
const WalletManagementComponent = dynamic(() => import('@/components/admin/WalletManagementComponent'), { ssr: false });
const ROIManagementComponent = dynamic(() => import('@/components/admin/ROIManagementComponent'), { ssr: false });
const InvestmentPlansComponent = dynamic(() => import('@/components/admin/InvestmentPlansComponent'), { ssr: false });
const InvestmentsComponent = dynamic(() => import('@/components/admin/InvestmentsComponent'), { ssr: false });
const WithdrawalsComponent = dynamic(() => import('@/components/admin/WithdrawalsComponent'), { ssr: false });
const UserManagementComponent = dynamic(() => import('@/components/admin/UserManagementComponent'), { ssr: false });
const SettingsComponent = dynamic(() => import('@/components/admin/SettingsComponent'), { ssr: false });

export default function AdminPage() {
  const { data: user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="space-y-8 max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff5858] mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="space-y-8 max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-base sm:text-lg text-gray-500">Manage all aspects of the platform</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] hover:from-[#ff4848] hover:via-[#ff6e4f] hover:to-[#ff8956] text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
          >
            ← Back to Dashboard
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="overflow-hidden border-2">
          <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
            <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent tracking-tight">
              Platform Management
            </CardTitle>
            <p className="text-base sm:text-lg text-gray-500 mt-1">Comprehensive admin controls for the investment platform</p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="notice" className="w-full">
              <TabsList className="grid w-full grid-cols-8 mb-4">
                <TabsTrigger value="notice" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff5858] data-[state=active]:via-[#ff7e5f] data-[state=active]:to-[#ff9966] data-[state=active]:text-white">
                  <BellIcon className="h-5 w-5" /> Notice Board
                </TabsTrigger>
                <TabsTrigger value="wallet" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff5858] data-[state=active]:via-[#ff7e5f] data-[state=active]:to-[#ff9966] data-[state=active]:text-white">
                  <WalletIcon className="h-5 w-5" /> Wallet
                </TabsTrigger>
                <TabsTrigger value="roi" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff5858] data-[state=active]:via-[#ff7e5f] data-[state=active]:to-[#ff9966] data-[state=active]:text-white">
                  <ArrowTrendingUpIcon className="h-5 w-5" /> ROI
                </TabsTrigger>
                <TabsTrigger value="plans" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff5858] data-[state=active]:via-[#ff7e5f] data-[state=active]:to-[#ff9966] data-[state=active]:text-white">
                  <ChartBarIcon className="h-5 w-5" /> Plans
                </TabsTrigger>
                <TabsTrigger value="investments" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff5858] data-[state=active]:via-[#ff7e5f] data-[state=active]:to-[#ff9966] data-[state=active]:text-white">
                  <ChartBarIcon className="h-5 w-5" /> Investments
                </TabsTrigger>
                <TabsTrigger value="withdrawals" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff5858] data-[state=active]:via-[#ff7e5f] data-[state=active]:to-[#ff9966] data-[state=active]:text-white">
                  <ArrowDownTrayIcon className="h-5 w-5" /> Withdrawals
                </TabsTrigger>
                <TabsTrigger value="users" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff5858] data-[state=active]:via-[#ff7e5f] data-[state=active]:to-[#ff9966] data-[state=active]:text-white">
                  <UserIcon className="h-5 w-5" /> Users
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff5858] data-[state=active]:via-[#ff7e5f] data-[state=active]:to-[#ff9966] data-[state=active]:text-white">
                  <Cog6ToothIcon className="h-5 w-5" /> Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="notice">
                <NoticeBoardComponent />
              </TabsContent>
              <TabsContent value="wallet">
                <WalletManagementComponent />
              </TabsContent>
              <TabsContent value="roi">
                <ROIManagementComponent />
              </TabsContent>
              <TabsContent value="plans">
                <InvestmentPlansComponent />
              </TabsContent>
              <TabsContent value="investments">
                <InvestmentsComponent />
              </TabsContent>
              <TabsContent value="withdrawals">
                <WithdrawalsComponent />
              </TabsContent>
              <TabsContent value="users">
                <UserManagementComponent />
              </TabsContent>
              <TabsContent value="settings">
                <SettingsComponent />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 