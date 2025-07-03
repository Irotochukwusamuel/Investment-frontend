'use client'

import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import LandingLayout from '@/components/landing/LandingLayout'

export default function PrivacyPage() {
  return (
    <LandingLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-16">
        <section className="max-w-3xl mx-auto px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent text-center">Privacy Policy</motion.h1>
          <Card className="border-2 shadow-lg">
            <CardContent className="p-8 space-y-8 text-gray-700 dark:text-gray-300">
              <section>
                <h2 className="text-2xl font-semibold mb-2">1. Data Collection</h2>
                <p>We collect personal information you provide when registering, investing, or contacting support. This may include your name, email, payment details, and usage data.</p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold mb-2">2. Use of Information</h2>
                <p>Your data is used to provide and improve our services, process transactions, and communicate with you. We do not sell your personal information to third parties.</p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold mb-2">3. Data Security</h2>
                <p>We implement industry-standard security measures to protect your data from unauthorized access, disclosure, or loss.</p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold mb-2">4. Cookies</h2>
                <p>We use cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content. You can manage cookie preferences in your browser settings.</p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold mb-2">5. Contact</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@kltmines.com" className="text-[#ff5858] underline">support@kltmines.com</a>.</p>
              </section>
            </CardContent>
          </Card>
        </section>
      </div>
    </LandingLayout>
  )
} 