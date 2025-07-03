'use client'

import { useState, useEffect } from 'react'
import {
  BanknotesIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  ChartBarIcon,
  WalletIcon,
  CalendarIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  FireIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
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
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useInvestmentPlans, useMyInvestments, useCreateInvestment, type InvestmentPlan, type Investment } from '@/lib/hooks/useInvestments'

interface PaymentMethod {
  id: string
  name: string
  type: 'wallet' | 'deposit'
  icon: React.ReactNode
  description: string
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'wallet',
    name: 'Wallet Balance',
    type: 'wallet',
    icon: <WalletIcon className="h-5 w-5" />,
    description: 'Pay directly from your wallet balance',
  },
  {
    id: 'bank-transfer',
    name: 'Bank Transfer',
    type: 'deposit',
    icon: <BanknotesIcon className="h-5 w-5" />,
    description: 'Make a bank transfer to our account',
  },
  {
    id: 'crypto',
    name: 'Crypto Payment',
    type: 'deposit',
    icon: <CurrencyDollarIcon className="h-5 w-5" />,
    description: 'Send crypto to our wallet address',
  },
]

// Helper function to get plan icon based on name or default
const getPlanIcon = (planName: string) => {
  const name = planName.toLowerCase();
  if (name.includes('cadet')) return <StarIcon className="h-6 w-6" />;
  if (name.includes('captain')) return <RocketLaunchIcon className="h-6 w-6" />;
  if (name.includes('general')) return <ShieldCheckIcon className="h-6 w-6" />;
  if (name.includes('vanguard')) return <FireIcon className="h-6 w-6" />;
  if (name.includes('admiral')) return <TrophyIcon className="h-6 w-6" />;
  return <ArrowTrendingUpIcon className="h-6 w-6" />; // Default icon
};

// Helper function to format currency amounts
const formatCurrency = (amount: number, currency: 'naira' | 'usdt') => {
  if (currency === 'naira') {
    return `₦${amount.toLocaleString()}`;
  }
  return `${amount} USDT`;
};

// Helper function to get status badge color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'paused':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function InvestmentsPage() {
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null)
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState('plans')
  const [autoReinvest, setAutoReinvest] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState<'naira' | 'usdt'>('naira')
  const [searchQuery, setSearchQuery] = useState('')
  const [roiFilter, setRoiFilter] = useState('all')
  const [investmentStatusFilter, setInvestmentStatusFilter] = useState<'all' | 'active' | 'completed'>('active')
  const [searchActive, setSearchActive] = useState('')

  // Use real API hooks
  const { data: investmentPlans, isLoading: plansLoading } = useInvestmentPlans({ 
    currency: selectedCurrency 
  });
  const { data: myInvestments, isLoading: investmentsLoading } = useMyInvestments();
  const createInvestment = useCreateInvestment();

  const isLoading = plansLoading || investmentsLoading;

  const handleInvestment = async () => {
    if (!selectedPlan || !investmentAmount) return

    // Check if user already has 3 active investments
    const activeInvestments = myInvestments?.filter(inv => inv.status === 'active') || [];
    if (activeInvestments.length >= 3) {
      toast.error('You can only have a maximum of 3 active investment plans at a time. Please complete or cancel one of your existing investments before creating a new one.');
      return;
    }

    setIsProcessing(true)
    try {
      await createInvestment.mutateAsync({
        planId: selectedPlan.id,
        amount: parseFloat(investmentAmount),
        currency: selectedPlan.currency,
          autoReinvest,
      });
      
        setSelectedPlan(null)
        setInvestmentAmount('')
        setAutoReinvest(false)
    } catch (error) {
      console.log("Error", error)
      // Error handling is done in the hook
    } finally {
      setIsProcessing(false)
    }
  }

  // Filter plans based on search and currency
  const filteredPlans = investmentPlans?.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCurrency = plan.currency === selectedCurrency;
    const matchesRoi = roiFilter === 'all' || 
      (roiFilter === 'low' && plan.dailyRoi >= 5 && plan.dailyRoi < 6) ||
      (roiFilter === 'medium' && plan.dailyRoi >= 6 && plan.dailyRoi < 7) ||
      (roiFilter === 'high' && plan.dailyRoi >= 7);
    return matchesSearch && matchesCurrency && matchesRoi;
  }) || [];

  // Filter active investments
  const filteredInvestments = myInvestments?.filter(investment => {
    const matchesStatus = investmentStatusFilter === 'all' || investment.status === investmentStatusFilter;
    const matchesSearch = searchActive === '' || 
      investment.plan?.name.toLowerCase().includes(searchActive.toLowerCase()) ||
      investment.id.toLowerCase().includes(searchActive.toLowerCase());
    return matchesStatus && matchesSearch;
  }) || [];

  const calculateProjectedEarnings = (amount: number, dailyRoi: number, duration: number) => {
    return (amount * dailyRoi * duration) / 100;
  };

  if (isLoading) {
    return (
      <div className="space-y-6 sm:space-y-8 max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
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
            Investments
          </h1>
          <p className="text-gray-500">Manage your investments and track your returns</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border-2">
            <ClockIcon className="h-5 w-5 text-[#ff5858]" />
            <span className="font-medium">
              Active Plans: {myInvestments?.filter(inv => inv.status === 'active').length || 0}/3
            </span>
          </Badge>
        </div>
      </motion.div>

      <Tabs defaultValue="plans" className="w-full" onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-2 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="plans" className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 transition-colors data-[state=active]:bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] data-[state=active]:text-white">
            <ArrowTrendingUpIcon className="h-4 w-4" />
            Investment Plans
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 transition-colors data-[state=active]:bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] data-[state=active]:text-white">
            <ClockIcon className="h-4 w-4" />
            Active Investments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Select value={selectedCurrency} onValueChange={(value) => setSelectedCurrency(value as 'naira' | 'usdt')}>
                <SelectTrigger className="w-[180px] bg-white/50 backdrop-blur-sm">
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="naira">Naira (₦)</SelectItem>
                  <SelectItem value="usdt">USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 space-y-4"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search investment plans..."
                  className="pl-10 bg-white/50 backdrop-blur-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={roiFilter} onValueChange={setRoiFilter}>
                  <SelectTrigger className="w-[140px] bg-white/50 backdrop-blur-sm">
                    <SelectValue placeholder="ROI Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All ROI</SelectItem>
                     <SelectItem value="low">5-6% Daily</SelectItem>
                     <SelectItem value="medium">6-7% Daily</SelectItem>
                     <SelectItem value="high">7%+ Daily</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('')
                    setRoiFilter('all')
                  }}
                  className="bg-white/50 backdrop-blur-sm"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </motion.div>

          {filteredPlans.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <InformationCircleIcon className="h-12 w-12 text-gray-400" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">No Investment Plans Found</h3>
                  <p className="text-gray-500">
                    {searchQuery || roiFilter !== 'all' 
                      ? 'No plans match your current filters. Try adjusting your search criteria.'
                      : 'No investment plans are currently available. Please check back later.'
                    }
                  </p>
                </div>
                {(searchQuery || roiFilter !== 'all') && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('')
                      setRoiFilter('all')
                    }}
                    className="bg-white/50 backdrop-blur-sm"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredPlans.map((plan) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="overflow-hidden border-2 hover:border-blue-500 transition-colors h-full flex flex-col">
                      <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                            {getPlanIcon(plan.name)}
                            </div>
                            <div>
                            <CardTitle className="text-xl">{plan.name}</CardTitle>
                            <CardDescription className="mt-1">
                              {plan.description}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {plan.popularity}% Popular
                        </Badge>
                      </CardHeader>
                      <CardContent className="p-6 flex-1">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Min Amount</p>
                              <p className="font-semibold">{formatCurrency(plan.minAmount, plan.currency)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Max Amount</p>
                              <p className="font-semibold">{formatCurrency(plan.maxAmount, plan.currency)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Daily ROI</p>
                              <p className="font-semibold text-green-600">{plan.dailyRoi}%</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Duration</p>
                              <p className="font-semibold">{plan.duration} days</p>
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Features:</p>
                            <div className="grid grid-cols-1 gap-1">
                              {plan.features.slice(0, 4).map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                                  <span className="text-sm text-gray-600">{feature}</span>
                          </div>
                              ))}
                              {plan.features.length > 4 && (
                                <p className="text-sm text-gray-500 mt-1">
                                  +{plan.features.length - 4} more features
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4">
                            <div className="text-sm text-gray-500">
                              <p>{plan.totalInvestors.toLocaleString()} investors</p>
                              <p>Volume: {formatCurrency(plan.totalVolume, plan.currency)}</p>
                            </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                  className="bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] hover:from-[#ff4848] hover:via-[#ff6e4f] hover:to-[#ff8956] text-white"
                                onClick={() => setSelectedPlan(plan)}
                              >
                                Invest Now
                              </Button>
                            </DialogTrigger>
                              <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    {getPlanIcon(plan.name)}
                                    Invest in {plan.name}
                                </DialogTitle>
                                  <DialogDescription>
                                    Complete your investment in the {plan.name} plan
                                </DialogDescription>
                              </DialogHeader>

                                <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div>
                                      <p className="text-sm text-gray-500">Daily ROI</p>
                                      <p className="font-semibold text-green-600">{plan.dailyRoi}%</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Duration</p>
                                      <p className="font-semibold">{plan.duration} days</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Min Amount</p>
                                      <p className="font-semibold">{formatCurrency(plan.minAmount, plan.currency)}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-500">Max Amount</p>
                                      <p className="font-semibold">{formatCurrency(plan.maxAmount, plan.currency)}</p>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                <div>
                                      <Label htmlFor="amount" className='mb-2'>Investment Amount</Label>
                                    <Input
                                        id="amount"
                                    type="number"
                                        placeholder={`Enter amount (${formatCurrency(plan.minAmount, plan.currency)} - ${formatCurrency(plan.maxAmount, plan.currency)})`}
                                      value={investmentAmount}
                                      onChange={(e) => setInvestmentAmount(e.target.value)}
                                        min={plan.minAmount}
                                        max={plan.maxAmount}
                                    />
                                  </div>

                                    {investmentAmount && (
                                      <div className="p-4 bg-blue-50 rounded-lg">
                                        <h4 className="font-semibold text-blue-900 mb-2">Investment Summary</h4>
                                        <div className="space-y-1 text-sm">
                                          <div className="flex justify-between">
                                            <span>Investment Amount:</span>
                                            <span className="font-medium">{formatCurrency(parseFloat(investmentAmount) || 0, plan.currency)}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Daily Earnings:</span>
                                            <span className="font-medium text-green-600">
                                              {formatCurrency(((parseFloat(investmentAmount) || 0) * plan.dailyRoi) / 100, plan.currency)}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Total Projected Earnings:</span>
                                            <span className="font-medium text-green-600">
                                              {formatCurrency(calculateProjectedEarnings(parseFloat(investmentAmount) || 0, plan.dailyRoi, plan.duration), plan.currency)}
                                            </span>
                                          </div>
                                        </div>
                                </div>
                                    )}

                                    <div className="flex items-center space-x-2">
                                  <Switch
                                    id="auto-reinvest"
                                    checked={autoReinvest}
                                    onCheckedChange={setAutoReinvest}
                                  />
                                      <Label htmlFor="auto-reinvest" className="text-sm">
                                        Enable auto-reinvest
                                  </Label>
                                    </div>
                                  </div>
                                </div>

                                <DialogFooter>
                                <Button
                                  onClick={handleInvestment}
                                    disabled={!investmentAmount || isProcessing || parseFloat(investmentAmount) < plan.minAmount || parseFloat(investmentAmount) > plan.maxAmount}
                                    className="bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] hover:from-[#ff4848] hover:via-[#ff6e4f] hover:to-[#ff8956] text-white"
                                >
                                  {isProcessing ? (
                                    <>
                                      <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
                                      Processing...
                                    </>
                                  ) : (
                                      'Confirm Investment'
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
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active">
            <div className="mb-6 space-y-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
                    placeholder="Search active investments..."
                    className="pl-10 bg-white/50 backdrop-blur-sm"
              value={searchActive}
                    onChange={(e) => setSearchActive(e.target.value)}
            />
          </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={investmentStatusFilter} onValueChange={(value) => setInvestmentStatusFilter(value as 'all' | 'active' | 'completed')}>
                    <SelectTrigger className="w-[140px] bg-white/50 backdrop-blur-sm">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchActive('')
                      setInvestmentStatusFilter('active')
                    }}
                    className="bg-white/50 backdrop-blur-sm"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>

            {filteredInvestments.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <ChartBarIcon className="h-12 w-12 text-gray-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">No Active Investments</h3>
                    <p className="text-gray-500">Start investing to see your active investments here.</p>
                  </div>
                  <Button 
                    onClick={() => setActiveTab('plans')}
                    className="bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] hover:from-[#ff4848] hover:via-[#ff6e4f] hover:to-[#ff8956] text-white"
                  >
                    View Investment Plans
                  </Button>
              </div>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredInvestments.map((investment) => (
                  <motion.div
                    key={investment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="overflow-hidden">
                      <CardHeader className="border-b">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                              {getPlanIcon(investment.plan?.name || 'default')}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{investment.plan?.name || 'Investment Plan'}</CardTitle>
                              <CardDescription>
                                Investment ID: {investment.id}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={cn("text-xs", getStatusColor(investment.status))}>
                            {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                              </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div>
                            <p className="text-sm text-gray-500">Investment Amount</p>
                            <p className="font-semibold">{formatCurrency(investment.amount, investment.currency)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Daily ROI</p>
                            <p className="font-semibold text-green-600">{investment.dailyRoi}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total Earnings</p>
                            <p className="font-semibold text-green-600">{formatCurrency(investment.totalEarnings, investment.currency)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Days Remaining</p>
                            <p className="font-semibold">{investment.daysRemaining} days</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span>{investment.progress}%</span>
                            </div>
                            <Progress value={investment.progress} className="h-2" />
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Start Date</p>
                              <p className="font-medium">{new Date(investment.startDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">End Date</p>
                              <p className="font-medium">{new Date(investment.endDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Next Payout</p>
                              <p className="font-medium">{investment.nextPayoutDate ? new Date(investment.nextPayoutDate).toLocaleDateString() : 'N/A'}</p>
                          </div>
                            <div>
                              <p className="text-gray-500">Auto Reinvest</p>
                              <p className="font-medium">{investment.autoReinvest ? 'Enabled' : 'Disabled'}</p>
                            </div>
                          </div>

                          {investment.payoutHistory && investment.payoutHistory.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Recent Payouts</h4>
                              <div className="space-y-2 max-h-32 overflow-y-auto">
                                {investment.payoutHistory.slice(0, 3).map((payout, index) => (
                                  <div key={index} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                                    <span>{new Date(payout.date).toLocaleDateString()}</span>
                                    <span className="font-medium text-green-600">{formatCurrency(payout.amount, investment.currency)}</span>
                                  </div>
                                ))}
                            </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 