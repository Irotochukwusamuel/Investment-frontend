'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  ClipboardDocumentIcon,
  ShareIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { useUser } from '@/lib/hooks/useAuth'

export default function ProfilePage() {
  const { data: user, isLoading } = useUser()
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

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-96 bg-gray-200 rounded"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
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
            Profile
          </h1>
          <p className="text-base sm:text-lg text-gray-500">Manage your account and referral information</p>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="overflow-hidden border-2 hover:border-[#ff5858] transition-colors">
            <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                  <UserIcon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                  <p className="text-sm text-gray-500">Your account details</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                  <p className="text-lg font-semibold">{user?.firstName} {user?.lastName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <EnvelopeIcon className="h-4 w-4" />
                    Email Address
                  </Label>
                  <p className="text-lg font-semibold">{user?.email}</p>
                  {user?.emailVerified && (
                    <Badge variant="outline" className="mt-1 bg-green-100 text-green-800">
                      Verified
                    </Badge>
                  )}
                </div>
                {user?.phoneNumber && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                      <PhoneIcon className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <p className="text-lg font-semibold">{user.phoneNumber}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-gray-500">Member Since</Label>
                  <p className="text-lg font-semibold">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Referral Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="overflow-hidden border-2 hover:border-[#ff5858] transition-colors">
            <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                  <ShareIcon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">Referral Code</CardTitle>
                  <p className="text-sm text-gray-500">Share and earn bonuses</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Your Referral Code</Label>
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
                      Share
                    </Button>
                    <Button
                      onClick={() => window.location.href = '/dashboard/referrals'}
                      variant="outline"
                      className="flex-1 bg-white/50 backdrop-blur-sm border-2 hover:bg-gray-100 transition-colors"
                    >
                      <UserIcon className="h-4 w-4 mr-2" />
                      View Referrals
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

        {/* Account Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="overflow-hidden border-2 hover:border-[#ff5858] transition-colors">
            <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                  <UserIcon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">Account Statistics</CardTitle>
                  <p className="text-sm text-gray-500">Your platform activity</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-[#ff5858]">{user?.totalInvestments || 0}</p>
                    <p className="text-sm text-gray-500">Total Investments</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-[#ff5858]">{user?.totalEarnings || 0}</p>
                    <p className="text-sm text-gray-500">Total Earnings</p>
                  </div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{user?.referralCount || 0}</p>
                  <p className="text-sm text-green-600">Successful Referrals</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="overflow-hidden border-2 hover:border-[#ff5858] transition-colors">
            <CardHeader className="border-b bg-gradient-to-r from-[#ff5858]/10 via-[#ff7e5f]/10 to-[#ff9966]/10">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                  <UserIcon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">Account Status</CardTitle>
                  <p className="text-sm text-gray-500">Security and verification</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Email Verification</span>
                  {user?.emailVerified ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckIcon className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      <XMarkIcon className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Account Status</span>
                  <Badge className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Two-Factor Auth</span>
                  <Badge variant="outline" className="bg-gray-100 text-gray-600">
                    Not Enabled
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 