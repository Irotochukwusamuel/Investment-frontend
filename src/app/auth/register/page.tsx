'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useRegister } from '@/lib/hooks/useAuth'
import { toast } from 'sonner'

export default function RegisterPage() {
  const router = useRouter()
  const registerMutation = useRegister()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    agreeToTerms: false,
    referralCode: '',
  })

  // Check for referral code in URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setFormData(prev => ({ ...prev, referralCode: refCode }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (registerMutation.isPending) {
      return // Prevent multiple submissions
    }

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions')
      return
    }
    
    try {
      // Build payload and omit phoneNumber if empty
      const payload: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };
      if (formData.phoneNumber && formData.phoneNumber.trim() !== "") {
        payload.phoneNumber = formData.phoneNumber;
      }
      if (formData.referralCode && formData.referralCode.trim() !== "") {
        payload.referralCode = formData.referralCode;
      }
      const result = await registerMutation.mutateAsync(payload)
      
      toast.success('Registration successful! Please check your email for verification code.')
      
      // Redirect to OTP verification with email and type
      router.push(`/auth/verify-otp?email=${encodeURIComponent(formData.email)}&type=email_verification`)
    } catch (error: any) {
      console.error('Registration error:', error)
      
      // Handle different types of errors
      if (error?.response?.status === 400) {
        const errorMessage = error?.response?.data?.message || 'Registration failed. Please check your details.'
        toast.error(errorMessage)
      } else if (error?.response?.status === 409) {
        toast.error('An account with this email already exists.')
      } else if (error?.response?.status === 500) {
        toast.error('Server error. Please try again later.')
      } else {
        const errorMessage = error?.response?.data?.message || error?.message || 'Registration failed. Please try again.'
        toast.error(errorMessage)
      }
    }
  }

  return (
    <div className="min-h-screen w-full relative flex items-stretch overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 animate-gradient-move" style={{background: 'linear-gradient(120deg, #ff5858, #ff7e5f, #ff9966, #ff5858)', backgroundSize: '200% 200%'}} />
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
              Your Journey to Financial Freedom <span className='text-white'>Starts Here.</span>
            </div>
            <div className="text-lg text-white mb-6 font-medium opacity-90">
              Join KLTMINES and unlock smarter, safer, and more rewarding investments.
            </div>
            <ul className="mb-8 space-y-2">
              <li className="flex items-center text-white text-base opacity-80"><span className="mr-2 text-white">•</span> Trusted by thousands</li>
              <li className="flex items-center text-white text-base opacity-80"><span className="mr-2 text-white">•</span> Automated earnings</li>
              <li className="flex items-center text-white text-base opacity-80"><span className="mr-2 text-white">•</span> Real-time portfolio tracking</li>
            </ul>
          </div>
        </div>
        {/* Right Card */}
        <div className="flex flex-col justify-center items-center flex-1 min-h-screen">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Register</h2>
            <p className="text-sm text-gray-500 mb-6">Create your account to start investing</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="mt-1 h-11 bg-white border border-gray-200 focus:border-orange-400 focus:ring-orange-200"
                    required
                  />
                </div>
              <div>
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
                <Input
                    id="lastName"
                  type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="mt-1 h-11 bg-white border border-gray-200 focus:border-orange-400 focus:ring-orange-200"
                  required
                />
                </div>
              </div>
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
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number <span className="text-gray-400">(optional)</span></Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+234 800 000 0000"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="mt-1 h-11 bg-white border border-gray-200 focus:border-orange-400 focus:ring-orange-200"
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
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                <div className="relative">
                <Input
                  id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="mt-1 h-11 bg-white border border-gray-200 focus:border-orange-400 focus:ring-orange-200 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="referralCode" className="text-sm font-medium text-gray-700">Referral Code <span className="text-gray-400">(optional)</span></Label>
                <Input
                  id="referralCode"
                  type="text"
                  placeholder="Enter referral code (if any)"
                  value={formData.referralCode}
                  onChange={e => setFormData({ ...formData, referralCode: e.target.value })}
                  className="mt-1 h-11 bg-white border border-gray-200 focus:border-orange-400 focus:ring-orange-200"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked: boolean) => setFormData({ ...formData, agreeToTerms: checked })}
                  className="border-gray-300 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                />
                <label htmlFor="terms" className="text-sm font-medium text-gray-700 leading-none">I agree to the <Link href="/terms" className="text-orange-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-orange-600 hover:underline">Privacy Policy</Link></label>
              </div>
              <Button
                type="submit"
                className="w-full h-11 mt-2 bg-gradient-to-r from-[#ff5858] to-[#ff9966] text-white font-semibold shadow-md hover:from-[#ff7e5f] hover:to-[#ff9966] transition-all"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? 'Creating account...' : 'Register'}
              </Button>
              <div className="text-center mt-4">
                <span className="text-sm text-gray-600">Already have an account? </span>
                <Link href="/auth/login" className="text-sm text-orange-600 font-semibold hover:underline transition-colors">Sign in</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 