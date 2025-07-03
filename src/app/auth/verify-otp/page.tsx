'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useVerifyOtp, useResendOtp } from '@/lib/hooks/useAuth'
import { toast } from 'sonner'

function VerifyOtpForm() {
  const [otp, setOtp] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const email = searchParams.get('email') || ''
  const type = (searchParams.get('type') as 'email_verification' | 'password_reset' | 'login') || 'email_verification'
  const next = searchParams.get('next') || 'dashboard'
  
  const verifyOtpMutation = useVerifyOtp()
  const resendOtpMutation = useResendOtp()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!email) {
      toast.error('Email is required')
      return
    }

    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }
    
    try {
      const result = await verifyOtpMutation.mutateAsync({
        email,
        otp,
        type,
      })
      
      if (type === 'email_verification') {
        toast.success('Email verified successfully! Welcome to KLTMINES!')
      } else {
        toast.success('OTP verified successfully!')
      }
      
      setSubmitted(true)
      
      setTimeout(() => {
        if (type === 'password_reset') {
          const resetToken = result.resetToken;
          if (resetToken) {
            router.push(`/auth/change-password?email=${encodeURIComponent(email)}&resetToken=${resetToken}`)
          } else {
            router.push('/auth/forgot-password')
          }
        } else {
          router.push('/dashboard')
        }
      }, 1000)
    } catch (error: any) {
      console.error('OTP verification error:', error)
      
      // Handle different types of errors
      if (error?.response?.status === 400) {
        const errorMessage = error?.response?.data?.message || 'Invalid or expired OTP.'
        toast.error(errorMessage)
      } else {
        toast.error('Invalid OTP. Please try again.')
      }
    }
  }

  const handleResendOtp = async () => {
    if (!email) {
      toast.error('Email is required')
      return
    }
    
    try {
      await resendOtpMutation.mutateAsync({
        email,
        type,
      })
      
      toast.success('OTP resent successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP. Please try again.')
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {type === 'email_verification' ? 'Verify Your Email' : 'Verify OTP'}
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {type === 'email_verification' 
              ? `We've sent a 6-digit verification code to ${email || 'your email'}. Please enter it below to complete your registration.`
              : `Enter the 6-digit code sent to ${email || 'your email'} to continue.`
            }
          </p>
          {submitted ? (
            <div className="text-green-600 text-center font-medium py-8">
              OTP verified! Redirecting...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="otp" className="text-sm font-medium text-gray-700">OTP Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="mt-1 h-11 bg-white border border-gray-200 focus:border-orange-400 focus:ring-orange-200 tracking-widest text-center text-lg font-mono"
                  required
                  maxLength={6}
                  pattern="[0-9]{6}"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-11 mt-2 bg-gradient-to-r from-[#ff5858] to-[#ff9966] text-white font-semibold shadow-md hover:from-[#ff7e5f] hover:to-[#ff9966] transition-all"
                disabled={verifyOtpMutation.isPending || otp.length !== 6}
              >
                {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
              </Button>
              
              <div className="text-center mt-4 space-y-2">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendOtpMutation.isPending}
                  className="text-sm text-orange-600 font-semibold hover:underline transition-colors disabled:opacity-50"
                >
                  {resendOtpMutation.isPending ? 'Resending...' : 'Resend OTP'}
                </button>
                <div>
                  <a href="/auth/login" className="text-sm text-gray-600 hover:underline transition-colors">
                    Back to Sign in
                  </a>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpForm />
    </Suspense>
  )
} 