'use client'

import { useState, useEffect } from 'react'
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
import { MoreHorizontal } from 'lucide-react'
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
import { DateRangePicker } from '@/components/ui/datepicker'
import { DateRange } from 'react-day-picker'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  BanknotesIcon,
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
  ArrowDownTrayIcon,
  ShieldCheckIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart, Area, AreaChart } from 'recharts'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface Transaction {
  id: string
  userId: string
  userName: string
  userAvatar: string
  type: 'deposit' | 'withdrawal' | 'investment' | 'roi' | 'transfer'
  amount: string
  currency: 'NGN' | 'USDT'
  status: 'completed' | 'pending' | 'failed' | 'cancelled'
  date: string
  time: string
  reference: string
  description: string
  fee?: string
  netAmount?: string
  riskLevel: 'low' | 'medium' | 'high'
  priority: 'low' | 'medium' | 'high'
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    userId: 'USR001',
    userName: 'John Doe',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    type: 'deposit',
    amount: '₦500,000',
    currency: 'NGN',
    status: 'completed',
    date: '2024-03-20',
    time: '14:30',
    reference: 'TXN-2024-001',
    description: 'Bank transfer deposit',
    fee: '₦100',
    netAmount: '₦499,900',
    riskLevel: 'low',
    priority: 'medium',
  },
  {
    id: '2',
    userId: 'USR002',
    userName: 'Jane Smith',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    type: 'investment',
    amount: '₦100,000',
    currency: 'NGN',
    status: 'completed',
    date: '2024-03-20',
    time: '12:15',
    reference: 'TXN-2024-002',
    description: 'Investment in Vanguard Plan',
    riskLevel: 'low',
    priority: 'low',
  },
  {
    id: '3',
    userId: 'USR003',
    userName: 'Mike Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    type: 'withdrawal',
    amount: '₦250,000',
    currency: 'NGN',
    status: 'pending',
    date: '2024-03-20',
    time: '10:45',
    reference: 'TXN-2024-003',
    description: 'Withdrawal to bank account',
    fee: '₦500',
    netAmount: '₦249,500',
    riskLevel: 'medium',
    priority: 'high',
  },
  {
    id: '4',
    userId: 'USR004',
    userName: 'Emily White',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    type: 'roi',
    amount: '₦15,000',
    currency: 'NGN',
    status: 'completed',
    date: '2024-03-19',
    time: '16:20',
    reference: 'TXN-2024-004',
    description: 'ROI payment from investment',
    riskLevel: 'low',
    priority: 'low',
  },
  {
    id: '5',
    userId: 'USR005',
    userName: 'David Brown',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    type: 'deposit',
    amount: '1000 USDT',
    currency: 'USDT',
    status: 'failed',
    date: '2024-03-19',
    time: '09:30',
    reference: 'TXN-2024-005',
    description: 'USDT deposit via wallet',
    riskLevel: 'high',
    priority: 'high',
  },
]

const transactionStats = [
  { label: 'Total Volume', value: '₦2.1B', icon: BanknotesIcon, color: 'text-blue-500', trend: 'up', percentage: '+15.2%' },
  { label: 'Success Rate', value: '98.5%', icon: CheckCircleIcon, color: 'text-green-500', trend: 'up', percentage: '+2.1%' },
  { label: 'Pending', value: '23', icon: ClockIcon, color: 'text-yellow-500', trend: 'down', percentage: '-8.5%' },
  { label: 'Failed', value: '5', icon: XCircleIcon, color: 'text-red-500', trend: 'down', percentage: '-12.3%' },
]

const transactionVolumeData = [
  { month: 'Jan', volume: 150000000, count: 1250 },
  { month: 'Feb', volume: 180000000, count: 1400 },
  { month: 'Mar', volume: 210000000, count: 1650 },
]

const transactionTypeData = [
  { type: 'Deposits', value: 45, color: '#10B981' },
  { type: 'Withdrawals', value: 25, color: '#EF4444' },
  { type: 'Investments', value: 20, color: '#3B82F6' },
  { type: 'ROI', value: 10, color: '#8B5CF6' },
]

const quickActions = [
  { title: 'New Transaction', icon: PlusIcon, color: 'bg-blue-500', description: 'Create transaction' },
  { title: 'Export Data', icon: ArrowDownTrayIcon, color: 'bg-green-500', description: 'Export reports' },
  { title: 'Analytics', icon: ChartBarIcon, color: 'bg-purple-500', description: 'View analytics' },
  { title: 'Settings', icon: CogIcon, color: 'bg-orange-500', description: 'Transaction settings' },
]

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currencyFilter, setCurrencyFilter] = useState('all')
  const [riskFilter, setRiskFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
    const matchesCurrency = currencyFilter === 'all' || transaction.currency === currencyFilter
    const matchesRisk = riskFilter === 'all' || transaction.riskLevel === riskFilter
    const matchesPriority = priorityFilter === 'all' || transaction.priority === priorityFilter
    
    return matchesSearch && matchesType && matchesStatus && matchesCurrency && matchesRisk && matchesPriority
  })

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aValue: any = a[sortBy as keyof Transaction]
    let bValue: any = b[sortBy as keyof Transaction]
    
    if (sortBy === 'date') {
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
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'withdrawal':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'investment':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'roi':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'transfer':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownIcon className="h-4 w-4" />
      case 'withdrawal':
        return <ArrowUpIcon className="h-4 w-4" />
      case 'investment':
        return <CurrencyDollarIcon className="h-4 w-4" />
      case 'roi':
        return <DocumentTextIcon className="h-4 w-4" />
      case 'transfer':
        return <ArrowUpIcon className="h-4 w-4" />
      default:
        return <CurrencyDollarIcon className="h-4 w-4" />
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleApproveTransaction = (transactionId: string) => {
    setTransactions(prev => 
      prev.map(t => 
        t.id === transactionId ? { ...t, status: 'completed' as const } : t
      )
    )
  }

  const handleRejectTransaction = (transactionId: string) => {
    setTransactions(prev => 
      prev.map(t => 
        t.id === transactionId ? { ...t, status: 'failed' as const } : t
      )
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-5 w-5 bg-gray-200 rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-20 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-32 bg-gray-200 rounded" />
              </CardContent>
            </Card>
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
              Transaction Management
            </h1>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
              <SparklesIcon className="h-3 w-3 mr-1" />
              Advanced
            </Badge>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Monitor and manage all platform transactions with real-time analytics
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button className="bg-gradient-to-r from-[#ff5858] to-[#ff7e5f] hover:from-[#ff7e5f] hover:to-[#ff9966] text-white px-8 py-3 shadow-lg hover:shadow-xl">
            <DocumentTextIcon className="h-5 w-5 mr-3" />
            Export Report
          </Button>
        </motion.div>
      </motion.div>

      {/* Transaction Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {transactionStats.map((stat, index) => (
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
                <CurrencyDollarIcon className="h-5 w-5 text-[#ff5858]" />
                Transaction Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={transactionVolumeData}>
                  <defs>
                    <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff5858" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ff7e5f" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
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
                  <Area 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#ff5858" 
                    fill="url(#volumeGradient)" 
                    strokeWidth={3}
                  />
                </AreaChart>
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
                <DocumentTextIcon className="h-5 w-5 text-[#ff5858]" />
                Transaction Types
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactionTypeData.map((item, index) => (
                  <motion.div
                    key={item.type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg border-2 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-medium text-gray-900 dark:text-white">{item.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300" 
                          style={{ 
                            width: `${item.value}%`, 
                            backgroundColor: item.color 
                          }} 
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-8">
                        {item.value}%
                      </span>
                    </div>
                  </motion.div>
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
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
      >
        <div className="relative lg:col-span-2">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 p-4"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="p-4">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="deposit">Deposits</SelectItem>
            <SelectItem value="withdrawal">Withdrawals</SelectItem>
            <SelectItem value="investment">Investments</SelectItem>
            <SelectItem value="roi">ROI</SelectItem>
            <SelectItem value="transfer">Transfers</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="p-4">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
          <SelectTrigger className="p-4">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Currencies</SelectItem>
            <SelectItem value="NGN">NGN</SelectItem>
            <SelectItem value="USDT">USDT</SelectItem>
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
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="p-4">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm px-4 py-2">
            {sortedTransactions.length} transactions
          </Badge>
        </div>
      </motion.div>

      {/* Transactions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-gray-300 dark:hover:border-gray-600">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3">
              <FunnelIcon className="h-6 w-6 text-[#ff5858]" />
              Transactions ({sortedTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                <AnimatePresence>
                  {sortedTransactions.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.01, x: 5 }}
                      className="flex items-center justify-between p-6 rounded-xl border-2 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-lg group"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 ring-2 ring-gray-100 dark:ring-gray-800 group-hover:ring-2 group-hover:ring-blue-200 transition-all duration-300">
                          <AvatarImage src={transaction.userAvatar} alt={transaction.userName} />
                          <AvatarFallback className="bg-gradient-to-r from-[#ff5858] to-[#ff7e5f] text-white font-semibold">
                            {transaction.userName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{transaction.userName}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={`text-xs ${getTypeColor(transaction.type)}`}>
                              <div className="flex items-center gap-1">
                                {getTypeIcon(transaction.type)}
                                {transaction.type}
                              </div>
                            </Badge>
                            <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                            </Badge>
                            <Badge className={`text-xs ${getRiskColor(transaction.riskLevel)}`}>
                              {transaction.riskLevel === 'high' && <FireIcon className="h-3 w-3 mr-1" />}
                              {transaction.riskLevel === 'medium' && <BoltIcon className="h-3 w-3 mr-1" />}
                              {transaction.riskLevel === 'low' && <ShieldCheckIcon className="h-3 w-3 mr-1" />}
                              {transaction.riskLevel}
                            </Badge>
                            <Badge className={`text-xs ${getPriorityColor(transaction.priority)}`}>
                              {transaction.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {transaction.amount}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {transaction.currency}
                          </p>
                          {transaction.fee && (
                            <p className="text-xs text-gray-400">
                              Fee: {transaction.fee}
                            </p>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.date}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {transaction.time}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Ref: {transaction.reference}
                          </p>
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
                              Transaction Actions
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                              onClick={() => setSelectedTransaction(transaction)}
                            >
                              <EyeIcon className="h-5 w-5 mr-4 text-gray-500" />
                              <div>
                                <p className="font-medium">View Details</p>
                                <p className="text-sm text-gray-500">Full transaction info</p>
                              </div>
                            </DropdownMenuItem>
                            {transaction.status === 'pending' && (
                              <>
                                <DropdownMenuItem 
                                  className="px-6 py-4 cursor-pointer text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
                                  onClick={() => handleApproveTransaction(transaction.id)}
                                >
                                  <CheckCircleIcon className="h-5 w-5 mr-4" />
                                  <div>
                                    <p className="font-medium">Approve</p>
                                    <p className="text-sm text-green-500">Approve transaction</p>
                                  </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="px-6 py-4 cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                                  onClick={() => handleRejectTransaction(transaction.id)}
                                >
                                  <XCircleIcon className="h-5 w-5 mr-4" />
                                  <div>
                                    <p className="font-medium">Reject</p>
                                    <p className="text-sm text-red-500">Reject transaction</p>
                                  </div>
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {sortedTransactions.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="text-gray-500 dark:text-gray-400">
                      No transactions found matching your criteria
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>

      {/* Transaction Details Dialog */}
      <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
        <DialogContent className="max-w-2xl border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DocumentTextIcon className="h-5 w-5 text-[#ff5858]" />
              Transaction Details
            </DialogTitle>
            <DialogDescription>
              Detailed information about the selected transaction
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
                <Avatar className="h-16 w-16 ring-4 ring-white dark:ring-gray-800">
                  <AvatarImage src={selectedTransaction.userAvatar} alt={selectedTransaction.userName} />
                  <AvatarFallback className="bg-gradient-to-r from-[#ff5858] to-[#ff7e5f] text-white font-semibold text-lg">
                    {selectedTransaction.userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedTransaction.userName}</h3>
                  <p className="text-gray-500 dark:text-gray-400">User ID: {selectedTransaction.userId}</p>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Amount:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedTransaction.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Currency:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedTransaction.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Type:</span>
                    <Badge className={getTypeColor(selectedTransaction.type)}>
                      {selectedTransaction.type}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Status:</span>
                    <Badge className={getStatusColor(selectedTransaction.status)}>
                      {selectedTransaction.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Date:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedTransaction.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Time:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedTransaction.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Reference:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{selectedTransaction.reference}</span>
                  </div>
                  {selectedTransaction.fee && (
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Fee:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{selectedTransaction.fee}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                <p className="text-gray-600 dark:text-gray-300">{selectedTransaction.description}</p>
              </div>
              
              {selectedTransaction.status === 'pending' && (
                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-green-500 hover:bg-green-600"
                    onClick={() => {
                      handleApproveTransaction(selectedTransaction.id)
                      setSelectedTransaction(null)
                    }}
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Approve Transaction
                  </Button>
                  <Button 
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      handleRejectTransaction(selectedTransaction.id)
                      setSelectedTransaction(null)
                    }}
                  >
                    <XCircleIcon className="h-4 w-4 mr-2" />
                    Reject Transaction
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 