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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  MoreHorizontal,
  ArrowUpDown,
  UserPlus,
  FileDown,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  SparklesIcon,
  ShieldCheckIcon,
  StarIcon,
  FireIcon,
  BoltIcon,
  GlobeAltIcon,
  CogIcon,
  BellIcon,
} from '@heroicons/react/24/outline'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface User {
  id: string
  name: string
  email: string
  avatar: string
  status: 'active' | 'inactive' | 'pending'
  role: 'user' | 'premium' | 'admin'
  joinDate: string
  lastActive: string
  totalInvestments: number
  totalBalance: string
  verificationStatus: 'verified' | 'unverified' | 'pending'
  kycStatus: 'completed' | 'pending' | 'rejected'
  riskLevel: 'low' | 'medium' | 'high'
  totalTransactions: number
  referralCount: number
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'active',
    role: 'premium',
    joinDate: '2024-01-15',
    lastActive: '2024-03-20 14:30',
    totalInvestments: 3,
    totalBalance: '₦2,500,000',
    verificationStatus: 'verified',
    kycStatus: 'completed',
    riskLevel: 'low',
    totalTransactions: 45,
    referralCount: 12,
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'active',
    role: 'user',
    joinDate: '2024-02-20',
    lastActive: '2024-03-20 12:15',
    totalInvestments: 1,
    totalBalance: '₦500,000',
    verificationStatus: 'verified',
    kycStatus: 'completed',
    riskLevel: 'medium',
    totalTransactions: 23,
    referralCount: 5,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'pending',
    role: 'user',
    joinDate: '2024-03-18',
    lastActive: '2024-03-19 09:45',
    totalInvestments: 0,
    totalBalance: '₦0',
    verificationStatus: 'pending',
    kycStatus: 'pending',
    riskLevel: 'high',
    totalTransactions: 0,
    referralCount: 0,
  },
  {
    id: '4',
    name: 'Emily White',
    email: 'emily.white@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'inactive',
    role: 'user',
    joinDate: '2024-01-10',
    lastActive: '2024-03-15 16:20',
    totalInvestments: 2,
    totalBalance: '₦1,200,000',
    verificationStatus: 'verified',
    kycStatus: 'completed',
    riskLevel: 'low',
    totalTransactions: 18,
    referralCount: 8,
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'active',
    role: 'premium',
    joinDate: '2024-02-05',
    lastActive: '2024-03-20 10:30',
    totalInvestments: 5,
    totalBalance: '₦5,000,000',
    verificationStatus: 'verified',
    kycStatus: 'completed',
    riskLevel: 'low',
    totalTransactions: 67,
    referralCount: 25,
  },
]

const userStats = [
  { label: 'Total Users', value: '12,450', icon: UserIcon, color: 'text-blue-500', trend: 'up', percentage: '+12.5%' },
  { label: 'Active Users', value: '10,230', icon: CheckCircleIcon, color: 'text-green-500', trend: 'up', percentage: '+8.2%' },
  { label: 'Premium Users', value: '2,890', icon: StarIcon, color: 'text-purple-500', trend: 'up', percentage: '+15.3%' },
  { label: 'Pending KYC', value: '156', icon: ClockIcon, color: 'text-yellow-500', trend: 'down', percentage: '-5.1%' },
]

const quickActions = [
  { title: 'Add User', icon: UserPlusIcon, color: 'bg-blue-500', description: 'Create new user account' },
  { title: 'Bulk Import', icon: FileDown, color: 'bg-green-500', description: 'Import users from CSV' },
  { title: 'Export Data', icon: ArrowDownIcon, color: 'bg-purple-500', description: 'Export user data' },
  { title: 'User Reports', icon: ChartBarIcon, color: 'bg-orange-500', description: 'Generate reports' },
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [verificationFilter, setVerificationFilter] = useState('all')
  const [kycFilter, setKycFilter] = useState('all')
  const [riskFilter, setRiskFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserDialog, setShowUserDialog] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesVerification = verificationFilter === 'all' || user.verificationStatus === verificationFilter
    const matchesKyc = kycFilter === 'all' || user.kycStatus === kycFilter
    const matchesRisk = riskFilter === 'all' || user.riskLevel === riskFilter
    
    return matchesSearch && matchesStatus && matchesRole && matchesVerification && matchesKyc && matchesRisk
  })

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue: any = a[sortBy as keyof User]
    let bValue: any = b[sortBy as keyof User]
    
    if (sortBy === 'joinDate' || sortBy === 'lastActive') {
      aValue = new Date(aValue).getTime()
      bValue = new Date(bValue).getTime()
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const handleViewUserDetails = (user: User) => {
    setSelectedUser(user)
    setShowUserDialog(true)
  }

  const handleEditUser = (user: User) => {
    // In a real app, this would open an edit form
    console.log('Edit user:', user)
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'premium':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'user':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'unverified':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getKycColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
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

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
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
            <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse" />
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent">
              User Management
            </h1>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
              <SparklesIcon className="h-3 w-3 mr-1" />
              Advanced
            </Badge>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage platform users and their accounts with advanced controls
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button className="bg-gradient-to-r from-[#ff5858] to-[#ff7e5f] hover:from-[#ff7e5f] hover:to-[#ff9966] text-white px-8 py-3 shadow-lg hover:shadow-xl">
            <UserPlusIcon className="h-5 w-5 mr-3" />
            Add New User
          </Button>
        </motion.div>
      </motion.div>

      {/* User Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {userStats.map((stat, index) => (
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
                    {stat.trend === 'up' ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
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

      {/* Advanced Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
      >
        <div className="relative lg:col-span-2">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search users..."
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
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="p-4">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Select value={verificationFilter} onValueChange={setVerificationFilter}>
          <SelectTrigger className="p-4">
            <SelectValue placeholder="Verification" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="unverified">Unverified</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={kycFilter} onValueChange={setKycFilter}>
          <SelectTrigger className="p-4">
            <SelectValue placeholder="KYC Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All KYC</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
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
            {sortedUsers.length} users
          </Badge>
        </div>
      </motion.div>

      {/* Users List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-gray-300 dark:hover:border-gray-600">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3">
              <FunnelIcon className="h-6 w-6 text-[#ff5858]" />
              Users ({sortedUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <ScrollArea className="h-[600px]">
              <div className="space-y-6">
                <AnimatePresence>
                  {sortedUsers.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.01, x: 5 }}
                      className="flex items-center justify-between p-6 rounded-xl border-2 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-lg group"
                    >
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <Avatar className="h-16 w-16 ring-4 ring-gray-100 dark:ring-gray-800 group-hover:ring-2 group-hover:ring-blue-200 transition-all duration-300">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-gradient-to-r from-[#ff5858] to-[#ff7e5f] text-white text-lg font-semibold">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {user.status === 'active' && (
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-900 animate-pulse" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{user.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{user.email}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge className={`text-xs px-3 py-1 ${getStatusColor(user.status)}`}>
                              {user.status}
                            </Badge>
                            <Badge className={`text-xs px-3 py-1 ${getRoleColor(user.role)}`}>
                              {user.role}
                            </Badge>
                            <Badge className={`text-xs px-3 py-1 ${getVerificationColor(user.verificationStatus)}`}>
                              {user.verificationStatus}
                            </Badge>
                            <Badge className={`text-xs px-3 py-1 ${getKycColor(user.kycStatus)}`}>
                              KYC: {user.kycStatus}
                            </Badge>
                            <Badge className={`text-xs px-3 py-1 ${getRiskColor(user.riskLevel)}`}>
                              {user.riskLevel === 'high' && <FireIcon className="h-3 w-3 mr-1" />}
                              {user.riskLevel === 'medium' && <BoltIcon className="h-3 w-3 mr-1" />}
                              {user.riskLevel === 'low' && <ShieldCheckIcon className="h-3 w-3 mr-1" />}
                              {user.riskLevel}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            {user.totalBalance}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.totalInvestments} investments
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {user.totalTransactions} transactions
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Joined {new Date(user.joinDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Last active: {user.lastActive}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {user.referralCount} referrals
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
                              User Actions
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                              onClick={() => handleViewUserDetails(user)}
                            >
                              <EyeIcon className="h-5 w-5 mr-4 text-gray-500" />
                              <div>
                                <p className="font-medium">View Details</p>
                                <p className="text-sm text-gray-500">Full user profile</p>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                              onClick={() => handleEditUser(user)}
                            >
                              <PencilIcon className="h-5 w-5 mr-4 text-gray-500" />
                              <div>
                                <p className="font-medium">Edit User</p>
                                <p className="text-sm text-gray-500">Modify user data</p>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
                              <UserIcon className="h-5 w-5 mr-4 text-gray-500" />
                              <div>
                                <p className="font-medium">View Investments</p>
                                <p className="text-sm text-gray-500">Investment history</p>
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
                            <DropdownMenuItem 
                              className="px-6 py-4 cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <TrashIcon className="h-5 w-5 mr-4" />
                              <div>
                                <p className="font-medium">Delete User</p>
                                <p className="text-sm text-red-500">Remove from system</p>
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {sortedUsers.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <div className="text-gray-500 dark:text-gray-400 text-lg">
                      No users found matching your criteria
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>

      {/* User Details Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-4xl border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-[#ff5858]" />
              User Details
            </DialogTitle>
            <DialogDescription>
              Comprehensive information about the selected user
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-6 p-6 rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
                <Avatar className="h-24 w-24 ring-4 ring-white dark:ring-gray-800">
                  <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                  <AvatarFallback className="bg-gradient-to-r from-[#ff5858] to-[#ff7e5f] text-white font-semibold text-2xl">
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{selectedUser.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">{selectedUser.email}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className={getStatusColor(selectedUser.status)}>
                      {selectedUser.status}
                    </Badge>
                    <Badge className={getRoleColor(selectedUser.role)}>
                      {selectedUser.role}
                    </Badge>
                    <Badge className={getVerificationColor(selectedUser.verificationStatus)}>
                      {selectedUser.verificationStatus}
                    </Badge>
                    <Badge className={getKycColor(selectedUser.kycStatus)}>
                      KYC: {selectedUser.kycStatus}
                    </Badge>
                    <Badge className={getRiskColor(selectedUser.riskLevel)}>
                      {selectedUser.riskLevel === 'high' && <FireIcon className="h-3 w-3 mr-1" />}
                      {selectedUser.riskLevel === 'medium' && <BoltIcon className="h-3 w-3 mr-1" />}
                      {selectedUser.riskLevel === 'low' && <ShieldCheckIcon className="h-3 w-3 mr-1" />}
                      {selectedUser.riskLevel}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Account Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">User ID:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{selectedUser.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Total Balance:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{selectedUser.totalBalance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Total Investments:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{selectedUser.totalInvestments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Total Transactions:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{selectedUser.totalTransactions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Referral Count:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{selectedUser.referralCount}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Activity Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Join Date:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {new Date(selectedUser.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Last Active:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{selectedUser.lastActive}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Status:</span>
                      <Badge className={getStatusColor(selectedUser.status)}>
                        {selectedUser.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Role:</span>
                      <Badge className={getRoleColor(selectedUser.role)}>
                        {selectedUser.role}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Risk Level:</span>
                      <Badge className={getRiskColor(selectedUser.riskLevel)}>
                        {selectedUser.riskLevel}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  className="flex-1 bg-blue-500 hover:bg-blue-600"
                  onClick={() => {
                    console.log('View investments for:', selectedUser.id)
                  }}
                >
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  View Investments
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    console.log('View transactions for:', selectedUser.id)
                  }}
                >
                  <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                  View Transactions
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    console.log('Edit user:', selectedUser.id)
                  }}
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit User
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 