'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLogin } from '@/lib/hooks/useAuth'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const TELEGRAM_LINK = 'https://t.me/KLTmines'

export default function LoginPage() {
  const router = useRouter()
  const loginMutation = useLogin()
  const [showPassword, setShowPassword] = useState(false)
  const [showCommunityPrompt, setShowCommunityPrompt] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (loginMutation.isPending) {
      return // Prevent multiple submissions
    }

    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }
    
    try {
      await loginMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
      })
      
      toast.success('Login successful!')
      // Trigger community modal on dashboard after login
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('klt-community-trigger', '1')
      }
      router.push('/dashboard')
    } catch (error: any) {
      
      // Handle different types of errors
      if (error?.response?.status === 401) {
        toast.error('Invalid email or password')
      } else if (error?.response?.status === 500) {
        toast.error('Server error. Please try again later.')
      } else if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network Error')) {
        toast.error('Network error. Please check your connection.')
      } else {
        const errorMessage = error?.response?.data?.message || error?.message || 'Login failed. Please try again.'
        toast.error(errorMessage)
      }
    }
  }

  return (
    <div className="min-h-screen w-full relative flex items-stretch overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-20 animate-gradient-move" style={{background: 'linear-gradient(120deg, #ff5858, #ff7e5f, #ff9966, #ff5858)', backgroundSize: '200% 200%'}} />
      <style jsx global>{`
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-move {
          animation: gradient-move 8s ease-in-out infinite;
        }
      `}</style>
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#ff5858] via-[#ff7e5f] to-[#ff9966]" />
      {/* Blurred Circles */}
      <div className="absolute z-10 top-20 left-32 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
      <div className="absolute z-10 top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
      <div className="absolute z-10 bottom-24 left-20 w-24 h-24 bg-white/15 rounded-full blur-2xl" />
      <div className="absolute z-10 bottom-10 right-1/3 w-20 h-20 bg-white/10 rounded-full blur-xl" />
      {/* Main Content */}
      <div className="relative z-20 flex flex-1 min-h-screen">
        {/* Left Branding */}
        <div className="hidden lg:flex flex-col justify-center items-start flex-1 pl-24 font-sans">
          <div className="max-w-md">
            <div className="text-4xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
              Invest in Your Future, <span className="text-white">Today.</span>
            </div>
            <div className="text-lg text-white mb-6 font-medium opacity-90">
              KLTMINES empowers you to grow, protect, and enjoy your wealth with confidence.
            </div>
            <ul className="mb-8 space-y-2">
              <li className="flex items-center text-white text-base opacity-80"><span className="mr-2 text-white">•</span> Zero hidden fees</li>
              <li className="flex items-center text-white text-base opacity-80"><span className="mr-2 text-white">•</span> Instant withdrawals</li>
              <li className="flex items-center text-white text-base opacity-80"><span className="mr-2 text-white">•</span> Trusted by professionals</li>
            </ul>
          </div>
        </div>
        {/* Right Card */}
        <div className="flex flex-col justify-center items-center flex-1 min-h-screen">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Login</h2>
            <p className="text-sm text-gray-500 mb-6">Continue to your account to access your assets</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 h-11 bg-white border border-gray-200 focus:border-orange-400 focus:ring-orange-200"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="mt-1 h-11 bg-white border border-gray-200 focus:border-orange-400 focus:ring-orange-200 pr-10"
                  required
                />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <Link href="/auth/forgot-password" className="text-sm text-orange-600 hover:underline transition-colors">Forgot password?</Link>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-11 mt-2 bg-gradient-to-r from-[#ff5858] to-[#ff9966] text-white font-semibold shadow-md hover:from-[#ff7e5f] hover:to-[#ff9966] transition-all"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? 'Signing in...' : 'Login'}
              </Button>
              <div className="text-center mt-4">
                <div className="text-sm text-gray-600">Don&apos;t have an account? </div>
                <Link href="/auth/register" className="text-sm text-orange-600 font-semibold hover:underline transition-colors">Sign up</Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Community Prompt */}
      <Dialog open={showCommunityPrompt} onOpenChange={(open) => {
        setShowCommunityPrompt(open)
        if (!open) router.push('/dashboard')
      }}>
        <DialogContent className="sm:max-w-[480px] w-[95vw] rounded-2xl overflow-hidden p-0 bg-gray-800 border-gray-700">
          {/* Close Button */}
          <button
            onClick={() => {
              setShowCommunityPrompt(false)
              router.push('/dashboard')
            }}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="px-6 pt-6 pb-6 text-center">
            {/* Community Profile Image */}
            <div className="mx-auto mb-4 w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7H16c-.8 0-1.54.37-2.01.99L12 11l-1.99-3.01A2.5 2.5 0 0 0 8 7H5.46c-.8 0-1.54.37-2.01.99L1 14.5V22h2v-6h2.5l2.54-7.63A1.5 1.5 0 0 1 9.46 7H12c.8 0 1.54.37 2.01.99L16 11l1.99-3.01A2.5 2.5 0 0 1 20 7h2.54c.8 0 1.54.37 2.01.99L27 14.5V22h-7z"/>
                </svg>
              </div>
            </div>
            
            {/* Title with Icon */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-white">Traders Community</h2>
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
              </svg>
            </div>
            
            {/* Creation Date */}
            <p className="text-sm text-gray-400 mb-4">Created on May 28, 2025</p>
            
            {/* Member Avatars */}
            <div className="flex justify-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">A</div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">B</div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-semibold">C</div>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">+</div>
            </div>
            
            {/* Official Community Name */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
              </svg>
              <p className="text-white font-medium">KLTMines Official Community</p>
            </div>
            
            {/* Description */}
            <p className="text-gray-300 text-sm mb-2">
              Welcome to our professional trading community! Here, you can connect with fellow traders, share insights, and enhance your trading skills.
            </p>
            
            {/* Approval Note */}
            <p className="text-gray-400 text-xs mb-6">An admin must approve your request.</p>
            
            {/* Join Community Button */}
            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-12 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold text-center leading-[3rem] hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
            >
              Join Community
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 