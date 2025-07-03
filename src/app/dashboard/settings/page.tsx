'use client'

import { useState, useEffect } from 'react'
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  WalletIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useUser, useUpdateProfile } from '@/lib/hooks/useAuth'

interface NotificationSetting {
  id: string
  title: string
  description: string
  enabled: boolean
}

const notificationSettings: NotificationSetting[] = [
  {
    id: 'email',
    title: 'Email Notifications',
    description: 'Receive notifications via email',
    enabled: true,
  },
  {
    id: 'push',
    title: 'Push Notifications',
    description: 'Receive push notifications',
    enabled: true,
  },
  {
    id: 'security',
    title: 'Security Alerts',
    description: 'Get notified about security events',
    enabled: true,
  },
]

export default function SettingsPage() {
  const { data: user, isLoading: userLoading } = useUser()
  const updateProfile = useUpdateProfile()
  
  const [notifications, setNotifications] = useState(notificationSettings)
  const [language, setLanguage] = useState('en')
  const [currency, setCurrency] = useState('NGN')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showBankDialog, setShowBankDialog] = useState(false)
  const [showCryptoDialog, setShowCryptoDialog] = useState(false)
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false)
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '****1234',
    bankName: 'Access Bank',
    accountName: 'John Doe',
  })
  const [cryptoDetails, setCryptoDetails] = useState({
    usdt: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    usdtNetwork: '',
  })
  const [activeMobileTab, setActiveMobileTab] = useState('profile')

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  })

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
      })
    }
  }, [user])

  const isLoading = userLoading

  const handleNotificationToggle = (id: string) => {
    setNotifications(notifications.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ))
    toast.success('Notification settings updated')
  }

  const handleProfileUpdate = async () => {
    try {
      await updateProfile.mutateAsync(profileForm)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const handleBankDetailsUpdate = () => {
    toast.success('Bank details updated successfully')
    setShowBankDialog(false)
  }

  const handleCryptoDetailsUpdate = () => {
    toast.success('Crypto wallet details updated successfully')
    setShowCryptoDialog(false)
  }

  const handleAddPaymentMethod = () => {
    toast.success('New payment method added successfully')
    setShowAddPaymentDialog(false)
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
            Settings
          </h1>
          <p className="text-base sm:text-lg text-gray-500 mt-1">Manage your account settings</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Badge variant="outline" className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border-2">
              <ShieldCheckIcon className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Account Security</span>
            </Badge>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Badge variant="outline" className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border-2">
              <BellIcon className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Notifications</span>
            </Badge>
          </motion.div>
        </div>
      </motion.div>

      {/* Desktop Layout */}
      <div className="hidden md:grid gap-6 md:grid-cols-2">
        {isLoading ? (
          <>
            {[1, 2].map((i) => (
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
                        <UserIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Profile Settings</CardTitle>
                        <p className="text-sm text-gray-500">Update your profile information</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          placeholder="Enter your first name" 
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                        />
                      </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          placeholder="Enter your last name" 
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Enter your email" 
                        value={profileForm.email}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input 
                        id="phoneNumber" 
                        type="tel" 
                        placeholder="Enter your phone number" 
                        value={profileForm.phoneNumber}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      />
                    </div>
                    <Button 
                      onClick={handleProfileUpdate}
                      disabled={updateProfile.isPending}
                      className="w-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] hover:from-[#ff4848] hover:via-[#ff6e4f] hover:to-[#ff8956] text-white"
                    >
                      {updateProfile.isPending ? 'Updating...' : 'Update Profile'}
                    </Button>
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
                        <BellIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Notification Settings</CardTitle>
                        <p className="text-sm text-gray-500">Manage your notification preferences</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-6">
                      {notifications.map((setting) => (
                        <motion.div
                          key={setting.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="space-y-1">
                            <p className="font-medium">{setting.title}</p>
                            <p className="text-sm text-gray-500">{setting.description}</p>
                          </div>
                          <Switch
                            checked={setting.enabled}
                            onCheckedChange={() => handleNotificationToggle(setting.id)}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
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
                        <ShieldCheckIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Security Settings</CardTitle>
                        <p className="text-sm text-gray-500">Manage your account security</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-1">
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <Switch
                        checked={twoFactorEnabled}
                        onCheckedChange={setTwoFactorEnabled}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" placeholder="Enter current password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" placeholder="Enter new password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" placeholder="Confirm new password" />
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
              <Card className="overflow-hidden border-2 hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl">
                <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white shadow-lg">
                        <CreditCardIcon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg sm:text-xl">Payment Methods</CardTitle>
                        <p className="text-sm text-gray-500">Manage your payment methods</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between rounded-lg border-2 p-4 hover:border-blue-500 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white shadow-lg">
                          <CreditCardIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-base sm:text-lg">{bankDetails.accountNumber}</p>
                          <p className="text-sm text-gray-500">{bankDetails.bankName}</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowBankDialog(true)}
                        className="bg-white/50 dark:bg-[#232526]/50 backdrop-blur-sm hover:bg-gray-100 transition-colors"
                      >
                        Edit
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between rounded-lg border-2 p-4 hover:border-purple-500 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-2 text-white shadow-lg">
                          <WalletIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-base sm:text-lg">Crypto Wallet</p>
                          <p className="text-sm text-gray-500">USDT</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowCryptoDialog(true)}
                        className="bg-white/50 dark:bg-[#232526]/50 backdrop-blur-sm hover:bg-gray-100 transition-colors"
                      >
                        Edit
                      </Button>
                    </motion.div>
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 dark:bg-[#232526] transition-all duration-300 shadow-lg hover:shadow-xl"
                      onClick={() => setShowAddPaymentDialog(true)}
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Add New Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <UserIcon className="h-5 w-5" />
              <span className="sr-only sm:not-sr-only sm:ml-2">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <BellIcon className="h-5 w-5" />
              <span className="sr-only sm:not-sr-only sm:ml-2">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <ShieldCheckIcon className="h-5 w-5" />
              <span className="sr-only sm:not-sr-only sm:ml-2">Security</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <CreditCardIcon className="h-5 w-5" />
              <span className="sr-only sm:not-sr-only sm:ml-2">Pay</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-0">
            <Card className="border-2">
              <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white shadow-lg">
                    <UserIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Profile Settings</CardTitle>
                    <p className="text-sm text-gray-500">Update your profile information</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter your first name" className="bg-white/50 backdrop-blur-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter your last name" className="bg-white/50 backdrop-blur-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="Enter your email" className="bg-white/50 backdrop-blur-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" type="tel" placeholder="Enter your phone number" className="bg-white/50 backdrop-blur-sm" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <Card className="border-2">
              <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white shadow-lg">
                    <BellIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Notification Settings</CardTitle>
                    <p className="text-sm text-gray-500">Manage your notification preferences</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {notifications.map((setting) => (
                    <motion.div
                      key={setting.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{setting.title}</p>
                        <p className="text-sm text-gray-500">{setting.description}</p>
                      </div>
                      <Switch
                        checked={setting.enabled}
                        onCheckedChange={() => handleNotificationToggle(setting.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-0">
            <Card className="border-2">
              <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white shadow-lg">
                    <ShieldCheckIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Security Settings</CardTitle>
                    <p className="text-sm text-gray-500">Manage your account security</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-1">
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={twoFactorEnabled}
                      onCheckedChange={setTwoFactorEnabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" placeholder="Enter current password" className="bg-white/50 backdrop-blur-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" placeholder="Enter new password" className="bg-white/50 backdrop-blur-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" placeholder="Confirm new password" className="bg-white/50 backdrop-blur-sm" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-0">
            <Card className="border-2">
              <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white shadow-lg">
                    <CreditCardIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Payment Methods</CardTitle>
                    <p className="text-sm text-gray-500">Manage your payment methods</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between rounded-lg border-2 p-4 hover:border-blue-500 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white shadow-lg">
                        <CreditCardIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-base sm:text-lg">{bankDetails.accountNumber}</p>
                        <p className="text-sm text-gray-500">{bankDetails.bankName}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowBankDialog(true)}
                      className="bg-white/50 dark:bg-[#232526]/50 backdrop-blur-sm hover:bg-gray-100 transition-colors"
                    >
                      Edit
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="flex items-center justify-between rounded-lg border-2 p-4 hover:border-purple-500 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-2 text-white shadow-lg">
                        <WalletIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-base sm:text-lg">Crypto Wallet</p>
                        <p className="text-sm text-gray-500">USDT</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowCryptoDialog(true)}
                      className="bg-white/50 dark:bg-[#232526]/50 backdrop-blur-sm hover:bg-gray-100 transition-colors"
                    >
                      Edit
                    </Button>
                  </motion.div>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 dark:bg-[#232526] transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={() => setShowAddPaymentDialog(true)}
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add New Payment Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex justify-end"
      >
        <Button 
          onClick={handleProfileUpdate}
          disabled={updateProfile.isPending}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 dark:bg-[#232526] transition-all duration-300 shadow-lg hover:shadow-xl px-8 py-6 text-lg"
        >
          {updateProfile.isPending ? 'Updating...' : 'Update Profile'}
        </Button>
      </motion.div>

      {/* Bank Details Dialog */}
      <Dialog open={showBankDialog} onOpenChange={setShowBankDialog}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] bg-white/95 dark:bg-[#232526]/95">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Edit Bank Details
            </DialogTitle>
            <DialogDescription className="text-base sm:text-lg">
              Update your bank account information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="bank-name">Bank Name</Label>
              <Input 
                id="bank-name" 
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                className="bg-white/50 dark:bg-[#232526]/50 backdrop-blur-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-number">Account Number</Label>
              <Input 
                id="account-number" 
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                className="bg-white/50 dark:bg-[#232526]/50 backdrop-blur-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-name">Account Name</Label>
              <Input 
                id="account-name" 
                value={bankDetails.accountName}
                onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                className="bg-white/50 dark:bg-[#232526]/50 backdrop-blur-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBankDialog(false)}
              className="bg-white/50 dark:bg-[#232526]/50 backdrop-blur-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBankDetailsUpdate}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 dark:bg-[#232526]"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Crypto Wallet Dialog */}
      <Dialog open={showCryptoDialog} onOpenChange={setShowCryptoDialog}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] bg-white/95 dark:bg-[#232526]/95">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Edit Crypto Wallet
            </DialogTitle>
            <DialogDescription className="text-base sm:text-lg">
              Update your cryptocurrency wallet addresses
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="usdt-address">USDT Address</Label>
              <Input 
                id="usdt-address" 
                value={cryptoDetails.usdt}
                onChange={(e) => setCryptoDetails({ ...cryptoDetails, usdt: e.target.value })}
                className="bg-white/50 dark:bg-[#232526]/50 backdrop-blur-sm"
              />
              <Label htmlFor="usdt-network" className="text-xs text-gray-500">Network (e.g., TRC20, ERC20, BEP20, etc.)</Label>
              <Input
                id="usdt-network"
                value={cryptoDetails.usdtNetwork}
                onChange={e => setCryptoDetails({ ...cryptoDetails, usdtNetwork: e.target.value })}
                placeholder="Enter USDT network (e.g., TRC20)"
                className="bg-white/50 dark:bg-[#232526]/50 backdrop-blur-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCryptoDialog(false)}
              className="bg-white/50 dark:bg-[#232526]/50 backdrop-blur-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCryptoDetailsUpdate}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 dark:bg-[#232526]"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Payment Method Dialog */}
      <Dialog open={showAddPaymentDialog} onOpenChange={setShowAddPaymentDialog}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] bg-white/95 dark:bg-[#232526]/95">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Add Payment Method
            </DialogTitle>
            <DialogDescription className="text-base sm:text-lg">
              Add a new payment method to your account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="payment-type">Payment Type</Label>
              <Select>
                <SelectTrigger className="bg-white/50 dark:bg-[#232526]/50 backdrop-blur-sm">
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank Account</SelectItem>
                  <SelectItem value="crypto">Crypto Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select>
                <SelectTrigger className="bg-white/50 dark:bg-[#232526]/50 backdrop-blur-sm">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                  <SelectItem value="USDT">Tether (USDT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddPaymentDialog(false)}
              className="bg-white/50 dark:bg-[#232526]/50 backdrop-blur-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddPaymentMethod}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 dark:bg-[#232526]"
            >
              Add Payment Method
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 