'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  HomeIcon,
  WalletIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowDownTrayIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  XMarkIcon,
  Bars3Icon,
  ChevronDownIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  UserIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useTheme } from "next-themes"
import { useLogout, useUser } from '@/lib/hooks/useAuth'
import { useNotifications, useUnreadNotificationsCount, useMarkNotificationAsRead, useMarkAllNotificationsAsRead, formatNotificationTime } from '@/lib/hooks/useNotifications'

interface UserProfile {
  name: string
  email: string
  role: string
  avatar: string
  lastActive: string
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'My Wallet', href: '/dashboard/wallet', icon: WalletIcon },
  { name: 'Investments', href: '/dashboard/investments', icon: ChartBarIcon },
  { name: 'ROI History', href: '/dashboard/roi', icon: ArrowTrendingUpIcon },
  { name: 'Withdrawals', href: '/dashboard/withdrawals', icon: ArrowDownTrayIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { setTheme, resolvedTheme } = useTheme()
  const logout = useLogout();
  const router = useRouter();
  const { data: user } = useUser();

  // Use real notifications from the API
  const { data: notificationsData } = useNotifications({ limit: 10 });
  const { data: unreadCountData } = useUnreadNotificationsCount();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const notifications = notificationsData?.notifications || [];
  const unreadCount = unreadCountData?.count || 0;

  // Create user profile from actual user data
  const userProfile = {
    name: user ? `${user.firstName} ${user.lastName}` : 'Loading...',
    email: user?.email || 'Loading...',
    role: 'Investor', // Default role since it's not in the User interface
    avatar: '', // No avatar field in User interface
    lastActive: 'Active now'
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'warning':
        return <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />
      case 'error':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />
    }
  }

  const markAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  }

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate();
  }

  const handleLogout = async () => {
    await logout.mutateAsync();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-background dark:bg-[#18181b]">
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed inset-y-0 left-0 w-72 bg-gray-900 shadow-xl"
            >
              <div className="flex h-16 items-center justify-between px-4 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966]" />
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent">KLTMINES</span>
                </div>
                <button
                  aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                  className="ml-2 rounded-full p-2 hover:bg-gray-800 transition-colors"
                >
                  {resolvedTheme === 'dark' ? (
                    <SunIcon className="h-6 w-6 text-yellow-400" />
                  ) : (
                    <MoonIcon className="h-6 w-6 text-gray-700" />
                  )}
                </button>
                <button
                  type="button"
                  className="rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.name === 'Settings' ? '/dashboard/settings' : item.href}
                      className={cn(
                        "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] text-white shadow-lg"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                          isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                        )}
                      />
                      {item.name}
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                        />
                      )}
                    </Link>
                  )
                })}
                {user?.role === 'admin' && (
                  <Link
                    key="Admin"
                    href="/dashboard/admin"
                    className={cn(
                      "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                      pathname === '/dashboard/admin'
                        ? "bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] text-white shadow-lg"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    )}
                  >
                    <Cog6ToothIcon className={cn("mr-3 h-5 w-5 flex-shrink-0 transition-colors", pathname === '/dashboard/admin' ? "text-white" : "text-gray-400 group-hover:text-white")} />
                    Admin
                    {pathname === '/dashboard/admin' && (
                      <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-8 bg-white rounded-r-full" />
                    )}
                  </Link>
                )}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-gray-900">
          <div className="flex h-16 items-center px-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966]" />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent">KLTMINES</span>
            </div>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                      isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                    )}
                  />
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                    />
                  )}
                </Link>
              )
            })}
            {user?.role === 'admin' && (
              <Link
                key="Admin"
                href="/dashboard/admin"
                className={cn(
                  "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  pathname === '/dashboard/admin'
                    ? "bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] text-white shadow-lg"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                <Cog6ToothIcon className={cn("mr-3 h-5 w-5 flex-shrink-0 transition-colors", pathname === '/dashboard/admin' ? "text-white" : "text-gray-400 group-hover:text-white")} />
                Admin
                {pathname === '/dashboard/admin' && (
                  <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-8 bg-white rounded-r-full" />
                )}
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={cn(
            "sticky top-0 z-40 flex h-16 flex-shrink-0 transition-all duration-200",
            isScrolled
              ? "bg-background/80 dark:bg-[#18181b]/80 backdrop-blur-lg shadow-lg"
              : "bg-background dark:bg-[#18181b]"
          )}
        >
          <button
            type="button"
            className="px-4 text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1" />
            <div className="ml-4 flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center justify-center mx-2">
                <button
                  aria-label="Toggle dark mode"
                  aria-pressed={resolvedTheme === 'dark'}
                  onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                  className={cn(
                    "relative flex items-center justify-center w-16 h-8 p-1 rounded-full border-2 border-gray-200 bg-gradient-to-r from-[#ff5858]/30 via-[#ff7e5f]/30 to-[#ff9966]/30 shadow-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7e5f] focus-visible:ring-offset-2",
                    resolvedTheme === 'dark' ? 'bg-gray-900/80 border-[#ff7e5f]/60' : 'bg-white/80 border-gray-200'
                  )}
                  style={{ minWidth: 64, minHeight: 32 }}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 left-0.5 flex items-center justify-center w-6 h-6 rounded-full shadow-md transition-all duration-300 transition-transform",
                      resolvedTheme === 'dark'
                        ? 'translate-x-8 bg-gradient-to-tr from-yellow-400 via-yellow-300 to-orange-400 drop-shadow-[0_0_8px_rgba(255,200,0,0.5)]'
                        : 'translate-x-0 bg-gradient-to-tr from-gray-200 via-white to-gray-300 drop-shadow-[0_0_8px_rgba(80,80,80,0.15)]'
                    )}
                  >
                    {resolvedTheme === 'dark' ? (
                      <SunIcon className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <MoonIcon className="h-5 w-5 text-[#ff7e5f]" />
                    )}
                  </span>
                  <span
                    className={cn(
                      "absolute left-0 top-0 w-full h-full rounded-full pointer-events-none",
                      resolvedTheme === 'dark'
                        ? 'bg-gradient-to-r from-[#232526] via-[#414345] to-[#232526] opacity-80'
                        : 'bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10 opacity-80'
                    )}
                  />
                </button>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105"
                  >
                    <BellIcon className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1"
                      >
                        <Badge className="h-5 w-5 flex items-center justify-center p-0 bg-blue-500 hover:bg-blue-600">
                          {unreadCount}
                        </Badge>
                      </motion.div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-[calc(100vw-2rem)] sm:w-96 p-0 overflow-hidden max-h-[calc(100vh-4rem)]"
                  sideOffset={8}
                  alignOffset={-8}
                >
                  <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-gray-50/50 backdrop-blur-sm">
                    <DropdownMenuLabel className="text-base font-semibold">Notifications</DropdownMenuLabel>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        Mark all as read
                      </Button>
                    )}
                  </div>
                  <ScrollArea className="h-[min(400px,calc(100vh-12rem))]">
                    <div className="p-2">
                      {notifications.length === 0 ? (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col items-center justify-center h-32 text-gray-500"
                        >
                          <BellIcon className="h-8 w-8 mb-2" />
                          <p>No notifications</p>
                        </motion.div>
                      ) : (
                        <div className="space-y-1">
                          {notifications.map((notification) => (
                            <motion.div
                              key={notification._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className={cn(
                                "flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 cursor-pointer",
                                !notification.read && "bg-blue-50 hover:bg-blue-100",
                                notification.read && "hover:bg-gray-50"
                              )}
                              onClick={() => markAsRead(notification._id)}
                            >
                              <div className="flex-shrink-0 mt-1">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                  {notification.title}
                                </p>
                                <p className="text-sm text-gray-500 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {formatNotificationTime(notification.createdAt)}
                                </p>
                              </div>
                              {!notification.read && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500"
                                />
                              )}
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  {notifications.length > 0 && (
                    <div className="sticky bottom-0 p-2 border-t bg-gray-50/50 backdrop-blur-sm">
                      <Link href="/dashboard/notifications">
                        <Button
                          variant="ghost"
                          className="w-full text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          View all notifications
                        </Button>
                      </Link>
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative flex items-center space-x-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-gray-100">
                      <AvatarImage src={userProfile.avatar} />
                      <AvatarFallback>{userProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:flex sm:flex-col sm:items-start">
                      <span className="text-sm font-medium">{userProfile.name}</span>
                      <span className="text-xs text-gray-500">{userProfile.role}</span>
                    </div>
                    <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-0">
                  <div className="p-4 border-b bg-gray-50/50">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={userProfile.avatar} />
                        <AvatarFallback>{userProfile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{userProfile.name}</p>
                        <p className="text-xs text-gray-500 truncate">{userProfile.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Link href="/dashboard/settings" className="flex items-center space-x-2 w-full">
                        <UserIcon className="h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Link href="/dashboard/settings" className="flex items-center space-x-2 w-full">
                        <Cog6ToothIcon className="h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      <Link href="/dashboard/wallet" className="flex items-center space-x-2 w-full">
                        <WalletIcon className="h-4 w-4" />
                        <span>My Wallet</span>
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <DropdownMenuItem
                      className="flex items-center space-x-2 text-red-600 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/30"
                      onClick={handleLogout}
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.div>

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 