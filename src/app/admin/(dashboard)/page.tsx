'use client';

import { useState, useEffect } from 'react';
import {
  UsersIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  UserPlusIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  SparklesIcon,
  RocketLaunchIcon,
  StarIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  GlobeAltIcon,
  CogIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart, Area, AreaChart, PieChart, Pie, Cell } from 'recharts';

const kpiData = [
  { 
    title: 'Total Users', 
    value: '12,450', 
    change: '+12.5%', 
    changeType: 'increase',
    Icon: UsersIcon, 
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-200',
    description: 'Active platform users',
    trend: 'up',
    percentage: 85
  },
  { 
    title: 'Active Investments', 
    value: '3,890', 
    change: '+8.2%', 
    changeType: 'increase',
    Icon: ChartBarIcon, 
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-200',
    description: 'Ongoing investments',
    trend: 'up',
    percentage: 72
  },
  { 
    title: 'Total Revenue', 
    value: '₦150.7M', 
    change: '+20.1%', 
    changeType: 'increase',
    Icon: CurrencyDollarIcon, 
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-200',
    description: 'Platform revenue',
    trend: 'up',
    percentage: 94
  },
  { 
    title: 'Pending Withdrawals', 
    value: '85', 
    change: '-3.5%', 
    changeType: 'decrease',
    Icon: ClockIcon, 
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-200',
    description: 'Awaiting approval',
    trend: 'down',
    percentage: 23
  },
];

const recentActivities = [
  { 
    type: 'New User', 
    description: 'John Doe has registered.', 
    time: '2 min ago', 
    Icon: UserPlusIcon, 
    color: 'text-green-500',
    bgColor: 'bg-green-100',
    status: 'success',
    priority: 'high'
  },
  { 
    type: 'New Investment', 
    description: 'Jane Smith invested ₦50,000 in Vanguard Plan.', 
    time: '15 min ago', 
    Icon: ChartBarIcon, 
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    status: 'info',
    priority: 'medium'
  },
  { 
    type: 'Withdrawal', 
    description: 'Mike Johnson requested a withdrawal of ₦25,000.', 
    time: '1 hour ago', 
    Icon: ArrowDownIcon, 
    color: 'text-red-500',
    bgColor: 'bg-red-100',
    status: 'warning',
    priority: 'high'
  },
  { 
    type: 'Deposit', 
    description: 'Emily White deposited ₦100,000.', 
    time: '3 hours ago', 
    Icon: ArrowUpIcon, 
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
    status: 'success',
    priority: 'medium'
  },
];

const userGrowthData = [
  { month: 'Jan', users: 200, revenue: 15000, investments: 120 },
  { month: 'Feb', users: 350, revenue: 25000, investments: 180 },
  { month: 'Mar', users: 500, revenue: 35000, investments: 250 },
  { month: 'Apr', users: 620, revenue: 42000, investments: 320 },
  { month: 'May', users: 800, revenue: 55000, investments: 450 },
  { month: 'Jun', users: 1100, revenue: 75000, investments: 680 },
];

const platformStats = [
  { label: 'Success Rate', value: '99.9%', icon: ShieldCheckIcon, color: 'text-green-500', trend: 'up' },
  { label: 'Avg. ROI', value: '6.2%', icon: ChartBarIcon, color: 'text-blue-500', trend: 'up' },
  { label: 'Total Volume', value: '₦2.1B', icon: BanknotesIcon, color: 'text-purple-500', trend: 'up' },
  { label: 'Active Plans', value: '10', icon: ChartBarIcon, color: 'text-orange-500', trend: 'stable' },
];

const quickActions = [
  { title: 'Add User', icon: UserPlusIcon, color: 'bg-blue-500', href: '/admin/users' },
  { title: 'View Reports', icon: ChartBarIcon, color: 'bg-green-500', href: '/admin/reports' },
  { title: 'Settings', icon: CogIcon, color: 'bg-purple-500', href: '/admin/settings' },
  { title: 'Notifications', icon: BellIcon, color: 'bg-orange-500', href: '/admin/notifications' },
];

const systemStatus = {
  status: 'operational',
  uptime: '99.98%',
  lastIncident: '2 weeks ago',
  performance: 'excellent'
};

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('6M');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
    );
  }

  return (
    <div className="space-y-8 max-w-[2000px] mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent tracking-tight">
              Admin Dashboard
            </h1>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
              <SparklesIcon className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </div>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening with your platform today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Badge variant="outline" className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full border-2 shadow-lg">
              <ShieldCheckIcon className="h-5 w-5 text-green-500" />
              <span className="font-semibold">System: {systemStatus.status}</span>
            </Badge>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button className="bg-gradient-to-r from-[#ff5858] to-[#ff7e5f] hover:from-[#ff7e5f] hover:to-[#ff9966] text-white px-8 py-3 shadow-lg hover:shadow-xl">
              <RocketLaunchIcon className="h-5 w-5 mr-2" />
              Quick Actions
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-gray-300 dark:hover:border-gray-600 group">
              <CardContent className="p-6 text-center">
                <div className={`inline-flex p-4 rounded-full ${action.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{action.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Quick access</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <Card className={`relative overflow-hidden border-2 ${kpi.borderColor} hover:shadow-2xl transition-all duration-300 group`}>
              <div className={`absolute top-0 right-0 w-32 h-32 ${kpi.bgColor} rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
                <CardTitle className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  {kpi.title}
                </CardTitle>
                <div className={`p-3 rounded-xl ${kpi.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <kpi.Icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
              </CardHeader>
              <CardContent className="relative z-10 pb-6">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                  {kpi.value}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <Badge 
                    variant={kpi.changeType === 'increase' ? 'default' : 'destructive'}
                    className={`text-xs px-3 py-1 ${
                      kpi.changeType === 'increase' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {kpi.trend === 'up' && <ArrowUpIcon className="h-3 w-3 mr-1" />}
                    {kpi.trend === 'down' && <ArrowDownIcon className="h-3 w-3 mr-1" />}
                    {kpi.change}
                  </Badge>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    from last month
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Progress</span>
                    <span className="font-medium">{kpi.percentage}%</span>
                  </div>
                  <Progress value={kpi.percentage} className="h-2" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  {kpi.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Platform Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {platformStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <Card className="text-center hover:shadow-xl transition-all duration-300 border-2 hover:border-gray-300 dark:hover:border-gray-600 group">
              <CardContent className="p-8">
                <div className={`inline-flex p-4 rounded-full ${stat.color.replace('text-', 'bg-')}/10 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {stat.label}
                </p>
                <div className="flex items-center justify-center gap-1">
                  {stat.trend === 'up' && <ArrowUpIcon className="h-4 w-4 text-green-500" />}
                  {stat.trend === 'down' && <ArrowDownIcon className="h-4 w-4 text-red-500" />}
                  {stat.trend === 'stable' && <div className="h-4 w-4 rounded-full bg-gray-400" />}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-gray-300 dark:hover:border-gray-600">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-[#ff5858]" />
                  Platform Growth Analytics
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Users</Badge>
                  <Badge variant="outline" className="text-xs">Revenue</Badge>
                  <Badge variant="outline" className="text-xs">Investments</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pl-4 pb-6">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={userGrowthData}>
                  <defs>
                    <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff5858" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ff5858" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff7e5f" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ff7e5f" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="investmentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff9966" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ff9966" stopOpacity={0}/>
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
                    dataKey="users" 
                    stroke="#ff5858" 
                    fill="url(#userGradient)" 
                    strokeWidth={3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#ff7e5f" 
                    fill="url(#revenueGradient)" 
                    strokeWidth={3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="investments" 
                    stroke="#ff9966" 
                    fill="url(#investmentGradient)" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card className="hover:shadow-2xl transition-all duration-300 border-2 hover:border-gray-300 dark:hover:border-gray-600">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3">
                <ClockIcon className="h-6 w-6 text-[#ff5858]" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  <AnimatePresence>
                    {recentActivities.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
                      >
                        <div className={`flex-shrink-0 p-3 rounded-full ${activity.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                          <activity.Icon className={`h-6 w-6 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {activity.type}
                            </p>
                            {activity.priority === 'high' && (
                              <Badge variant="destructive" className="text-xs px-2 py-0">
                                <FireIcon className="h-3 w-3 mr-1" />
                                High
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate mb-2">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {activity.time}
                          </p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs px-3 py-1 ${
                            activity.status === 'success' ? 'border-green-200 text-green-700 bg-green-50' :
                            activity.status === 'warning' ? 'border-yellow-200 text-yellow-700 bg-yellow-50' :
                            'border-blue-200 text-blue-700 bg-blue-50'
                          }`}
                        >
                          {activity.status}
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="grid gap-6 md:grid-cols-2"
      >
        <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-gray-300 dark:hover:border-gray-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GlobeAltIcon className="h-5 w-5 text-[#ff5858]" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                <span className="font-semibold text-green-700 dark:text-green-300">All Systems Operational</span>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {systemStatus.uptime}
              </Badge>
            </div>
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Performance</span>
                <span className="font-medium text-gray-900 dark:text-white">{systemStatus.performance}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Last Incident</span>
                <span className="font-medium text-gray-900 dark:text-white">{systemStatus.lastIncident}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-gray-300 dark:hover:border-gray-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrophyIcon className="h-5 w-5 text-[#ff5858]" />
              Platform Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
              <StarIcon className="h-6 w-6 text-yellow-500" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Top Performer</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">99.9% uptime this month</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <BoltIcon className="h-6 w-6 text-blue-500" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Fast Growth</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">+25% user growth</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 