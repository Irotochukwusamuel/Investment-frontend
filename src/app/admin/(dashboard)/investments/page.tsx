'use client'

import { useState, useEffect } from 'react'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  UserIcon,
  CalendarIcon,
  SparklesIcon,
  RocketLaunchIcon,
  StarIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  GlobeAltIcon,
  CogIcon,
  BellIcon,
  PlusIcon,
  ShieldCheckIcon,
  CalculatorIcon,
} from '@heroicons/react/24/outline'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, ArrowUpDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'

interface Investment {
  id: string
  userId: string
  userName: string
  planName: string
  amount: string
  status: 'active' | 'completed' | 'cancelled' | 'pending'
  startDate: string
  endDate: string
  progress: number
  roi: string
  totalEarned: string
  planType: 'starter' | 'premium' | 'vip' | 'enterprise'
  riskLevel: 'low' | 'medium' | 'high'
  expectedReturn: string
  nextPayout: string
}

const mockInvestments: Investment[] = [
  {
    id: '1',
    userId: 'USR001',
    userName: 'John Doe',
    planName: 'Vanguard Plan',
    amount: '₦500,000',
    status: 'active',
    startDate: '2024-02-15',
    endDate: '2024-05-15',
    progress: 65,
    roi: '6.5%',
    totalEarned: '₦32,500',
    planType: 'premium',
    riskLevel: 'low',
    expectedReturn: '₦532,500',
    nextPayout: '2024-04-15',
  },
  {
    id: '2',
    userId: 'USR002',
    userName: 'Jane Smith',
    planName: 'Starter Plan',
    amount: '₦100,000',
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2024-06-01',
    progress: 45,
    roi: '5.2%',
    totalEarned: '₦5,200',
    planType: 'starter',
    riskLevel: 'low',
    expectedReturn: '₦105,200',
    nextPayout: '2024-04-01',
  },
  {
    id: '3',
    userId: 'USR003',
    userName: 'Mike Johnson',
    planName: 'VIP Plan',
    amount: '₦1,000,000',
    status: 'completed',
    startDate: '2024-01-10',
    endDate: '2024-04-10',
    progress: 100,
    roi: '7.8%',
    totalEarned: '₦78,000',
    planType: 'vip',
    riskLevel: 'medium',
    expectedReturn: '₦1,078,000',
    nextPayout: 'Completed',
  },
  {
    id: '4',
    userId: 'USR004',
    userName: 'Emily White',
    planName: 'Enterprise Plan',
    amount: '₦2,500,000',
    status: 'active',
    startDate: '2024-02-20',
    endDate: '2024-08-20',
    progress: 25,
    roi: '8.5%',
    totalEarned: '₦53,125',
    planType: 'enterprise',
    riskLevel: 'high',
    expectedReturn: '₦2,712,500',
    nextPayout: '2024-05-20',
  },
  {
    id: '5',
    userId: 'USR005',
    userName: 'David Brown',
    planName: 'Premium Plan',
    amount: '₦750,000',
    status: 'pending',
    startDate: '2024-03-20',
    endDate: '2024-06-20',
    progress: 0,
    roi: '6.8%',
    totalEarned: '₦0',
    planType: 'premium',
    riskLevel: 'medium',
    expectedReturn: '₦801,000',
    nextPayout: 'Pending',
  },
]

const investmentStats = [
  { label: 'Total Investments', value: '₦4.85M', icon: ChartBarIcon, color: 'text-blue-500', trend: 'up', percentage: '+12.5%' },
  { label: 'Active Plans', value: '3', icon: ClockIcon, color: 'text-green-500', trend: 'up', percentage: '+8.2%' },
  { label: 'Total ROI', value: '₦169,325', icon: CurrencyDollarIcon, color: 'text-purple-500', trend: 'up', percentage: '+20.1%' },
  { label: 'Avg. Return', value: '6.9%', icon: ArrowTrendingUpIcon, color: 'text-orange-500', trend: 'up', percentage: '+2.3%' },
]

const planDistributionData = [
  { name: 'Starter', value: 1, color: '#3B82F6' },
  { name: 'Premium', value: 2, color: '#8B5CF6' },
  { name: 'VIP', value: 1, color: '#F59E0B' },
  { name: 'Enterprise', value: 1, color: '#EF4444' },
]

const monthlyInvestmentsData = [
  { month: 'Jan', amount: 1000000 },
  { month: 'Feb', amount: 1500000 },
  { month: 'Mar', amount: 2350000 },
]

const quickActions = [
  { title: 'New Investment', icon: PlusIcon, color: 'bg-blue-500', description: 'Create investment plan' },
  { title: 'View Reports', icon: ChartBarIcon, color: 'bg-green-500', description: 'Investment analytics' },
  { title: 'Manage Plans', icon: CogIcon, color: 'bg-purple-500', description: 'Plan configuration' },
  { title: 'ROI Calculator', icon: CalculatorIcon, color: 'bg-orange-500', description: 'Calculate returns' },
]

export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>(mockInvestments)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [riskFilter, setRiskFilter] = useState('all')
  const [sortBy, setSortBy] = useState('startDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const filteredInvestments = investments.filter(investment => {
    const matchesSearch = investment.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         investment.planName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || investment.status === statusFilter
    const matchesPlan = planFilter === 'all' || investment.planType === planFilter
    const matchesRisk = riskFilter === 'all' || investment.riskLevel === riskFilter
    
    return matchesSearch && matchesStatus && matchesPlan && matchesRisk
  })

  const sortedInvestments = [...filteredInvestments].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Investment]
    let bValue: any = b[sortBy as keyof Investment]
    
    if (sortBy === 'startDate' || sortBy === 'endDate') {
      aValue = new Date(aValue).getTime()
      bValue = new Date(bValue).getTime()
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'vip':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'premium':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'starter':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent">
              Investment Management
            </h1>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
              <SparklesIcon className="h-3 w-3 mr-1" />
              Advanced
            </Badge>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Monitor and manage all platform investments with advanced analytics
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button className="bg-gradient-to-r from-[#ff5858] to-[#ff7e5f] hover:from-[#ff7e5f] hover:to-[#ff9966] text-white px-8 py-3 shadow-lg hover:shadow-xl">
            <PlusIcon className="h-5 w-5 mr-3" />
            New Investment
          </Button>
        </motion.div>
      </motion.div>

      {/* Investment Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {investmentStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-gray-300 dark:hover:border-gray-600 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`inline-flex p-3 rounded-full ${stat.color.replace('text-', 'bg-')}/10 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      stat.trend === 'up' ? 'border-green-200 text-green-700 bg-green-50' : 'border-red-200 text-red-700 bg-red-50'
                    }`}
                  >
                    {stat.percentage}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-gray-300 dark:hover:border-gray-600 group">
              <CardContent className="p-6 text-center">
                <div className={`inline-flex p-4 rounded-full ${action.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{action.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-gray-300 dark:hover:border-gray-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartBarIcon className="h-5 w-5 text-[#ff5858]" />
                Monthly Investments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyInvestmentsData}>
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                  <Bar dataKey="amount" fill="url(#investmentGradient)" radius={[4, 4, 0, 0]} />
                  <defs>
                    <linearGradient id="investmentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff5858" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ff7e5f" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-gray-300 dark:hover:border-gray-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CurrencyDollarIcon className="h-5 w-5 text-[#ff5858]" />
                Plan Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={planDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {planDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                      backdropFilter: 'blur(10px)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-4">
                {planDistributionData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Advanced Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-6"
      >
        <div className="relative lg:col-span-2">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search investments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 p-4"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="p-4">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="p-4">
            <SelectValue placeholder="Plan Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="p-4">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm px-4 py-2">
            {sortedInvestments.length} investments
          </Badge>
        </div>
      </motion.div>

      {/* Investments List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-gray-300 dark:hover:border-gray-600">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3">
              <FunnelIcon className="h-6 w-6 text-[#ff5858]" />
              Investments ({sortedInvestments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <ScrollArea className="h-[600px]">
              <div className="space-y-6">
                <AnimatePresence>
                  {sortedInvestments.map((investment, index) => (
                    <motion.div
                      key={investment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.01, x: 5 }}
                      className="flex items-center justify-between p-6 rounded-xl border-2 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-lg group"
                    >
                      <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-xl ${getPlanColor(investment.planType).replace('bg-', 'bg-').replace('text-', 'bg-')}/10 group-hover:scale-110 transition-transform duration-300`}>
                          <ChartBarIcon className={`h-8 w-8 ${getPlanColor(investment.planType).split(' ')[1]}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{investment.planName}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <UserIcon className="inline h-4 w-4 mr-2" />
                            {investment.userName}
                          </p>
                          <div className="flex items-center gap-3">
                            <Badge className={`text-xs px-3 py-1 ${getStatusColor(investment.status)}`}>
                              {investment.status}
                            </Badge>
                            <Badge className={`text-xs px-3 py-1 ${getPlanColor(investment.planType)}`}>
                              {investment.planType}
                            </Badge>
                            <Badge className={`text-xs px-3 py-1 ${getRiskColor(investment.riskLevel)}`}>
                              {investment.riskLevel === 'high' && <FireIcon className="h-3 w-3 mr-1" />}
                              {investment.riskLevel === 'medium' && <BoltIcon className="h-3 w-3 mr-1" />}
                              {investment.riskLevel === 'low' && <ShieldCheckIcon className="h-3 w-3 mr-1" />}
                              {investment.riskLevel}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            {investment.amount}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ROI: {investment.roi}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Expected: {investment.expectedReturn}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Earned: {investment.totalEarned}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Next payout: {investment.nextPayout}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              {new Date(investment.startDate).toLocaleDateString()} - {new Date(investment.endDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="w-28">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500">Progress</span>
                            <span className="text-xs font-medium">{investment.progress}%</span>
                          </div>
                          <Progress value={investment.progress} className="h-3" />
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                              className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                              <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
                            </motion.button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-64 border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
                            <DropdownMenuLabel className="px-6 py-4 font-bold text-lg border-b border-gray-100 dark:border-gray-800">
                              Investment Actions
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
                              <EyeIcon className="h-5 w-5 mr-4 text-gray-500" />
                              <div>
                                <p className="font-medium">View Details</p>
                                <p className="text-sm text-gray-500">Full investment info</p>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
                              <PencilIcon className="h-5 w-5 mr-4 text-gray-500" />
                              <div>
                                <p className="font-medium">Edit Investment</p>
                                <p className="text-sm text-gray-500">Modify investment</p>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
                              <UserIcon className="h-5 w-5 mr-4 text-gray-500" />
                              <div>
                                <p className="font-medium">View User Profile</p>
                                <p className="text-sm text-gray-500">User information</p>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
                              <CurrencyDollarIcon className="h-5 w-5 mr-4 text-gray-500" />
                              <div>
                                <p className="font-medium">View Transactions</p>
                                <p className="text-sm text-gray-500">Transaction history</p>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="px-6 py-4 cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200">
                              <TrashIcon className="h-5 w-5 mr-4" />
                              <div>
                                <p className="font-medium">Cancel Investment</p>
                                <p className="text-sm text-red-500">Terminate investment</p>
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {sortedInvestments.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <div className="text-gray-500 dark:text-gray-400 text-lg">
                      No investments found matching your criteria
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 