'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BellIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  FunnelIcon,
  XMarkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

type NotificationType = 'success' | 'warning' | 'info'

interface Notification {
  id: number
  type: NotificationType
  title: string
  message: string
  time: string
  read: boolean
}

// Sample notifications with more data
const notifications: Notification[] = [
  {
    id: 1,
    type: 'success',
    title: 'Investment Successful',
    message: 'Your investment of ₦500,000 has been processed successfully. You can view the details in your investment portfolio.',
    time: '5 minutes ago',
    read: false,
  },
  {
    id: 2,
    type: 'warning',
    title: 'Withdrawal Pending',
    message: 'Your withdrawal request of ₦200,000 is being processed. This usually takes 24-48 hours to complete.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    type: 'info',
    title: 'New Investment Plan',
    message: 'Check out our new high-yield investment plan with returns up to 25% APY. Limited time offer!',
    time: '2 hours ago',
    read: true,
  },
  {
    id: 4,
    type: 'success',
    title: 'ROI Payment Received',
    message: 'You have received ₦25,000 as ROI payment for your investment in the Growth Fund.',
    time: '3 hours ago',
    read: true,
  },
  {
    id: 5,
    type: 'warning',
    title: 'Account Verification Required',
    message: 'Please complete your account verification to unlock all features and higher withdrawal limits.',
    time: '1 day ago',
    read: false,
  },
]

export default function NotificationsPage() {
  const [notificationsList, setNotificationsList] = useState<Notification[]>(notifications)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all')
  const [readFilter, setReadFilter] = useState<'all' | 'read' | 'unread'>('all')
  const [showFilters, setShowFilters] = useState(false)

  const filteredNotifications = notificationsList.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || notification.type === typeFilter
    const matchesRead = readFilter === 'all' || 
      (readFilter === 'read' && notification.read) ||
      (readFilter === 'unread' && !notification.read)
    return matchesSearch && matchesType && matchesRead
  })

  const unreadCount = notificationsList.filter(n => !n.read).length

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
    setNotificationsList(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotificationsList(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="mt-1 text-sm text-gray-500">
                Stay updated with your account activities
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FunnelIcon className="h-4 w-4" />
                Filters
                {showFilters && (
                  <Badge variant="secondary" className="ml-1">
                    {filteredNotifications.length}
                  </Badge>
                )}
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="default"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={markAllAsRead}
                >
                  <CheckIcon className="h-4 w-4" />
                  Mark all as read
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Search</label>
                      <Input
                        placeholder="Search notifications..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Type</label>
                      <Select value={typeFilter} onValueChange={(value: NotificationType | 'all') => setTypeFilter(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="success">Success</SelectItem>
                          <SelectItem value="warning">Warning</SelectItem>
                          <SelectItem value="info">Info</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <Select value={readFilter} onValueChange={(value: 'all' | 'read' | 'unread') => setReadFilter(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="unread">Unread</SelectItem>
                          <SelectItem value="read">Read</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Notifications List */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <BellIcon className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">No notifications found</p>
                <p className="text-sm text-gray-400">Try adjusting your filters</p>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex items-start space-x-4 p-4 transition-colors",
                        !notification.read && "bg-blue-50/50"
                      )}
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {notification.time}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex-shrink-0"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <CheckIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 