'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { MoreHorizontal } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import {
  BellIcon,
  CogIcon,
  ShieldCheckIcon,
  UserIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  SparklesIcon,
  RocketLaunchIcon,
  StarIcon,
  TrophyIcon,
  FireIcon,
  BoltIcon,
  GlobeAltIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CheckIcon,
  ArrowPathIcon,
  UsersIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

const investmentPlans = [
  { id: 'P001', name: 'Naira Cadet', roi: '5%', duration: '30 days', min: '₦5,000', max: '₦25,000', status: 'active' },
  { id: 'P002', name: 'USDT Admiral', roi: '7.1%', duration: '30 days', min: '100 USDT', max: '150 USDT', status: 'active' },
]

const quickActions = [
  { title: 'Backup Settings', icon: ArrowDownTrayIcon, color: 'bg-blue-500', description: 'Export configuration' },
  { title: 'Restore Settings', icon: ArrowUpTrayIcon, color: 'bg-green-500', description: 'Import configuration' },
  { title: 'Reset to Default', icon: ArrowPathIcon, color: 'bg-orange-500', description: 'Reset all settings' },
  { title: 'System Health', icon: ShieldCheckIcon, color: 'bg-purple-500', description: 'Check system status' },
]

const systemStatus = {
  status: 'operational',
  uptime: '99.98%',
  lastBackup: '2 hours ago',
  nextBackup: '22 hours',
  performance: 'excellent'
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [showPassword, setShowPassword] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSaveSettings = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
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
              Platform Settings
            </h1>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
              <SparklesIcon className="h-3 w-3 mr-1" />
              Advanced
            </Badge>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Configure platform settings and preferences with advanced controls
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button 
            className="bg-gradient-to-r from-[#ff5858] to-[#ff7e5f] hover:from-[#ff7e5f] hover:to-[#ff9966] text-white px-8 py-3 shadow-lg hover:shadow-xl"
            onClick={handleSaveSettings}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <CheckIcon className="h-5 w-5 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </motion.div>
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
                <p className="text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
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
                <span className="text-gray-600 dark:text-gray-400">Last Backup</span>
                <span className="font-medium text-gray-900 dark:text-white">{systemStatus.lastBackup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Next Backup</span>
                <span className="font-medium text-gray-900 dark:text-white">{systemStatus.nextBackup}</span>
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
                <p className="font-semibold text-gray-900 dark:text-white">Fast Response</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average response time: 0.2s</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Settings Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <TabsTrigger 
              value="general" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#ff5858] data-[state=active]:shadow-sm rounded-lg"
            >
              <GlobeAltIcon className="h-4 w-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger 
              value="investments" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#ff5858] data-[state=active]:shadow-sm rounded-lg"
            >
              <CurrencyDollarIcon className="h-4 w-4 mr-2" />
              Investments
            </TabsTrigger>
            <TabsTrigger 
              value="withdrawals" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#ff5858] data-[state=active]:shadow-sm rounded-lg"
            >
              <UsersIcon className="h-4 w-4 mr-2" />
              Withdrawals
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#ff5858] data-[state=active]:shadow-sm rounded-lg"
            >
              <ShieldCheckIcon className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="data-[state=active]:bg-white data-[state=active]:text-[#ff5858] data-[state=active]:shadow-sm rounded-lg"
            >
              <BellIcon className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-gray-300 dark:hover:border-gray-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GlobeAltIcon className="h-5 w-5 text-[#ff5858]" />
                    Platform Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input id="platformName" defaultValue="KLTMINES" className="p-3" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platformUrl">Platform URL</Label>
                    <Input id="platformUrl" defaultValue="https://kltmines.com" className="p-3" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input id="supportEmail" defaultValue="support@kltmines.com" className="p-3" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="africa/lagos">
                      <SelectTrigger className="p-3">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="africa/lagos">Africa/Lagos (WAT)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="america/new_york">America/New_York (EST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-gray-300 dark:hover:border-gray-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CogIcon className="h-5 w-5 text-[#ff5858]" />
                    System Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Maintenance Mode</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Temporarily disable platform access
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Registration</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Allow new user registrations
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Verification</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Require email verification
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">KYC Verification</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Require KYC for withdrawals
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Investment Settings */}
          <TabsContent value="investments" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-gray-300 dark:hover:border-gray-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CurrencyDollarIcon className="h-5 w-5 text-[#ff5858]" />
                    Investment Limits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="minInvestment">Minimum Investment (NGN)</Label>
                    <Input id="minInvestment" defaultValue="10000" className="p-3" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxInvestment">Maximum Investment (NGN)</Label>
                    <Input id="maxInvestment" defaultValue="10000000" className="p-3" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minInvestmentUsdt">Minimum Investment (USDT)</Label>
                    <Input id="minInvestmentUsdt" defaultValue="10" className="p-3" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxInvestmentUsdt">Maximum Investment (USDT)</Label>
                    <Input id="maxInvestmentUsdt" defaultValue="10000" className="p-3" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-gray-300 dark:hover:border-gray-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CurrencyDollarIcon className="h-5 w-5 text-[#ff5858]" />
                    ROI Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultRoi">Default ROI (%)</Label>
                    <Input id="defaultRoi" defaultValue="6.5" className="p-3" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxRoi">Maximum ROI (%)</Label>
                    <Input id="maxRoi" defaultValue="8.5" className="p-3" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="investmentDuration">Default Duration (Days)</Label>
                    <Input id="investmentDuration" defaultValue="90" className="p-3" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="earlyWithdrawalFee">Early Withdrawal Fee (%)</Label>
                    <Input id="earlyWithdrawalFee" defaultValue="2.5" className="p-3" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Withdrawal Settings */}
          <TabsContent value="withdrawals" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-gray-300 dark:hover:border-gray-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UsersIcon className="h-5 w-5 text-[#ff5858]" />
                    Withdrawal Limits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="minWithdrawal">Minimum Withdrawal (NGN)</Label>
                    <Input id="minWithdrawal" defaultValue="2000" className="p-3" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxWithdrawal">Maximum Withdrawal (NGN)</Label>
                    <Input id="maxWithdrawal" defaultValue="5000000" className="p-3" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minWithdrawalUsdt">Minimum Withdrawal (USDT)</Label>
                    <Input id="minWithdrawalUsdt" defaultValue="5" className="p-3" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxWithdrawalUsdt">Maximum Withdrawal (USDT)</Label>
                    <Input id="maxWithdrawalUsdt" defaultValue="5000" className="p-3" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-gray-300 dark:hover:border-gray-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UsersIcon className="h-5 w-5 text-[#ff5858]" />
                    Processing Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="processingTime">Processing Time (Hours)</Label>
                    <Input id="processingTime" defaultValue="24" className="p-3" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="withdrawalFee">Withdrawal Fee (%)</Label>
                    <Input id="withdrawalFee" defaultValue="0.5" className="p-3" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Auto-Approval</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Automatically approve small withdrawals
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Manual Review</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Require manual review for large amounts
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-gray-300 dark:hover:border-gray-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheckIcon className="h-5 w-5 text-[#ff5858]" />
                    Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Require 2FA for admin access
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Session Timeout</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Auto-logout after inactivity
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (Minutes)</Label>
                    <Input id="sessionTimeout" defaultValue="30" className="p-3" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input id="maxLoginAttempts" defaultValue="5" className="p-3" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-gray-300 dark:hover:border-gray-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <KeyIcon className="h-5 w-5 text-[#ff5858]" />
                    API Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <div className="relative">
                      <Input 
                        id="apiKey" 
                        type={showApiKey ? "text" : "password"}
                        defaultValue="sk_live_1234567890abcdef" 
                        className="p-3 pr-10" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showApiKey ? (
                          <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="webhookUrl">Webhook URL</Label>
                    <Input id="webhookUrl" defaultValue="https://api.kltmines.com/webhook" className="p-3" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">IP Whitelist</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Restrict admin access to specific IPs
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <Button variant="outline" className="w-full">
                    <KeyIcon className="h-4 w-4 mr-2" />
                    Regenerate API Key
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-gray-300 dark:hover:border-gray-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BellIcon className="h-5 w-5 text-[#ff5858]" />
                    Email Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">New User Registration</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Notify when new users register
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Large Transactions</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Alert for transactions above threshold
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">System Alerts</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Critical system notifications
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Weekly Reports</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Automated weekly summaries
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-gray-300 dark:hover:border-gray-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BellIcon className="h-5 w-5 text-[#ff5858]" />
                    Alert Thresholds
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="largeTransactionThreshold">Large Transaction Alert (NGN)</Label>
                    <Input id="largeTransactionThreshold" defaultValue="1000000" className="p-3" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="failedTransactionThreshold">Failed Transaction Alert</Label>
                    <Input id="failedTransactionThreshold" defaultValue="10" className="p-3" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="systemLoadThreshold">System Load Alert (%)</Label>
                    <Input id="systemLoadThreshold" defaultValue="80" className="p-3" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notificationEmail">Notification Email</Label>
                    <Input id="notificationEmail" defaultValue="admin@kltmines.com" className="p-3" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
} 