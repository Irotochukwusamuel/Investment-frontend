'use client'

import { useState, useEffect } from 'react'
import {
  BellIcon,
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  Bars3Icon,
  SunIcon,
  MoonIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  UserIcon,
  SparklesIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Toaster } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from 'next-themes';

// Notification types
type NotificationType = 'success' | 'warning' | 'info'

interface Notification {
  id: number
  type: NotificationType
  title: string
  message: string
  time: string
  read: boolean
}

// Sample notifications
const initialNotifications: Notification[] = [
  {
    id: 1,
    type: 'success',
    title: 'New User Registration',
    message: 'John Doe has successfully registered on the platform.',
    time: '2 minutes ago',
    read: false,
  },
  {
    id: 2,
    type: 'warning',
    title: 'Withdrawal Request',
    message: 'A withdrawal request of ₦500,000 is pending approval.',
    time: '15 minutes ago',
    read: false,
  },
  {
    id: 3,
    type: 'info',
    title: 'System Update',
    message: 'Platform maintenance scheduled for tomorrow at 2 AM.',
    time: '1 hour ago',
    read: true,
  },
]

const sidebarNavItems = [
  { 
    href: '/admin', 
    label: 'Dashboard', 
    icon: HomeIcon,
    description: 'Platform overview',
    badge: null
  },
  { 
    href: '/admin/users', 
    label: 'Users', 
    icon: UsersIcon,
    description: 'User management',
    badge: '12.4K'
  },
  { 
    href: '/admin/investments', 
    label: 'Investments', 
    icon: ChartBarIcon,
    description: 'Investment tracking',
    badge: '3.8K'
  },
  { 
    href: '/admin/transactions', 
    label: 'Transactions', 
    icon: CurrencyDollarIcon,
    description: 'Financial operations',
    badge: '85'
  },
  { 
    href: '/admin/settings', 
    label: 'Settings', 
    icon: CogIcon,
    description: 'Platform configuration',
    badge: null
  },
];

function AdminSidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean; setMobileOpen: (open: boolean) => void }) {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <>
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xl" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: -400 }}
              animate={{ x: 0 }}
              exit={{ x: -400 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-gradient-to-b from-gray-900 via-gray-900 to-black shadow-2xl border-r border-gray-800/50"
            >
              <div className="flex h-20 items-center justify-between px-6 border-b border-gray-800/50 bg-gradient-to-r from-gray-900/50 to-black/50 backdrop-blur-xl">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] shadow-lg" />
                    <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-gray-900 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xl font-bold bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent">KLTMINES</span>
                    <p className="text-xs text-gray-400">Admin Panel</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                    className="rounded-lg p-2 hover:bg-gray-800/50 transition-all duration-200"
                  >
                    {resolvedTheme === 'dark' ? (
                      <SunIcon className="h-5 w-5 text-yellow-400" />
                    ) : (
                      <MoonIcon className="h-5 w-5 text-gray-300" />
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    className="rounded-lg p-2 text-gray-400 hover:bg-gray-800/50 hover:text-white transition-all duration-200"
                    onClick={() => setMobileOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </motion.button>
                </div>
              </div>
              <nav className="flex-1 space-y-2 px-4 py-6">
                {sidebarNavItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          'group relative flex items-center gap-4 rounded-xl px-4 py-4 text-sm font-medium transition-all duration-300',
                          isActive
                            ? 'bg-gradient-to-r from-[#ff5858] to-[#ff7e5f] text-white shadow-xl shadow-[#ff5858]/25'
                            : 'text-gray-300 hover:bg-gray-800/50 hover:text-white hover:shadow-lg'
                        )}
                        onClick={() => setMobileOpen(false)}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#ff5858] to-[#ff7e5f] -z-10"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                        <div className={cn(
                          'flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300',
                          isActive ? 'bg-white/20' : 'bg-gray-800/50 group-hover:bg-gray-700/50'
                        )}>
                          <item.icon className={cn(
                            'h-5 w-5 transition-all duration-300',
                            isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                          )} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">{item.label}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="text-xs bg-white/10 text-white border-0">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
              <div className="border-t border-gray-800/50 p-6 bg-gradient-to-r from-gray-900/50 to-black/50">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Link
                    href="/"
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 text-white transition-all hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    <span className="font-semibold">Logout</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-80 flex-col border-r border-gray-200/50 bg-gradient-to-b from-white/90 via-white/80 to-white/70 backdrop-blur-xl dark:border-gray-800/50 dark:from-gray-900/90 dark:via-gray-900/80 dark:to-black/70 lg:flex shadow-2xl">
        <div className="flex h-20 shrink-0 items-center border-b border-gray-200/50 dark:border-gray-800/50 px-8 bg-gradient-to-r from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-black/50 backdrop-blur-xl">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] shadow-lg" />
              <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white dark:border-gray-900 animate-pulse" />
              <div className="absolute -bottom-1 -left-1 h-3 w-3 rounded-full bg-blue-500 border border-white dark:border-gray-900" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent">
                KLTMINES
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-3 overflow-y-auto py-8 px-6">
          {sidebarNavItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'group relative flex items-center gap-4 rounded-xl px-6 py-5 text-sm font-medium transition-all duration-300',
                    isActive
                      ? 'bg-gradient-to-r from-[#ff5858] to-[#ff7e5f] text-white shadow-xl shadow-[#ff5858]/25'
                      : 'text-gray-600 hover:bg-gray-100/80 dark:text-gray-400 dark:hover:bg-gray-800/50'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#ff5858] to-[#ff7e5f] -z-10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className={cn(
                    'flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300',
                    isActive ? 'bg-white/20' : 'bg-gray-100/80 dark:bg-gray-800/50 group-hover:bg-gray-200/80 dark:group-hover:bg-gray-700/50'
                  )}>
                    <item.icon className={cn(
                      'h-6 w-6 transition-all duration-300',
                      isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-white'
                    )} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs bg-white/20 text-white border-0 dark:bg-gray-800/50">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-gray-200/50 dark:border-gray-800/50 p-8 bg-gradient-to-r from-gray-50/50 to-white/50 dark:from-gray-900/50 dark:to-black/50">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              href="/"
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-8 py-5 text-white transition-all hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl font-semibold"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6" />
              <span>Logout</span>
            </Link>
          </motion.div>
        </div>
      </aside>
    </>
  );
}

function AdminHeader({ mobileOpen, setMobileOpen }: { mobileOpen: boolean; setMobileOpen: (open: boolean) => void }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const { setTheme, resolvedTheme } = useTheme();
  
  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'warning':
        return <ExclamationCircleIcon className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />
    }
  }

  const markAsRead = (id: number) => {
    setNotifications(prevNotifications => 
      prevNotifications.map((notification: Notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map((notification: Notification) => ({ ...notification, read: true }))
    )
  }

  return (
    <header className="fixed top-0 right-0 left-0 sm:left-80 z-30 flex h-20 items-center justify-between border-b border-gray-200/50 bg-white/80 px-8 backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-900/80 shadow-lg">
      <div className="flex items-center gap-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          className="rounded-xl p-3 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-white lg:hidden transition-all duration-200 shadow-sm"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Bars3Icon className="h-6 w-6" />
        </motion.button>
        <div className="hidden sm:block">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h2>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
              <SparklesIcon className="h-3 w-3 mr-1" />
              Live
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-end gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="rounded-xl p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 shadow-sm"
        >
          {resolvedTheme === 'dark' ? (
            <SunIcon className="h-6 w-6 text-yellow-400" />
          ) : (
            <MoonIcon className="h-6 w-6 text-gray-600" />
          )}
        </motion.button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="relative rounded-xl p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 shadow-sm"
            >
              <BellIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              {unreadCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 text-xs text-white font-bold shadow-lg"
                >
                  {unreadCount}
                </motion.span>
              )}
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96 border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
            <DropdownMenuLabel className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <span className="font-bold text-lg">Notifications</span>
              {unreadCount > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-all duration-200"
                >
                  Mark all read
                </motion.button>
              )}
            </DropdownMenuLabel>
            <ScrollArea className="h-96">
              <div className="space-y-2 p-4">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`flex items-start gap-4 rounded-xl p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${
                      notification.read ? 'bg-gray-50/50 dark:bg-gray-800/50' : 'bg-blue-50/50 dark:bg-blue-900/20'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex-shrink-0 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-3 w-3 rounded-full bg-blue-500 flex-shrink-0 mt-1" 
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="flex items-center gap-3 rounded-xl p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 shadow-sm"
            >
              <Avatar className="h-10 w-10 ring-2 ring-gray-200 dark:ring-gray-700">
                <AvatarImage src="/avatars/admin.png" alt="Admin" />
                <AvatarFallback className="bg-gradient-to-r from-[#ff5858] to-[#ff7e5f] text-white font-bold text-lg">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Admin User</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Super Admin</p>
              </div>
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl">
            <DropdownMenuLabel className="px-6 py-4 font-bold text-lg border-b border-gray-100 dark:border-gray-800">
              Admin Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
              <UserIcon className="h-5 w-5 mr-4 text-gray-500" />
              <div>
                <p className="font-medium">Profile</p>
                <p className="text-sm text-gray-500">View your profile</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="px-6 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
              <CogIcon className="h-5 w-5 mr-4 text-gray-500" />
              <div>
                <p className="font-medium">Settings</p>
                <p className="text-sm text-gray-500">Manage preferences</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="px-6 py-4 cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200">
              <ArrowRightOnRectangleIcon className="h-5 w-5 mr-4" />
              <div>
                <p className="font-medium">Logout</p>
                <p className="text-sm text-red-500">Sign out of account</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-black">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="sm:pl-80">
        <AdminHeader mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <main className="pt-24 p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-[2000px] mx-auto"
          >
            {children}
          </motion.div>
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
              },
            }}
          />
        </main>
      </div>
    </div>
  );
} 