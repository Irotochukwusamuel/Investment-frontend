'use client'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { SparklesIcon, ChartBarIcon, CurrencyDollarIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import LandingLayout from '@/components/landing/LandingLayout'

const steps = [
  { step: 'Sign Up', text: 'Create your free account and verify your identity.', icon: SparklesIcon },
  { step: 'Choose Plan', text: 'Select an investment plan that matches your goals.', icon: ChartBarIcon },
  { step: 'Invest', text: 'Fund your account and start investing.', icon: CurrencyDollarIcon },
  { step: 'Earn & Withdraw', text: 'Track your ROI and withdraw earnings anytime.', icon: ArrowRightIcon },
]

export default function HowItWorksPage() {
  return (
    <LandingLayout>
      <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <section className="max-w-4xl mx-auto px-4 pt-24 pb-12 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent mb-4">How It Works</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-lg text-gray-600 dark:text-gray-300 mb-8">Start investing in just a few simple steps.</motion.p>
        </section>
        <section className="max-w-5xl mx-auto px-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {steps.map((step, idx) => (
            <motion.div key={step.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}>
              <Card className="h-full border-2 hover:border-[#ff5858] transition-colors shadow-lg">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-3 text-white mb-4">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{step.step}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{step.text}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>
        <section className="text-center pb-16">
          <Button asChild size="lg" className="bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] text-white hover:opacity-90">
            <Link href="/auth/register">Get Started</Link>
          </Button>
        </section>
      </div>
    </LandingLayout>
  )
} 