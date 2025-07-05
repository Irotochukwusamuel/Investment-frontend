'use client'

import { useUser } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WalletIcon, ChartBarIcon, ArrowTrendingUpIcon, ArrowDownTrayIcon, Cog6ToothIcon, UserIcon, BellIcon } from '@heroicons/react/24/outline';
import NoticeBoardComponent from '@/components/admin/NoticeBoardComponent';
import WalletManagementComponent from '@/components/admin/WalletManagementComponent';
import ROIManagementComponent from '@/components/admin/ROIManagementComponent';
import dynamic from 'next/dynamic';
import UserManagementComponent from '@/components/admin/UserManagementComponent';
import SettingsComponent from '@/components/admin/SettingsComponent';

const WithdrawalsComponent = dynamic(() => import('@/components/admin/WithdrawalsComponent'), { ssr: false });
const InvestmentsComponent = dynamic(() => import('@/components/admin/InvestmentsComponent'), { ssr: false });
const InvestmentPlansComponent = dynamic(() => import('@/components/admin/InvestmentPlansComponent'), { ssr: false });

export default function AdminDashboardPage() {
  const { data: user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-8 max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
      <Card className="overflow-hidden border-2">
        <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
          <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent tracking-tight">
            Admin Dashboard
          </CardTitle>
          <p className="text-base sm:text-lg text-gray-500 mt-1">Manage all aspects of the platform</p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="notice" className="w-full">
            <TabsList className="grid w-full grid-cols-8 mb-4">
              <TabsTrigger value="notice"><BellIcon className="h-5 w-5" /> Notice Board</TabsTrigger>
              <TabsTrigger value="wallet"><WalletIcon className="h-5 w-5" /> Wallet</TabsTrigger>
              <TabsTrigger value="roi"><ArrowTrendingUpIcon className="h-5 w-5" /> ROI</TabsTrigger>
              <TabsTrigger value="plans"><ChartBarIcon className="h-5 w-5" /> Plans</TabsTrigger>
              <TabsTrigger value="investments"><ChartBarIcon className="h-5 w-5" /> Investments</TabsTrigger>
              <TabsTrigger value="withdrawals"><ArrowDownTrayIcon className="h-5 w-5" /> Withdrawals</TabsTrigger>
              <TabsTrigger value="users"><UserIcon className="h-5 w-5" /> Users</TabsTrigger>
              <TabsTrigger value="settings"><Cog6ToothIcon className="h-5 w-5" /> Settings</TabsTrigger>
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
    </div>
  );
} 