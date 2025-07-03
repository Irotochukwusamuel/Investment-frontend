'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForgotPassword } from '@/lib/hooks/useAuth'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const router = useRouter()
  const forgotPasswordMutation = useForgotPassword()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await forgotPasswordMutation.mutateAsync(email)
      toast.success('OTP sent to your email!')
      router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}&type=password_reset`)
    } catch (error: any) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Failed to send OTP. Please try again.')
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password</h2>
          <p className="text-sm text-gray-500 mb-6">Enter your email to receive a one-time code (OTP) for password reset.</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 h-11 bg-white border border-gray-200 focus:border-orange-400 focus:ring-orange-200"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 mt-2 bg-gradient-to-r from-[#ff5858] to-[#ff9966] text-white font-semibold shadow-md hover:from-[#ff7e5f] hover:to-[#ff9966] transition-all"
              disabled={forgotPasswordMutation.isPending}
            >
              {forgotPasswordMutation.isPending ? 'Sending...' : 'Send OTP'}
            </Button>
            <div className="text-center mt-4">
              <a href="/auth/login" className="text-sm text-orange-600 font-semibold hover:underline transition-colors">Back to Sign in</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}