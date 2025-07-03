'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  ArrowRightIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
  SparklesIcon,
  BuildingOfficeIcon,
  SunIcon,
  CalendarDaysIcon,
  GiftIcon,
} from '@heroicons/react/24/outline'
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from 'react'
import { AnimatePresence, animate, useMotionValue, useTransform } from 'framer-motion'
import LandingLayout from './LandingLayout'

const features = [
  {
    name: 'Smart Investment Plans',
    description: 'Explore a range of investment plans customized to suit your financial goals and risk profile. Our AI-powered insights are designed to help you optimize returns with confidence and security',
    icon: ChartBarIcon,
  },
  {
    name: 'Secure Transactions',
    description: 'Your investments are protected with state-of-the-art security, encryption, and 24/7 monitoring. We prioritize your safety at every step.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Daily ROI',
    description: 'Benefit from consistent daily returns through our competitive ROI structure, designed to help your investments grow reliably over time.',
    icon: CurrencyDollarIcon,
  },
  {
    name: '24/7 Support',
    description: 'Our dedicated support team is available round the clock to assist you with any questions or issues.',
    icon: ClockIcon,
  },
  {
    name: 'Growing Community',
    description: 'Join thousands of successful investors in our thriving community. Share insights, learn, and grow together.',
    icon: UserGroupIcon,
  },
  {
    name: 'Business Solutions',
    description: 'Custom investment solutions for businesses, organizations, and high-net-worth individuals.',
    icon: BuildingOfficeIcon,
  },
]

const usdtInvestmentPlans = [
  { name: 'Cadet', min: 5, max: 20, dailyROI: 5, welcomeBonus: 2.5 },
  { name: 'Captain', min: 21, max: 35, dailyROI: 5.8, welcomeBonus: 3 },
  { name: 'General', min: 36, max: 50, dailyROI: 6.25, welcomeBonus: 3.5 },
  { name: 'Vanguard', min: 51, max: 99, dailyROI: 6.7, welcomeBonus: 4 },
  { name: 'Admiral', min: 100, max: 150, dailyROI: 7.1, welcomeBonus: 4.5 },
];

const nairaInvestmentPlans = [
  { name: 'Cadet', min: 5000, max: 25000, dailyROI: 5, welcomeBonus: 2.5 },
  { name: 'Captain', min: 26000, max: 35000, dailyROI: 5.8, welcomeBonus: 3 },
  { name: 'General', min: 36000, max: 45000, dailyROI: 6.25, welcomeBonus: 3.5 },
  { name: 'Vanguard', min: 46000, max: 55000, dailyROI: 6.7, welcomeBonus: 4 },
  { name: 'Admiral', min: 156000, max: 250000, dailyROI: 7.1, welcomeBonus: 4.5 },
];

const howItWorks = [
  {
    step: 'Sign Up',
    text: 'Create your free account in seconds and verify your identity securely.',
    icon: SparklesIcon,
  },
  {
    step: 'Choose Plan',
    text: 'Select an investment plan that matches your goals and risk profile.',
    icon: ChartBarIcon,
  },
  {
    step: 'Invest',
    text: 'Fund your account using multiple payment methods and start investing.',
    icon: CurrencyDollarIcon,
  },
  {
    step: 'Earn & Withdraw',
    text: 'Track your ROI and withdraw your earnings anytime, anywhere.',
    icon: ArrowRightIcon,
  },
]

const testimonials = [
  {
    name: 'David Thompson',
    role: 'Tech Entrepreneur',
    image: '/testimonials/david.jpg',
    quote: "KLTMINES has transformed my investment strategy. The platform&apos;s ease of use and consistent returns have made it an essential part of my financial portfolio.",
  },
  {
    name: 'Maria Rodriguez',
    role: 'Small Business Owner',
    image: '/testimonials/maria.jpg',
    quote: "As a small business owner, I needed a reliable investment platform. KLTMINES has exceeded my expectations with their transparent processes and excellent returns.",
  },
  {
    name: 'James Wilson',
    role: 'Retired Professional',
    image: '/testimonials/james.jpg',
    quote: "The daily ROI and professional support from KLTMINES have made my retirement planning much more effective. I highly recommend their services.",
  },
]

const faqs = [
  {
    question: 'How secure is my investment?',
    answer: 'We use bank-level encryption, two-factor authentication, and regular security audits to ensure your funds and data are always safe.'
  },
  {
    question: 'How do I withdraw my earnings?',
    answer: 'Withdrawals are instant and can be made to your bank account or crypto wallet at any time from your dashboard.'
  },
  {
    question: 'What is the minimum investment amount?',
    answer: 'You can start investing with as little as ₦5,000 or the equivalent in supported currencies.'
  },
  {
    question: 'Can businesses or organizations invest?',
    answer: 'Yes! We offer custom solutions for businesses, organizations, and high-net-worth individuals.'
  },
]

export default function LandingPageContent() {
  const AnimatedCounter = ({ value, precision = 0 }: { value: number; precision?: number }) => {
    const count = useMotionValue(0)
    const rounded = useTransform(count, (latest) => latest.toFixed(precision))

    useEffect(() => {
      const controls = animate(count, value, { duration: 0.8, ease: "easeOut" })
      return controls.stop
    }, [value])

    return <motion.span>{rounded}</motion.span>
  }

  const InvestmentCalculator = () => {
    const [currency, setCurrency] = useState<'usdt' | 'naira'>('usdt');
    const investmentPlans = currency === 'usdt' ? usdtInvestmentPlans : nairaInvestmentPlans;
    const minAmount = investmentPlans[0].min;
    const maxAmount = investmentPlans[investmentPlans.length - 1].max;

    const [amount, setAmount] = useState(currency === 'usdt' ? 50 : 50000);

    useEffect(() => {
      setAmount(currency === 'usdt' ? usdtInvestmentPlans[2].min : nairaInvestmentPlans[2].min);
    }, [currency]);

    const handleAmountChange = (value: string) => {
      if (value === '') {
        setAmount(0);
        return;
      }
      const numValue = Number(value.replace(/,/g, ''));
      if (!isNaN(numValue)) {
        setAmount(numValue);
      }
    };

    const handleBlur = () => {
      if (amount === 0) return;

      const selectedPlan = [...investmentPlans].reverse().find(p => amount >= p.min);

      if (!selectedPlan) {
        setAmount(minAmount);
      } else if (amount > selectedPlan.max) {
        setAmount(selectedPlan.max);
      } else if (amount < minAmount) {
        setAmount(minAmount);
      }
    };

    const handleSliderChange = (value: number[]) => {
      setAmount(value[0]);
    };

    const plan = [...investmentPlans].reverse().find(p => amount >= p.min);

    const dailyReturn = plan ? amount * (plan.dailyROI / 100) : 0;
    const hourlyReturn = dailyReturn / 24;
    const monthlyReturn = dailyReturn * 30;
    const welcomeBonusValue = plan ? amount * (plan.welcomeBonus / 100) : 0;

    return (
      <Card className="relative overflow-hidden rounded-3xl border-2 border-white/20 bg-gray-900/50 p-2 shadow-2xl backdrop-blur-xl">
        <div className="absolute -inset-4 z-0 animate-gradient-move-slow bg-gradient-to-br from-purple-600/20 via-orange-500/20 to-red-600/20 blur-2xl" />
        <style jsx global>{`
          @keyframes gradient-move-slow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-move-slow {
            background-size: 200% 200%;
            animation: gradient-move-slow 15s ease-in-out infinite;
          }
        `}</style>
        <div className="relative z-10 grid grid-cols-1 gap-8 rounded-2xl bg-white/60 p-8 shadow-inner backdrop-blur-md dark:bg-gray-900/60 md:grid-cols-2">
          {/* Left side: Inputs */}
          <motion.div 
            key="calculator-input"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center space-y-8"
          >
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Estimate Your Profit</h3>
              <p className="text-gray-600 dark:text-gray-300">Enter an amount to see your potential returns.</p>
            </div>
            
            <div className="flex justify-center">
              <div className="flex space-x-1 rounded-full bg-gray-200 dark:bg-gray-700 p-1">
                <button
                  onClick={() => setCurrency('usdt')}
                  className={`relative px-4 py-2 text-sm font-semibold text-gray-800 dark:text-white transition-colors duration-300`}
                >
                  {currency === 'usdt' && <motion.span layoutId="calculator-currency-bg" className="absolute inset-0 rounded-full bg-white dark:bg-gray-900 shadow" />}
                  <span className="relative z-10">USDT</span>
                </button>
                <button
                  onClick={() => setCurrency('naira')}
                  className={`relative px-4 py-2 text-sm font-semibold text-gray-800 dark:text-white transition-colors duration-300`}
                >
                  {currency === 'naira' && <motion.span layoutId="calculator-currency-bg" className="absolute inset-0 rounded-full bg-white dark:bg-gray-900 shadow" />}
                  <span className="relative z-10">Naira</span>
                </button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="investment-amount" className="text-sm font-medium text-gray-700 dark:text-gray-300">Investment Amount ({currency === 'usdt' ? 'USDT' : 'NGN'})</Label>
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl font-semibold text-[#ff5858]">{currency === 'usdt' ? '$' : '₦'}</span>
                <Input
                  id="investment-amount"
                  type="text"
                  value={amount === 0 ? '' : amount.toLocaleString()}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  onBlur={handleBlur}
                  className="w-full rounded-full border-2 border-gray-200 bg-white py-3 pl-10 pr-4 text-2xl font-bold text-gray-900 focus:border-[#ff7e5f] focus:ring-[#ff7e5f] dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  min={minAmount}
                  max={maxAmount}
                />
              </div>
            </div>
            
            <Slider
              value={[amount]}
              onValueChange={handleSliderChange}
              min={minAmount}
              max={maxAmount}
              step={currency === 'usdt' ? 1 : 1000}
            />
            
            <div className="flex items-center justify-between rounded-full bg-gray-100 p-3 dark:bg-gray-800">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Selected Plan:</span>
              <div className="font-bold text-[#ff5858]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={plan ? plan.name : 'N/A'}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {plan ? plan.name : 'N/A'}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
          
          {/* Right side: Results */}
          <motion.div
            key="calculator-output"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl bg-gradient-to-br from-[#ff5858] to-[#ff9966] p-8 text-white shadow-lg"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-6 w-6 opacity-80" />
                  <span className="font-medium">Hourly Return</span>
                </div>
                <span className="text-2xl font-bold">
                  {currency === 'usdt' ? '$' : '₦'}<AnimatedCounter value={hourlyReturn} precision={currency === 'usdt' ? 5 : 2} />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <SunIcon className="h-6 w-6 opacity-80" />
                  <span className="font-medium">Daily Return</span>
                </div>
                <span className="text-2xl font-bold">
                  {currency === 'usdt' ? '$' : '₦'}<AnimatedCounter value={dailyReturn} precision={2} />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CalendarDaysIcon className="h-6 w-6 opacity-80" />
                  <span className="font-medium">Monthly Return</span>
                </div>
                <span className="text-2xl font-bold">
                  {currency === 'usdt' ? '$' : '₦'}<AnimatedCounter value={monthlyReturn} precision={2} />
                </span>
              </div>
              <div className="my-4 border-t border-white/20" />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <GiftIcon className="h-6 w-6 opacity-80" />
                  <span className="font-medium">Welcome Bonus</span>
                </div>
                <span className="text-2xl font-bold">
                  {currency === 'usdt' ? '$' : '₦'}<AnimatedCounter value={welcomeBonusValue} precision={2} />
                </span>
              </div>
              <Button asChild size="lg" className="w-full bg-white text-[#ff5858] hover:bg-white/90 shadow-md">
                <Link href="/auth/register">
                  Start Investing Now
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </Card>
    )
  }

  return (
    <LandingLayout>
      <div className="relative">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-20 flex flex-col-reverse lg:flex-row items-center gap-12">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex-1 text-center lg:text-left"
            >
              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-6">
                <span className="block bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent">
                  Building Wealth, Securing Your Future.
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
                KLTMINES empowers you to grow your wealth with advanced investment plans, daily ROI, and a secure, beautiful dashboard. Join thousands of investors building their future today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] text-white hover:opacity-90"
                >
                  <Link href="/auth/register">
                    Get Started
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2"
                >
                  <Link href="/about">
                    Learn More
                  </Link>
                </Button>
              </div>
            </motion.div>
            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex-1 flex justify-center"
            >
              <Image
                src="/images/hero.png"
                alt="KLTMINES Investment Platform Hero"
                width={500}
                height={400}
                className="rounded-3xl shadow-2xl object-cover border-4 border-white dark:border-gray-900"
                priority
              />
            </motion.div>
          </div>
        </section>

        {/* About/Stats Section */}
        <section className="bg-white dark:bg-gray-900 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Founded in 2023, KLTMINES was created to democratize smart investing for everyone. Our mission is to empower individuals and businesses to achieve financial freedom through innovative, secure, and accessible investment solutions.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">10,000+</p>
                  <p className="text-sm text-gray-500">Active Investors</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">$50M+</p>
                  <p className="text-sm text-gray-500">Total Investments</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">5-10%</p>
                  <p className="text-sm text-gray-500">Daily ROI</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">99.9%</p>
                  <p className="text-sm text-gray-500">Success Rate</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex justify-center"
            >
              <Image
                src="/images/about.jpg"
                alt="About KLTMINES"
                width={400}
                height={350}
                className="rounded-2xl shadow-xl object-cover border-4 border-white dark:border-gray-900"
              />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Why Choose <span className="bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent">KLTMINES?</span>
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Experience the best investment platform with our unique features
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full border-2 hover:border-[#ff5858] transition-colors shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                          <feature.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {feature.name}
                        </h3>
                      </div>
                      <p className="mt-4 text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Investment Calculator Section */}
        <section className="bg-white dark:bg-gray-900 py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Investment <span className="bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent">Calculator</span>
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Estimate your potential returns in real-time.
              </p>
            </div>
            <InvestmentCalculator />
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="bg-gray-50 dark:bg-gray-800 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Start investing in just a few simple steps
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full border-2 hover:border-[#ff5858] transition-colors shadow-lg">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-3 text-white mb-4">
                        <step.icon className="h-8 w-8" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {step.step}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {step.text}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                What Our Investors Say
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Real stories from real investors
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full border-2 hover:border-[#ff5858] transition-colors shadow-lg">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="relative h-16 w-16 rounded-full overflow-hidden mb-4">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-[#ff5858] mb-2">{testimonial.role}</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {testimonial.quote}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery/Media Section */}
        <section className="bg-white dark:bg-gray-900 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                See KLTMINES in Action
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Explore our platforms beautiful, intuitive interface
              </p>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="/images/stock-exchange.jpg"
                  alt="Stock Exchange"
                  width={400}
                  height={250}
                  className="rounded-xl shadow-xl object-cover border-4 border-white dark:border-gray-900"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Image
                  src="/images/forex-trading.jpg"
                  alt="Forex Trading Interface"
                  width={400}
                  height={250}
                  className="rounded-xl shadow-xl object-cover border-4 border-white dark:border-gray-900"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Image
                  src="/images/analytics-mockup.png"
                  alt="Financial Analytics Dashboard"
                  width={400}
                  height={250}
                  className="rounded-xl shadow-xl object-cover border-4 border-white dark:border-gray-900"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gray-50 dark:bg-gray-900 py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Everything you need to know about KLTMINES
              </p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, idx) => (
                <AccordionItem value={`faq-${idx}`} key={faq.question}>
                  <AccordionTrigger className="text-lg font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] py-16 sm:py-24">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to Start Your Investment Journey?
              </h2>
              <p className="mt-4 text-lg text-white/90">
                Join thousands of successful investors and start earning today
              </p>
              <div className="mt-8">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-[#ff5858] hover:bg-white/90"
                >
                  <Link href="/auth/register">
                    Get Started Now
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </LandingLayout>
  )
} 