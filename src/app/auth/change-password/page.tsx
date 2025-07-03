'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResetPassword } from '@/lib/hooks/useAuth'
import { toast } from 'sonner'

function ChangePasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const resetPasswordMutation = useResetPassword()
  
  const email = searchParams.get('email')
  const resetToken = searchParams.get('resetToken')

  useEffect(() => {
    if (!email || !resetToken) {
      toast.error('Invalid or missing email/reset token')
      router.push('/auth/forgot-password')
    }
  }, [email, resetToken, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    if (!email || !resetToken) {
      toast.error('Invalid email or reset token')
      return
    }
    
    try {
      await resetPasswordMutation.mutateAsync({
        email,
        resetToken,
        newPassword: password,
      })
      
      toast.success('Password changed successfully!')
    setSubmitted(true)
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password. Please try again.')
    }
  }

  return (
    <div className="min-h-screen w-full relative flex items-stretch">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#ff5858] via-[#ff7e5f] to-[#ff9966]" />
      {/* Blurred Circles */}
      <div className="absolute z-10 top-20 left-32 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
      <div className="absolute z-10 top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
      <div className="absolute z-10 bottom-24 left-20 w-24 h-24 bg-white/15 rounded-full blur-2xl" />
      <div className="absolute z-10 bottom-10 right-1/3 w-20 h-20 bg-white/10 rounded-full blur-xl" />
      {/* Main Content */}
      <div className="relative z-20 flex flex-1 min-h-screen justify-center items-center">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Change Password</h2>
          <p className="text-sm text-gray-500 mb-6">Enter your new password below.</p>
          {submitted ? (
            <div className="text-center">
              <div className="text-green-600 font-medium py-4 mb-4">
                Your password has been changed successfully!
              </div>
              <p className="text-sm text-gray-500 mb-4">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="mt-1 h-11 bg-white border border-gray-200 focus:border-orange-400 focus:ring-orange-200"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="mt-1 h-11 bg-white border border-gray-200 focus:border-orange-400 focus:ring-orange-200"
                  required
                  minLength={6}
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 mt-2 bg-gradient-to-r from-[#ff5858] to-[#ff9966] text-white font-semibold shadow-md hover:from-[#ff7e5f] hover:to-[#ff9966] transition-all"
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending ? 'Changing...' : 'Change Password'}
              </Button>
              <div className="text-center mt-4">
                <a href="/auth/login" className="text-sm text-orange-600 font-semibold hover:underline transition-colors">Back to Sign in</a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ChangePasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChangePasswordForm />
    </Suspense>
  )
} 