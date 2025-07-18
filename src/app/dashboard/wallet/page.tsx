'use client'

import { useState, useEffect } from 'react'
import {
  WalletIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  QrCodeIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { motion, AnimatePresence } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Inter, Poppins } from 'next/font/google'
import { useWalletBalance, useTransactionHistory, useCreateDeposit, useCreateWithdrawal, useWithdrawalSettings, usePlatformSettings } from '@/lib/hooks/useWallet'
import { FintavaPaymentDialog } from '@/components/payments/FintavaPaymentDialog'
import { endpoints, api } from '@/lib/api'

const inter = Inter({ subsets: ['latin'] })
const poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
})

interface DepositAccount {
  currency: string
  bankName?: string
  accountNumber?: string
  accountName?: string
  walletAddress?: string
  network?: string
}

const depositAccounts: DepositAccount[] = [
  {
    currency: 'NGN',
    bankName: 'First Bank',
    accountNumber: '1234567890',
    accountName: 'Investment Platform',
  },
  {
    currency: 'USDT',
    walletAddress: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    network: 'TRC20',
  },
]

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState('naira')
  const [showDepositDialog, setShowDepositDialog] = useState(false)
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false)
  const [showFintavaDialog, setShowFintavaDialog] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState('NGN')
  const [amount, setAmount] = useState<string>('')
  const [selectedMethod, setSelectedMethod] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)
  const [depositStep, setDepositStep] = useState(1)
  const [depositFromAccount, setDepositFromAccount] = useState('')
  const [depositReference, setDepositReference] = useState('')
  const [depositProof, setDepositProof] = useState<File | null>(null)
  const [depositTotal, setDepositTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showAllTransactions, setShowAllTransactions] = useState(false)
  const [transactionFilter, setTransactionFilter] = useState('all')
  const [transactionSort, setTransactionSort] = useState('date')
  const [searchQuery, setSearchQuery] = useState('')

  const [transferAmount, setTransferAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [depositAmount, setDepositAmount] = useState('')

  // Real API hooks
  const { data: walletBalance, isLoading: walletLoading } = useWalletBalance()
  const { data: transactionData, isLoading: transactionsLoading } = useTransactionHistory({
    limit: 50,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })
  const createDeposit = useCreateDeposit()
  const createWithdrawal = useCreateWithdrawal()

  // Settings hooks
  const { data: withdrawalSettings, isLoading: settingsLoading } = useWithdrawalSettings();
  const { data: platformSettings, isLoading: platformSettingsLoading } = usePlatformSettings();

  const isLoading = walletLoading || transactionsLoading || settingsLoading || platformSettingsLoading
  const transactions = transactionData?.transactions || []

  // Get withdrawal limits and fees from settings with proper null checks
  const minWithdrawal = withdrawalSettings?.minWithdrawalAmount ?? 100
  const maxWithdrawal = withdrawalSettings?.maxWithdrawalAmount ?? 1000000
  const withdrawalFee = withdrawalSettings?.withdrawalFee ?? 2.5

  // Get deposit limits and fees from platform settings with proper null checks
  const minDepositNGN = platformSettings?.depositLimits?.minAmount ?? 100
  const maxDepositNGN = platformSettings?.depositLimits?.maxAmount ?? 1000000
  const depositFee = platformSettings?.fees?.depositFee ?? 0
  const transactionFee = platformSettings?.fees?.transactionFee ?? 1.0

  // Create wallet balances array from real data
  const walletBalances = [
    {
      currency: 'NGN',
      amount: walletBalance?.totalBalance?.naira || 0,
      available: walletBalance?.walletBalances?.naira || 0,
      pending: 0, // Backend doesn't provide pending amounts yet
      locked: 0, // Backend doesn't provide locked amounts yet
    },
    {
      currency: 'USDT',
      amount: walletBalance?.totalBalance?.usdt || 0,
      available: walletBalance?.walletBalances?.usdt || 0,
      pending: 0,
      locked: 0,
    },
  ]

  // Calculate pagination for transactions
  const indexOfLastTransaction = currentPage * itemsPerPage
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction)
  const totalPages = Math.ceil(transactions.length / itemsPerPage)

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(transaction => {
      if (transactionFilter === 'all') return true
      return transaction.type === transactionFilter
    })
    .filter(transaction =>
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchQuery.toLowerCase())
    )

  useEffect(() => {
    if (amount) {
      const amountValue = Number(amount)
      const fee = calculateWithdrawalFee(amountValue, selectedCurrency)
      setDepositTotal(amountValue + fee)
    }
  }, [amount, selectedCurrency])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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
    switch(type) {
      case 'deposit': return <ArrowDownIcon className="h-5 w-5 text-green-500" />
      case 'withdrawal': return <ArrowUpIcon className="h-5 w-5 text-red-500" />
      case 'transfer': return <ArrowRightIcon className="h-5 w-5 text-blue-500" />
      case 'investment': return <BanknotesIcon className="h-5 w-5 text-purple-500" />
      case 'roi': return <CurrencyDollarIcon className="h-5 w-5 text-green-500" />
      default: return <WalletIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const formatNGNAmount = (value: string) => {
    // Remove any non-digit characters
    const numericValue = value.replace(/[^0-9]/g, '')
    
    // Convert to number and format with commas
    const formattedValue = Number(numericValue).toLocaleString('en-NG')
    
    return formattedValue
  }

  const handleNGNAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setAmount(value)
  }

  const handleDeposit = async () => {
    if (!amount) {
      toast.error('Please enter an amount.')
      return
    }

    const amountValue = parseFloat(amount)

    // Validate minimum amount for NGN using platform settings
    if (selectedCurrency === 'NGN' && amountValue < minDepositNGN) {
      toast.error(`Minimum deposit amount for NGN is ₦${minDepositNGN?.toLocaleString() || '100'}`)
      return
    }

    // Validate maximum amount for NGN using platform settings
    if (selectedCurrency === 'NGN' && amountValue > maxDepositNGN) {
      toast.error(`Maximum deposit amount for NGN is ₦${maxDepositNGN?.toLocaleString() || '1,000,000'}`)
      return
    }

    // Validate minimum amount for USDT
    if (selectedCurrency === 'USDT' && amountValue < 1) {
      toast.error('Minimum deposit amount for USDT is $1')
      return
    }

    // Automatically set payment method based on currency
    const paymentMethod = selectedCurrency === 'NGN' ? 'fintava' : 'crypto'

    // Handle FINTAVA for NGN deposits
    if (selectedCurrency === 'NGN' && paymentMethod === 'fintava') {
      try {
        setShowDepositDialog(false)
        setShowFintavaDialog(true)
        return
      } catch (error) {
        toast.error('Failed to open FINTAVA payment dialog')
        return
      }
    }

    // Handle traditional deposits for other currencies
    if (selectedCurrency !== 'NGN') {
      if (depositStep === 1) {
        setDepositStep(2)
        return
      } else if (depositStep === 2) {
        setDepositStep(3)
        return
      }
    }

    // Final submission for traditional deposits
    if (depositStep === 3 && (!depositFromAccount || !depositReference || !depositProof)) {
      toast.error('Please provide all required payment details.')
      return
    }

    setIsProcessing(true)
    try {
      await createDeposit.mutateAsync({
        amount: amountValue,
        currency: selectedCurrency.toLowerCase() as 'naira' | 'usdt',
        paymentMethod: paymentMethod as 'bank_transfer' | 'crypto' | 'card'
      })
      
      toast.success('Deposit request created successfully')
      setShowDepositDialog(false)
      setDepositStep(1)
      setAmount('')
      setDepositProof(null)
      setDepositReference('')
      setDepositFromAccount('')
    } catch (error) {
      toast.error('Failed to create deposit request')
    } finally {
      setIsProcessing(false)
    }
  }

  const calculateWithdrawalFee = (amount: number, currency: string) => {
    // Use withdrawal fee percentage from backend settings
    return (amount * withdrawalFee) / 100
  }

  const calculateDepositFee = (amount: number, currency: string) => {
    // Use deposit fee percentage from platform settings
    return (amount * depositFee) / 100
  }

  const handleWithdrawal = async () => {
    if (!amount) {
      toast.error('Please enter an amount.')
      return
    }

    const amountValue = parseFloat(amount)

    // Validate minimum amount using backend settings
    if (amountValue < minWithdrawal) {
      toast.error(`Minimum withdrawal amount is ${formatAmount(minWithdrawal, selectedCurrency)}`)
      return
    }

    // Validate maximum amount
    if (amountValue > maxWithdrawal) {
      toast.error(`Maximum withdrawal amount is ${formatAmount(maxWithdrawal, selectedCurrency)}`)
      return
    }

    setIsProcessing(true)
    try {
      // Map currency to backend format
      const currencyMap = {
        'NGN': 'naira',
        'USDT': 'usdt'
      } as const
      
      await createWithdrawal.mutateAsync({
        amount: amountValue,
        currency: currencyMap[selectedCurrency as keyof typeof currencyMap],
        notes: `ROI withdrawal request for ${selectedCurrency}`,
      })
      
      toast.success('ROI withdrawal request created successfully')
      setShowWithdrawDialog(false)
      setAmount('')
    } catch (error: any) {
      console.log({error})
      toast.error(error?.response?.data?.message ?? 'Failed to create ROI withdrawal request')
    } finally {
      setIsProcessing(false)
    }
  }

  const getBalance = (currency: string) => {
    return walletBalances.find(balance => balance.currency === currency)
  }

  const getAvailableBalance = (currency: string) => {
    const balance = getBalance(currency)
    return balance ? balance.available : 0
  }

  const formatAmount = (amount: number, currency: string) => {
    if (currency === 'NGN') {
      return `₦${amount.toLocaleString()}`
    } else if (currency === 'USDT') {
      return `$${amount.toLocaleString()}`
    } else {
      return `${amount} ${currency}`
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Error', {
          description: 'File size should be less than 5MB',
        })
        return
      }
      setDepositProof(file)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className={`space-y-8 ${poppins.variable} font-sans max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent tracking-tight">
            My Wallets
          </h1>
          <p className="text-base sm:text-lg text-gray-500 mt-1">Manage your funds and transactions</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Badge variant="outline" className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border-2">
              <WalletIcon className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Total Balance: {formatAmount(walletBalances[0].amount, walletBalances[0].currency)}</span>
            </Badge>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        {isLoading ? (
          <>
            {[1, 2].map((i) => (
              <Card key={i} className="overflow-hidden border-2">
                <CardHeader className="border-b bg-gray-50/50">
                  <Skeleton className="h-8 w-3/4" />
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          walletBalances.map((balance, index) => (
            <motion.div
              key={balance.currency}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{ y: -5, transition: { type: "spring", stiffness: 400, damping: 17 } }}
            >
              <Card className="overflow-hidden border-2 hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl">
                <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white shadow-lg">
                        {balance.currency === 'NGN' ? (
                          <BanknotesIcon className="h-6 w-6" />
                        ) : balance.currency === 'USDT' ? (
                          <CurrencyDollarIcon className="h-6 w-6" />
                        ) : (
                          <QrCodeIcon className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-xl font-semibold">{balance.currency} Balance</CardTitle>
                        <p className="text-sm text-gray-500">{balance.currency} Wallet</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    <div className="rounded-lg bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10 p-4 shadow-inner">
                      <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent">
                        {formatAmount(balance.amount, balance.currency)}
                      </p>
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">Available</span>
                          <span className="font-semibold">{formatAmount(getAvailableBalance(balance.currency), balance.currency)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">Pending</span>
                          <span className="font-semibold">{formatAmount(balance.pending, balance.currency)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">Locked</span>
                          <span className="font-semibold">{formatAmount(balance.locked, balance.currency)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-2 w-full">
                      <Button
                        onClick={() => {
                          setSelectedCurrency(balance.currency)
                          if (balance.currency === 'NGN') {
                            setShowFintavaDialog(true)
                          } else {
                            setShowDepositDialog(true)
                          }
                        }}
                        className="w-full sm:w-auto h-12 px-6 py-3 bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] text-white hover:from-[#ff6868] hover:via-[#ff8e7f] hover:to-[#ffa988] shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <ArrowDownIcon className="mr-2 h-4 w-4" />
                        Deposit
                      </Button>

                      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => {
                              setSelectedCurrency(balance.currency)
                              setShowWithdrawDialog(true)
                            }}
                            variant="outline"
                            className="w-full sm:w-auto h-12 px-6 py-3 border-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <ArrowUpIcon className="mr-2 h-4 w-4" />
                            Withdraw
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[70vw] bg-white/95 dark:bg-[#232526]/95 backdrop-blur-sm border-2">
                          <DialogHeader>
                            <DialogTitle>Withdraw ROI Earnings</DialogTitle>
                            <DialogDescription>
                              Withdraw your ROI earnings to your bank account. 
                              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800 font-medium">Important:</p>
                                <ul className="text-xs text-yellow-700 mt-1 space-y-1">
                                  <li>• You can only withdraw your ROI earnings, not your deposited amounts</li>
                                  <li>• You must have at least one active investment to withdraw</li>
                                  <li>• Withdrawal fee: {withdrawalFee}%</li>
                                  <li>• Processing time: instant</li>
                                  <li>• Min: {formatAmount(minWithdrawal, selectedCurrency)} | Max: {formatAmount(maxWithdrawal, selectedCurrency)}</li>
                                </ul>
                              </div>
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <Label className="text-gray-700 font-medium">Amount</Label>
                              <div className="relative mt-1">
                                {selectedCurrency === 'NGN' ? (
                                  <BanknotesIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                ) : (
                                  <CurrencyDollarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                )}
                                <Input
                                  type="number"
                                  value={amount}
                                  onChange={(e) => setAmount(e.target.value)}
                                  className="pl-10 bg-white/50 backdrop-blur-sm border-2 focus:border-[#ff5858] transition-colors"
                                  placeholder={`0.00 ${selectedCurrency}`}
                                />
                              </div>
                              <p className="mt-1 text-sm text-gray-500">
                                Available: {formatAmount(getAvailableBalance(selectedCurrency), selectedCurrency)}
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                Minimum withdrawal: {settingsLoading ? 'Loading...' : formatAmount(minWithdrawal, selectedCurrency)}
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                Maximum withdrawal: {settingsLoading ? 'Loading...' : formatAmount(maxWithdrawal, selectedCurrency)}
                              </p>
                              <p className="mt-1 text-sm text-gray-500">
                                Fee: {settingsLoading ? 'Loading...' : `${withdrawalFee}%`}
                              </p>
                            </div>

                            <Alert className="bg-blue-50 border-blue-200">
                              <InformationCircleIcon className="h-4 w-4 text-blue-600" />
                              <AlertTitle className="text-blue-800 font-semibold">Bank Details</AlertTitle>
                              <AlertDescription className="text-blue-700">
                                Your withdrawal will be processed to your registered bank account. 
                                Please ensure your bank details are up to date in your profile.
                              </AlertDescription>
                            </Alert>

                            {amount && (
                              <div className="rounded-lg border-2 p-4 bg-white/50 backdrop-blur-sm">
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Amount</span>
                                    <span className="font-semibold">{formatAmount(Number(amount), selectedCurrency)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-gray-500 font-medium">Fee</span>
                                    <span className="font-semibold">{formatAmount(calculateWithdrawalFee(Number(amount), selectedCurrency), selectedCurrency)}</span>
                                  </div>
                                  <Separator className="my-2" />
                                  <div className="flex justify-between text-sm font-semibold">
                                    <span>Net Amount</span>
                                    <span>{formatAmount(Number(amount) - calculateWithdrawalFee(Number(amount), selectedCurrency), selectedCurrency)}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <DialogFooter className="flex flex-col sm:flex-row gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowWithdrawDialog(false)
                                setAmount('')
                              }}
                              className="w-full sm:w-auto bg-white/50 dark:bg-[#232526]/50 backdrop-blur-sm border-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleWithdrawal}
                              disabled={isProcessing || !amount || 
                                parseFloat(amount) < minWithdrawal ||
                                parseFloat(amount) > maxWithdrawal}
                              className="w-full sm:w-auto bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] hover:from-[#ff6868] hover:via-[#ff8e7f] hover:to-[#ffa988] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              {isProcessing ? (
                                <>
                                  <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                'Confirm Withdrawal'
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
      >
        <Card className="overflow-hidden border-2 hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl">
          <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white shadow-lg">
                  <ArrowPathIcon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold">Recent Transactions</CardTitle>
                  <p className="text-sm text-gray-500">Your latest activities</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full sm:w-auto bg-white/50 backdrop-blur-sm border-2 hover:bg-gray-100 transition-colors"
                onClick={() => setShowAllTransactions(true)}
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <ScrollArea className="h-[300px] sm:h-[400px] pr-4">
              <div className="space-y-4">
                {currentTransactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ArrowPathIcon className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transactions Yet</h3>
                    <p className="text-gray-500 mb-4">You haven't made any wallet transactions yet. Start depositing or investing to see your activity here.</p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => setShowDepositDialog(true)}
                        className="bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] hover:from-[#ff4848] hover:via-[#ff6e4f] hover:to-[#ff8956] text-white"
                      >
                        Make Deposit
                      </Button>
                      <Button 
                        onClick={() => window.location.href = '/dashboard/investments'}
                        variant="outline"
                        className="bg-white/50 backdrop-blur-sm"
                      >
                        Start Investing
                      </Button>
                    </div>
                  </div>
                ) : (
                  currentTransactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border-2 p-4 hover:bg-gray-50 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10 p-2 shadow-inner">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-semibold capitalize">{transaction.description}</p>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-right">
                          <p className={cn("font-bold", transaction.amount > 0 ? 'text-green-500' : 'text-red-500')}>
                            {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount).toFixed(2)}
                          </p>
                        </div>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-500 text-center sm:text-left">
                    Showing {indexOfFirstTransaction + 1} to {Math.min(indexOfLastTransaction, transactions.length)} of {transactions.length} transactions
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={cn(
                          "min-w-[2.5rem] h-9 px-3",
                          currentPage === page
                            ? "bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] text-white hover:from-[#ff6868] hover:via-[#ff8e7f] hover:to-[#ffa988]"
                            : "border-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        )}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ArrowRightIcon className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* All Transactions Dialog */}
      <Dialog open={showAllTransactions} onOpenChange={setShowAllTransactions}>
        <DialogContent className="max-w-4xl w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[70vw] bg-white/95 dark:bg-[#232526]/95 backdrop-blur-sm border-2">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent">
              All Transactions
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              View and filter all your transactions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/50 backdrop-blur-sm border-2 focus:border-[#ff5858] transition-colors"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={transactionFilter} onValueChange={setTransactionFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-white/50 backdrop-blur-sm border-2">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="deposit">Deposits</SelectItem>
                    <SelectItem value="withdrawal">Withdrawals</SelectItem>
                    <SelectItem value="transfer-in">Transfers In</SelectItem>
                    <SelectItem value="transfer-out">Transfers Out</SelectItem>
                    <SelectItem value="investment">Investments</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={transactionSort} onValueChange={setTransactionSort}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-white/50 backdrop-blur-sm border-2">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="amount">Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Transactions List */}
            <ScrollArea className="h-[50vh] sm:h-[60vh] pr-4">
              <div className="space-y-4">
                {filteredTransactions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ArrowPathIcon className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transactions Found</h3>
                    <p className="text-gray-500 mb-4">
                      {searchQuery || transactionFilter !== 'all' 
                        ? 'No transactions match your current filters. Try adjusting your search criteria.'
                        : 'You haven\'t made any wallet transactions yet. Start depositing or investing to see your activity here.'
                      }
                    </p>
                    {!searchQuery && transactionFilter === 'all' && (
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => {
                            setShowAllTransactions(false)
                            setShowDepositDialog(true)
                          }}
                          className="bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] hover:from-[#ff4848] hover:via-[#ff6e4f] hover:to-[#ff8956] text-white"
                        >
                          Make Deposit
                        </Button>
                        <Button 
                          onClick={() => window.location.href = '/dashboard/investments'}
                          variant="outline"
                          className="bg-white/50 backdrop-blur-sm"
                        >
                          Start Investing
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  filteredTransactions.map((transaction: any) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border-2 p-4 hover:bg-gray-50 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10 p-2 shadow-inner">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-semibold capitalize">{transaction.description}</p>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm text-gray-500">{formatDate(transaction.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4">
                        <div className="text-right">
                          <p className={cn("font-bold", transaction.amount > 0 ? 'text-green-500' : 'text-red-500')}>
                            {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                          </p>
                        </div>
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

            {/* Summary */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t">
              <p className="text-sm text-gray-500 text-center sm:text-left">
                Showing {filteredTransactions.length} transactions
              </p>
              <Button
                variant="outline"
                onClick={() => setShowAllTransactions(false)}
                className="w-full sm:w-auto bg-white/50 dark:bg-[#232526]/50 backdrop-blur-sm border-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* FINTAVA Payment Dialog */}
      <FintavaPaymentDialog
        open={showFintavaDialog}
        onOpenChange={setShowFintavaDialog}
        initialAmount={amount}
        onSuccess={(virtualWallet) => {
          toast.success('Virtual wallet created successfully! Complete your payment to credit your account.')
          setShowFintavaDialog(false)
          setAmount('')
          // Refresh wallet balance
          // Note: The balance will be updated automatically when the webhook processes the payment
        }}
      />

      {/* USDT Deposit Dialog */}
      <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
        <DialogContent className="sm:max-w-[425px] w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[70vw] bg-white/95 dark:bg-[#232526]/95 backdrop-blur-sm border-2">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent">
              Deposit {selectedCurrency}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {depositStep === 1 ? 'Enter the amount you want to deposit' : 
               depositStep === 2 ? 'Complete your deposit details' :
               'Upload proof of payment'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {depositStep === 1 ? (
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700 font-medium">Amount ({selectedCurrency})</Label>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 bg-white/50 backdrop-blur-sm border-2 focus:border-[#ff5858] transition-colors"
                    placeholder={`Enter amount in ${selectedCurrency}`}
                    min={selectedCurrency === 'NGN' ? (minDepositNGN || 100) : 1}
                    max={selectedCurrency === 'NGN' ? (maxDepositNGN || 1000000) : undefined}
                    step="0.01"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    {selectedCurrency === 'NGN' 
                      ? platformSettingsLoading 
                        ? 'Loading minimum deposit amount...'
                        : `Minimum deposit amount: ₦${(minDepositNGN || 100).toLocaleString()}`
                      : 'Minimum deposit amount: $1'
                    }
                  </p>
                  {depositFee > 0 && (
                    <p className="mt-1 text-sm text-amber-600">
                      Deposit fee: {depositFee}%
                    </p>
                  )}
                </div>
                
                {amount && parseFloat(amount) > 0 && (
                  <div className="rounded-lg border-2 p-4 bg-white/50 backdrop-blur-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 font-medium">Amount</span>
                        <span className="font-semibold">{formatAmount(Number(amount), selectedCurrency)}</span>
                      </div>
                      {depositFee > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">Fee</span>
                          <span className="font-semibold">{formatAmount(calculateDepositFee(Number(amount), selectedCurrency), selectedCurrency)}</span>
                        </div>
                      )}
                      <Separator className="my-2" />
                      <div className="flex justify-between text-sm font-semibold">
                        <span>Total to Pay</span>
                        <span>{formatAmount(Number(amount) + calculateDepositFee(Number(amount), selectedCurrency), selectedCurrency)}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <Alert className="bg-blue-50 border-blue-200">
                  <CurrencyDollarIcon className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800 font-semibold">Cryptocurrency Deposit</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    Transfer USDT to the provided wallet address to fund your account.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="space-y-4">
                {depositStep === 2 ? (
                  <>
                    <Alert className="bg-blue-50 border-blue-200">
                      <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                      <AlertTitle className="text-blue-800 font-semibold">Deposit Details</AlertTitle>
                      <AlertDescription className="text-blue-700">
                        Please send {formatAmount(Number(amount), selectedCurrency)} to the following wallet:
                      </AlertDescription>
                    </Alert>
                    <div className="rounded-lg border-2 p-4 bg-white/50 backdrop-blur-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">Network</span>
                          <span className="font-semibold">TRC20</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">Wallet Address</span>
                          <span className="font-semibold">TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t</span>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">Amount</span>
                          <span className="font-semibold">{formatAmount(Number(amount), selectedCurrency)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 font-medium">Reference</span>
                          <span className="font-semibold">TRX{Math.random().toString(36).substring(7).toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircleIcon className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-800 font-semibold">Proof of Payment</AlertTitle>
                      <AlertDescription className="text-green-700">
                        Please provide your payment details and upload proof of payment
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-gray-700 font-medium">Wallet Address Used</Label>
                        <Input
                          value={depositFromAccount}
                          onChange={(e) => setDepositFromAccount(e.target.value)}
                          className="mt-1 bg-white/50 backdrop-blur-sm border-2 focus:border-[#ff5858] transition-colors"
                          placeholder="Enter the wallet address you used"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700 font-medium">Transaction Hash</Label>
                        <Input
                          value={depositReference}
                          onChange={(e) => setDepositReference(e.target.value)}
                          className="mt-1 bg-white/50 backdrop-blur-sm border-2 focus:border-[#ff5858] transition-colors"
                          placeholder="Enter your transaction hash"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700 font-medium">Proof of Payment</Label>
                        <div className="mt-1">
                          <Input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            className="bg-white/50 backdrop-blur-sm border-2 focus:border-[#ff5858] transition-colors"
                          />
                          <p className="mt-1 text-sm text-gray-500">
                            Upload screenshot or PDF of your payment (max 5MB)
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDepositDialog(false)
                setDepositStep(1)
                setAmount('')
                setDepositProof(null)
                setDepositReference('')
                setDepositFromAccount('')
              }}
              className="w-full sm:w-auto bg-white/50 dark:bg-[#232526]/50 backdrop-blur-sm border-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeposit}
              disabled={isProcessing || !amount || 
                (depositStep === 3 && (!depositFromAccount || !depositReference || !depositProof))}
              className="w-full sm:w-auto bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] hover:from-[#ff6868] hover:via-[#ff8e7f] hover:to-[#ffa988] text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isProcessing ? (
                <>
                  <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : depositStep === 1 ? (
                'Continue'
              ) : depositStep === 2 ? (
                "I've Made the Payment"
              ) : (
                'Submit Deposit'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function WalletCard({ title, description, balance, details, actions, icon, color }: any) {
  const gradientColor = color === 'orange' 
    ? 'from-[#ff5858] to-[#ff9966]' 
    : 'from-purple-500 to-indigo-600'

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <Card className={cn("relative overflow-hidden text-white border-none shadow-2xl", `bg-gradient-to-br ${gradientColor}`)}>
        <div className="absolute top-0 right-0 h-24 w-24 text-white/10">{icon}</div>
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <p className="text-sm opacity-80">{description}</p>
        </CardHeader>
        <CardContent>
          <p className="text-5xl font-bold mb-4">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          {details.length > 0 && (
            <div className="space-y-2 border-t border-white/20 pt-4">
              {details.map((item: any) => (
                <div key={item.label} className="flex justify-between text-lg">
                  <span className="opacity-80">{item.label}</span>
                  <span>${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex space-x-4 mt-6">
            {actions}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 