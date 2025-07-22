'use client'

import { useState, useEffect } from 'react'
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  BanknotesIcon,
  ClockIcon,
  CurrencyDollarIcon,
  WalletIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useWalletBalance, useTransactionHistory } from '@/lib/hooks/useWallet'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function WithdrawalsPage() {
  const [showAllTransactions, setShowAllTransactions] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [transactionsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [currencyFilter, setCurrencyFilter] = useState('all')

  // Real API hooks
  const { data: walletBalance, isLoading: walletLoading } = useWalletBalance()
  const { data: transactionData, isLoading: transactionsLoading } = useTransactionHistory({
    type: 'withdrawal',
    limit: 100,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  const isLoading = walletLoading || transactionsLoading
  const withdrawalTransactions = transactionData?.transactions || []

  // Calculate withdrawal statistics
  const calculateWithdrawalStats = () => {
    const totalWithdrawn = withdrawalTransactions
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const pendingWithdrawals = withdrawalTransactions
      .filter(t => t.status === 'pending')
      .reduce((sum, t) => sum + t.amount, 0)

    const thisMonthWithdrawals = withdrawalTransactions
      .filter(t => {
        const transactionDate = new Date(t.createdAt)
        const now = new Date()
        return transactionDate.getMonth() === now.getMonth() && 
               transactionDate.getFullYear() === now.getFullYear() &&
               t.status === 'completed'
      })
      .reduce((sum, t) => sum + t.amount, 0)

    return { totalWithdrawn, pendingWithdrawals, thisMonthWithdrawals }
  }

  const { totalWithdrawn, pendingWithdrawals, thisMonthWithdrawals } = calculateWithdrawalStats()

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

  const getTypeIcon = (paymentMethod?: string) => {
    if (paymentMethod?.includes('bank') || paymentMethod?.includes('transfer')) {
      return <BanknotesIcon className="h-4 w-4 text-blue-500" />
    } else if (paymentMethod?.includes('crypto')) {
      return <WalletIcon className="h-4 w-4 text-purple-500" />
    } else {
      return <WalletIcon className="h-4 w-4 text-gray-500" />
    }
  }

  // Calculate pagination
  const filteredTransactions = withdrawalTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.amount.toString().includes(searchQuery.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
    const matchesType = typeFilter === 'all' || 
      (typeFilter === 'bank' && transaction.paymentMethod?.includes('bank')) ||
      (typeFilter === 'crypto' && transaction.paymentMethod?.includes('crypto'))
    const matchesCurrency = currencyFilter === 'all' || transaction.currency === currencyFilter.toLowerCase()
    return matchesSearch && matchesStatus && matchesType && matchesCurrency
  })

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage)
  const indexOfLastTransaction = currentPage * transactionsPerPage
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent">
            ROI Withdrawals
          </h1>
          <p className="text-gray-500">Withdraw your investment earnings</p>
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">Withdrawal Policy:</p>
            <ul className="text-xs text-blue-700 mt-1 space-y-1">
              <li>• Only ROI earnings can be withdrawn, not deposited amounts</li>
              <li>• You must have active investments to withdraw</li>
              <li>• Withdrawal fee applies to all transactions</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge variant="outline" className="flex items-center gap-2 bg-white/50 backdrop-blur-sm">
              <WalletIcon className="h-4 w-4" />
              Available Balance: {formatCurrency(walletBalance?.totalBalance?.naira || 0, 'naira')}
            </Badge>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge variant="outline" className="flex items-center gap-2 bg-white/50 backdrop-blur-sm">
              <ClockIcon className="h-4 w-4" />
              Pending: {formatCurrency(pendingWithdrawals, 'naira')}
            </Badge>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
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
              <Card className="overflow-hidden border-2 hover:border-blue-500 transition-colors">
                <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                        <WalletIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Available Balance</CardTitle>
                        <p className="text-sm text-gray-500">Ready to withdraw</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="rounded-lg bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10 p-4">
                      <p className="text-2xl font-bold">{formatCurrency(walletBalance?.totalBalance?.naira || 0, 'naira')}</p>
                      <p className="text-sm text-gray-500">Total available</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Minimum Withdrawal</span>
                      <span className="font-medium">₦2,000</span>
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
              <Card className="overflow-hidden border-2 hover:border-blue-500 transition-colors">
                <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                        <ClockIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Pending Withdrawals</CardTitle>
                        <p className="text-sm text-gray-500">In processing</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="rounded-lg bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10 p-4">
                      <p className="text-2xl font-bold">{formatCurrency(pendingWithdrawals, 'naira')}</p>
                      <p className="text-sm text-gray-500">Processing</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Processing Time</span>
                      <span className="font-medium">0-24hrs</span>
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
              <Card className="overflow-hidden border-2 hover:border-blue-500 transition-colors">
                <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                        <CurrencyDollarIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Total Withdrawn</CardTitle>
                        <p className="text-sm text-gray-500">All time</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="rounded-lg bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10 p-4">
                      <p className="text-2xl font-bold">{formatCurrency(totalWithdrawn, 'naira')}</p>
                      <p className="text-sm text-gray-500">Total withdrawn</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">This Month</span>
                      <span className="font-medium">{formatCurrency(thisMonthWithdrawals, 'naira')}</span>
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
        <Card className="overflow-hidden border-2 hover:border-blue-500 transition-colors">
          <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                  <ArrowPathIcon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">Withdrawal History</CardTitle>
                  <p className="text-sm text-gray-500">Your withdrawal records</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="bg-white/50 backdrop-blur-sm"
                onClick={() => setShowAllTransactions(true)}
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
                    <ArrowDownTrayIcon className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Withdrawals Yet</h3>
                    <p className="text-gray-500 mb-4">You haven't made any withdrawals yet. Start earning to withdraw your profits.</p>
                    <Button 
                      onClick={() => window.location.href = '/dashboard/investments'}
                      className="bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] hover:from-[#ff4848] hover:via-[#ff6e4f] hover:to-[#ff8956] text-white"
                    >
                      Start Investing
                    </Button>
                  </div>
                ) : (
                  currentTransactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2">
                          {getTypeIcon(transaction.paymentMethod)}
                        </div>
                        <div>
                          <p className="font-medium">{formatCurrency(transaction.amount, transaction.currency)}</p>
                          <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
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
          </CardContent>
        </Card>
      </motion.div>

      {/* View All Dialog */}
      <Dialog open={showAllTransactions} onOpenChange={setShowAllTransactions}>
        <DialogContent className="sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] w-[95vw] max-h-[90vh] overflow-hidden flex flex-col p-0 bg-white/95 dark:bg-[#232526]/95">
          <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
            <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              All Withdrawals
            </DialogTitle>
            <DialogDescription className="text-base sm:text-lg">
              View and filter your complete withdrawal history
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col h-full min-h-0">
            {/* Filters - Fixed at top */}
            <div className="p-6 pb-4 border-b bg-white/50 dark:bg-[#232526]/50 backdrop-blur-sm flex-shrink-0">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search withdrawals..."
                    className="pl-10 bg-white/50 dark:bg-[#232526]/50 backdrop-blur-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] bg-white/50 backdrop-blur-sm">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('')
                      setStatusFilter('all')
                    }}
                    className="bg-white/50 backdrop-blur-sm"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-hidden min-h-0">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-4">
                  {currentTransactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <ArrowDownTrayIcon className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Withdrawals Found</h3>
                      <p className="text-gray-500 mb-4">
                        {searchQuery || statusFilter !== 'all' 
                          ? 'No withdrawals match your current filters. Try adjusting your search criteria.'
                          : 'You haven\'t made any withdrawals yet.'
                        }
                      </p>
                    </div>
                  ) : (
                    currentTransactions.map((transaction) => (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border-2 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="rounded-full bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10 p-2 shadow-inner">
                            <ArrowDownTrayIcon className="h-5 w-5 text-[#ff5858]" />
                          </div>
                          <div>
                            <p className="font-semibold text-base sm:text-lg">{formatCurrency(transaction.amount, transaction.currency)}</p>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                              <span className="text-sm text-gray-500 hidden sm:inline">•</span>
                              <p className="text-sm text-gray-500">{transaction.currency.toUpperCase()}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
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
            </div>

            {/* Pagination - Fixed at bottom */}
            <div className="p-6 pt-4 border-t bg-white/50 backdrop-blur-sm flex-shrink-0">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-500">
                  Showing {indexOfFirstTransaction + 1} to {Math.min(indexOfLastTransaction, filteredTransactions.length)} of {filteredTransactions.length} withdrawals
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 bg-white/50 backdrop-blur-sm"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="icon"
                        onClick={() => handlePageChange(page)}
                        className={cn(
                          "h-8 w-8",
                          currentPage === page
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                            : "bg-white/50 backdrop-blur-sm"
                        )}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 bg-white/50 backdrop-blur-sm"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 