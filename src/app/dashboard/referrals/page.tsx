'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { 
  UserGroupIcon, 
  ClipboardDocumentIcon,
  ShareIcon,
  CheckIcon,
  XMarkIcon,
  UserIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  GiftIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useUser } from '@/lib/hooks/useAuth'
import { useReferrals, useReferralStats, ReferredUser } from '@/lib/hooks/useReferrals'

export default function ReferralsPage() {
  const { data: user, isLoading: userLoading } = useUser()
  const { data: referrals, isLoading: referralsLoading, error: referralsError } = useReferrals()
  const { data: stats, isLoading: statsLoading } = useReferralStats()
  const [copied, setCopied] = useState(false)

  const handleCopyReferralCode = async () => {
    if (!user?.referralCode) return
    
    try {
      await navigator.clipboard.writeText(user.referralCode)
      setCopied(true)
      toast.success('Referral code copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy referral code')
    }
  }

  const handleShareReferralCode = async () => {
    if (!user?.referralCode) return
    
    const shareText = `Join me on this amazing investment platform! Use my referral code: ${user.referralCode}`
    const shareUrl = `${window.location.origin}/auth/register?ref=${user.referralCode}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my investment platform',
          text: shareText,
          url: shareUrl,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback to copying
      try {
        await navigator.clipboard.writeText(`${shareText}\n\nSign up here: ${shareUrl}`)
        toast.success('Referral link copied to clipboard!')
      } catch (error) {
        toast.error('Failed to copy referral link')
      }
    }
  }

  const getStatusBadge = (status: string, isActive: boolean) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  const isLoading = userLoading || referralsLoading || statsLoading

  // Handle error state
  if (referralsError) {
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
              My Referrals
            </h1>
            <p className="text-base sm:text-lg text-gray-500">Manage your referral network and earnings</p>
          </div>
        </motion.div>
        
        <Card className="overflow-hidden border-2 border-red-200">
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center text-center">
              <XMarkIcon className="h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Referrals</h3>
              <p className="text-gray-500 mb-4">
                We couldn't load your referral data. Please try refreshing the page or contact support if the problem persists.
              </p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] hover:from-[#ff4848] hover:via-[#ff6e4f] hover:to-[#ff8956] text-white"
              >
                Refresh Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
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
            My Referrals
          </h1>
          <p className="text-base sm:text-lg text-gray-500">Manage your referral network and earnings</p>
        </div>
      </motion.div>

      {/* Referral Code Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="overflow-hidden border-2 hover:border-[#ff5858] transition-colors">
          <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                <ShareIcon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">Your Referral Code</CardTitle>
                <p className="text-sm text-gray-500">Share this code to earn bonuses</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Referral Code</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    value={user?.referralCode || 'Loading...'}
                    readOnly
                    className="font-mono text-lg font-bold bg-gray-50"
                  />
                  <Button
                    onClick={handleCopyReferralCode}
                    variant="outline"
                    size="icon"
                    className="bg-white/50 backdrop-blur-sm"
                  >
                    {copied ? (
                      <CheckIcon className="h-4 w-4 text-green-600" />
                    ) : (
                      <ClipboardDocumentIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Quick Actions</Label>
                <div className="flex gap-2">
                  <Button
                    onClick={handleShareReferralCode}
                    className="flex-1 bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] hover:from-[#ff4848] hover:via-[#ff6e4f] hover:to-[#ff8956] text-white"
                  >
                    <ShareIcon className="h-4 w-4 mr-2" />
                    Share Referral Link
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">How Referrals Work</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Share your referral code with friends</li>
                  <li>• They get a welcome bonus on their first investment</li>
                  <li>• You earn referral bonuses when they invest</li>
                  <li>• Bonuses can be withdrawn after 15 days of active investment</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Referral Statistics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="overflow-hidden border-2 hover:border-blue-500 transition-colors">
            <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                  <UsersIcon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">Total Referrals</CardTitle>
                  <p className="text-sm text-gray-500">All time</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="rounded-lg bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10 p-4">
                  <p className="text-2xl font-bold">{stats?.totalReferrals || 0}</p>
                  <p className="text-sm text-gray-500">Total referred</p>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Active</span>
                  <span className="font-medium">{stats?.activeReferrals || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="overflow-hidden border-2 hover:border-green-500 transition-colors">
            <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                  <CurrencyDollarIcon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">Total Earnings</CardTitle>
                  <p className="text-sm text-gray-500">From referrals</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="rounded-lg bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10 p-4">
                  <p className="text-2xl font-bold">₦{(stats?.totalEarnings || 0).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Total earned</p>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Pending</span>
                  <span className="font-medium">₦{(stats?.pendingBonus || 0).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="overflow-hidden border-2 hover:border-purple-500 transition-colors">
            <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                  <ChartBarIcon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">Success Rate</CardTitle>
                  <p className="text-sm text-gray-500">Active referrals</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="rounded-lg bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10 p-4">
                  <p className="text-2xl font-bold">
                    {stats?.totalReferrals > 0 ? Math.round((stats.activeReferrals / stats.totalReferrals) * 100) : 0}%
                  </p>
                  <p className="text-sm text-gray-500">Active rate</p>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Active/Total</span>
                  <span className="font-medium">{stats?.activeReferrals || 0}/{stats?.totalReferrals || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="overflow-hidden border-2 hover:border-orange-500 transition-colors">
            <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                  <GiftIcon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">Total Bonus</CardTitle>
                  <p className="text-sm text-gray-500">Earned bonuses</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="rounded-lg bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10 p-4">
                  <p className="text-2xl font-bold">₦{(stats?.totalBonus || 0).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Total bonus</p>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Pending</span>
                  <span className="font-medium">₦{(stats?.pendingBonus || 0).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="overflow-hidden border-2 hover:border-indigo-500 transition-colors">
            <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                  <ClockIcon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">Avg. Earnings</CardTitle>
                  <p className="text-sm text-gray-500">Per referral</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="rounded-lg bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10 p-4">
                  <p className="text-2xl font-bold">
                    ₦{stats?.totalReferrals > 0 ? Math.round((stats.totalEarnings / stats.totalReferrals)).toLocaleString() : 0}
                  </p>
                  <p className="text-sm text-gray-500">Average</p>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Per referral</span>
                  <span className="font-medium">~₦{(stats?.totalReferrals > 0 ? Math.round((stats.totalEarnings / stats.totalReferrals)) : 0).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Enhanced Referred Users List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card className="overflow-hidden border-2 hover:border-blue-500 transition-colors">
          <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                <UserGroupIcon className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">Referred Users</CardTitle>
                <p className="text-sm text-gray-500">People you've referred with detailed stats</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {referrals && referrals.length > 0 ? (
              <div className="space-y-4">
                {referrals.map((referral: ReferredUser, index: number) => (
                  <motion.div
                    key={referral.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2">
                        <UserIcon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{referral.firstName} {referral.lastName}</p>
                        <p className="text-sm text-gray-500">{referral.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <CalendarIcon className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            Joined {new Date(referral.createdAt).toLocaleDateString()}
                          </span>
                          {referral.firstInvestmentAt && (
                            <>
                              <CheckCircleIcon className="h-3 w-3 text-green-400" />
                              <span className="text-xs text-green-600">
                                First investment: {new Date(referral.firstInvestmentAt).toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">₦{referral.totalEarnings.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Total earnings</p>
                        <p className="text-xs text-blue-600">₦{referral.referralBonus.toLocaleString()} bonus</p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        {getStatusBadge(referral.status, referral.isActive)}
                        {referral.bonusPaid && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <CheckIcon className="h-3 w-3 mr-1" />
                            Paid
                          </Badge>
                        )}
                        <p className="text-xs text-gray-500">{referral.totalInvestments} investments</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <UserGroupIcon className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Referrals Yet</h3>
                <p className="text-gray-500 mb-4">You haven't referred anyone yet. Share your referral code to start earning bonuses!</p>
                <Button
                  onClick={handleShareReferralCode}
                  className="bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] hover:from-[#ff4848] hover:via-[#ff6e4f] hover:to-[#ff8956] text-white"
                >
                  <ShareIcon className="h-4 w-4 mr-2" />
                  Share Referral Code
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 