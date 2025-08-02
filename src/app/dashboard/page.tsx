'use client'

import { useState, useEffect } from 'react'
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  WalletIcon,
  UserGroupIcon,
  ChartPieIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  BellIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useWalletBalance, useTransactionHistory } from '@/lib/hooks/useWallet'
import { useMyInvestments, useInvestmentStats } from '@/lib/hooks/useInvestments'
import { useUser } from '@/lib/hooks/useAuth'
import dynamic from 'next/dynamic'

// Import notice display component
const NoticeDisplay = dynamic(() => import('@/components/NoticeDisplay'), { ssr: false });

export default function DashboardPage() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: walletBalance, isLoading: walletLoading } = useWalletBalance()
  const { data: transactionData, isLoading: transactionsLoading } = useTransactionHistory({
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })
  
  const { data: investments, isLoading: investmentsLoading } = useMyInvestments()
  const { data: investmentStats, isLoading: statsLoading } = useInvestmentStats()
  const router = useRouter()
  const [showAllTransactions, setShowAllTransactions] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [transactionsPerPage] = useState(5)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')

  const isLoading = userLoading || walletLoading || transactionsLoading || investmentsLoading || statsLoading
  const isAdmin = user?.role === 'admin'

  // Helper to format currency
  const formatCurrency = (amount: number, currency: 'naira' | 'usdt') => {
    if (currency === 'naira') return `₦${amount.toLocaleString()}`;
    return `${amount} USDT`;
  };

  // Compute values from backend data
  const totalBalance = walletBalance?.totalBalance?.naira || 0
  const totalBalanceUSDT = walletBalance?.totalBalance?.usdt || 0
  const totalROI = investmentStats?.totalEarnings || 0
  const activePlans = investmentStats?.activeInvestments || 0
  const totalInvested = investmentStats?.totalAmount || 0
  const portfolioNaira = walletBalance?.totalBalance?.naira || 0
  const portfolioUSDT = walletBalance?.totalBalance?.usdt || 0
  const portfolioTotal = portfolioNaira + portfolioUSDT
  const nairaPercent = portfolioTotal > 0 ? (portfolioNaira / portfolioTotal) * 100 : 0
  const usdtPercent = portfolioTotal > 0 ? (portfolioUSDT / portfolioTotal) * 100 : 0

  // Transactions
  const allTransactions = transactionData?.transactions || []
  type Transaction = typeof allTransactions[number]
  const filteredTransactions = allTransactions.filter((transaction: Transaction) => {
    const matchesSearch = transaction.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.amount.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (transaction.createdAt || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  }).sort((a: Transaction, b: Transaction) => {
    if (sortBy === 'date') {
      return sortOrder === 'desc' 
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
    if (sortBy === 'amount') {
      const amountA = a.amount
      const amountB = b.amount
      return sortOrder === 'desc' ? amountB - amountA : amountA - amountB
    }
    return 0
  })
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage)
  const currentTransactions = filteredTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownIcon className="h-4 w-4 text-green-500" />
      case 'withdrawal':
        return <ArrowUpIcon className="h-4 w-4 text-red-500" />
      case 'investment':
        return <ChartBarIcon className="h-4 w-4 text-blue-500" />
      case 'roi':
        return <CurrencyDollarIcon className="h-4 w-4 text-purple-500" />
      default:
        return null
    }
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
            Dashboard
          </h1>
          <p className="text-base sm:text-lg text-gray-500">Welcome back! Here's your investment overview</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Badge variant="outline" className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border-2">
              <WalletIcon className="h-5 w-5 text-[#ff5858]" />
              <span className="font-medium">Total Balance: {formatCurrency(totalBalance, 'naira')} / {formatCurrency(totalBalanceUSDT, 'usdt')}</span>
            </Badge>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Badge variant="outline" className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border-2">
              <ChartBarIcon className="h-5 w-5 text-[#ff7e5f]" />
              <span className="font-medium">Total ROI: {formatCurrency(totalROI, 'naira')} / {formatCurrency(totalROI, 'usdt')}</span>
            </Badge>
          </motion.div>
        </div>
      </motion.div>

      {/* Notice Display */}
      <NoticeDisplay />

      {/* Mobile Stats View */}
      <div className="md:hidden">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'} mb-4`}>
            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff5858] data-[state=active]:via-[#ff7e5f] data-[state=active]:to-[#ff9966] data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff5858] data-[state=active]:via-[#ff7e5f] data-[state=active]:to-[#ff9966] data-[state=active]:text-white">
              Portfolio
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ff5858] data-[state=active]:via-[#ff7e5f] data-[state=active]:to-[#ff9966] data-[state=active]:text-white">
                Admin
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="mt-0">
            <div className="space-y-4">
              {/* Mobile Stats Cards */}
              <Card className="border-2">
                <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                      <WalletIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Total Balance</CardTitle>
                      <p className="text-sm text-gray-500">Your main balance</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="rounded-lg bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10 p-4">
                      <div className="space-y-2">
                        <p className="text-2xl font-bold">{formatCurrency(totalBalance, 'naira')}</p>
                        <p className="text-lg font-semibold text-blue-600">{formatCurrency(totalBalanceUSDT, 'usdt')}</p>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Available for investment</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                      <ChartBarIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Total ROI</CardTitle>
                      <p className="text-sm text-gray-500">Your returns</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="rounded-lg bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10 p-4">
                      <div className="space-y-2">
                        <p className="text-2xl font-bold">{formatCurrency(totalROI, 'naira')}</p>
                        <p className="text-lg font-semibold text-green-600">{formatCurrency(totalROI, 'usdt')}</p>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Total earnings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="mt-0">
            <div className="space-y-4">
              <Card className="border-2">
                <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                      <UserGroupIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Active Plans</CardTitle>
                      <p className="text-sm text-gray-500">Your investments</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="rounded-lg bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10 p-4">
                      <p className="text-2xl font-bold">{activePlans}</p>
                      <p className="text-sm text-gray-500">Active investments</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Value</span>
                      <span className="text-blue-600">{formatCurrency(totalInvested, 'naira')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                      <ChartPieIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Portfolio</CardTitle>
                      <p className="text-sm text-gray-500">Asset allocation</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="rounded-lg bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10 p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Naira</span>
                          <span className="font-medium">{nairaPercent.toFixed(2)}%</span>
                        </div>
                        <Progress value={nairaPercent} className="h-2" />
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Crypto</span>
                          <span className="font-medium">{usdtPercent.toFixed(2)}%</span>
                        </div>
                        <Progress value={usdtPercent} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
      
        </Tabs>
      </div>

      {/* Desktop Stats Grid */}
      <div className={`hidden md:grid gap-6 ${isAdmin ? 'md:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
        {isLoading ? (
          <>
            {Array.from({ length: isAdmin ? 5 : 4 }, (_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="border-b bg-gray-50/50">
                  <Skeleton className="h-8 w-3/4" />
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="overflow-hidden border-2 hover:border-[#ff5858] transition-colors">
                <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                        <WalletIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Total Balance</CardTitle>
                        <p className="text-sm text-gray-500">Your main balance</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="rounded-lg bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10 p-4">
                      <div className="space-y-2">
                        <p className="text-2xl font-bold">{formatCurrency(totalBalance, 'naira')}</p>
                        <p className="text-lg font-semibold text-blue-600">{formatCurrency(totalBalanceUSDT, 'usdt')}</p>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Available for investment</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <Card className="overflow-hidden border-2 hover:border-[#ff5858] transition-colors">
                <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                        <ChartBarIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Total ROI</CardTitle>
                        <p className="text-sm text-gray-500">Your returns</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="rounded-lg bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10 p-4">
                      <div className="space-y-2">
                        <p className="text-2xl font-bold">{formatCurrency(totalROI, 'naira')}</p>
                        <p className="text-lg font-semibold text-green-600">{formatCurrency(totalROI, 'usdt')}</p>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Total earnings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <Card className="overflow-hidden border-2 hover:border-[#ff5858] transition-colors">
                <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                        <UserGroupIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Active Plans</CardTitle>
                        <p className="text-sm text-gray-500">Your investments</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="rounded-lg bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10 p-4">
                      <p className="text-2xl font-bold">{activePlans}</p>
                      <p className="text-sm text-gray-500">Active investments</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Value</span>
                      <span className="text-blue-600">{formatCurrency(totalInvested, 'naira')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <Card className="overflow-hidden border-2 hover:border-[#ff5858] transition-colors">
                <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                        <ChartPieIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Portfolio</CardTitle>
                        <p className="text-sm text-gray-500">Asset allocation</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="rounded-lg bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10 p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Naira</span>
                          <span className="font-medium">{nairaPercent.toFixed(2)}%</span>
                        </div>
                        <Progress value={nairaPercent} className="h-2" />
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Crypto</span>
                          <span className="font-medium">{usdtPercent.toFixed(2)}%</span>
                        </div>
                        <Progress value={usdtPercent} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
      
          </>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="overflow-hidden border-2 hover:border-[#ff5858] transition-colors">
          <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                  <ClockIcon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">Recent Transactions</CardTitle>
                  <p className="text-sm text-gray-500">Your latest activities</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="bg-white/50 backdrop-blur-sm hover:bg-gray-100 transition-colors"
                onClick={() => router.push('/dashboard/withdrawals')}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {currentTransactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ClockIcon className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transactions Yet</h3>
                    <p className="text-gray-500 mb-4">You haven't made any transactions yet. Start investing to see your activity here.</p>
                    <Button 
                      onClick={() => router.push('/dashboard/investments')}
                      className="bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] hover:from-[#ff4848] hover:via-[#ff6e4f] hover:to-[#ff8956] text-white"
                    >
                      Start Investing
                    </Button>
                  </div>
                ) : (
                  currentTransactions.map((transaction: Transaction) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10 p-2">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{transaction.type}</p>
                          <p className="text-sm text-gray-500">{transaction.createdAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="font-medium">{transaction.amount}</p>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                            getStatusColor(transaction.status)
                          )}
                        >
                          {transaction.status}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </ScrollArea>
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * transactionsPerPage) + 1} to {Math.min(currentPage * transactionsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-white/50 backdrop-blur-sm"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "bg-white/50 backdrop-blur-sm",
                        currentPage === page && "bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] text-white"
                      )}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="bg-white/50 backdrop-blur-sm"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* All Transactions Dialog */}
      <Dialog open={showAllTransactions} onOpenChange={setShowAllTransactions}>
        <DialogContent className="sm:max-w-[900px] w-[95vw] max-h-[90vh] flex flex-col bg-white/95 dark:bg-[#232526]/95">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent">
              All Transactions
            </DialogTitle>
            <DialogDescription className="text-base sm:text-lg">
              View and manage all your transactions
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col sm:flex-row gap-4 p-4 border-b">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/50 dark:bg-[#232526]/50 backdrop-blur-sm"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <FunnelIcon className="h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <FunnelIcon className="h-4 w-4" />
                    <SelectValue placeholder="Filter by type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposits</SelectItem>
                  <SelectItem value="withdrawal">Withdrawals</SelectItem>
                  <SelectItem value="investment">Investments</SelectItem>
                  <SelectItem value="roi">ROI</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <ArrowsUpDownIcon className="h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                className="bg-white/50 backdrop-blur-sm"
              >
                <ArrowsUpDownIcon className="h-4 w-4" />
                {sortOrder === 'desc' ? 'Descending' : 'Ascending'}
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {filteredTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ClockIcon className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transactions Found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery || statusFilter !== 'all' || typeFilter !== 'all' 
                      ? 'No transactions match your current filters. Try adjusting your search criteria.'
                      : 'You haven\'t made any transactions yet. Start investing to see your activity here.'
                    }
                  </p>
                  {!searchQuery && statusFilter === 'all' && typeFilter === 'all' && (
                    <Button 
                      onClick={() => router.push('/dashboard/investments')}
                      className="bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] hover:from-[#ff4848] hover:via-[#ff6e4f] hover:to-[#ff8956] text-white"
                    >
                      Start Investing
                    </Button>
                  )}
                </div>
              ) : (
                filteredTransactions.map((transaction: Transaction) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10 p-2">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium capitalize">{transaction.type}</p>
                        <p className="text-sm text-gray-500">{transaction.createdAt}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="font-medium">{transaction.amount}</p>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          getStatusColor(transaction.status)
                        )}
                      >
                        {transaction.status}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>

          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-gray-500">
                Showing {((currentPage - 1) * transactionsPerPage) + 1} to {Math.min(currentPage * transactionsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-white/50 backdrop-blur-sm"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "bg-white/50 backdrop-blur-sm",
                      currentPage === page && "bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] text-white"
                    )}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-white/50 backdrop-blur-sm"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 