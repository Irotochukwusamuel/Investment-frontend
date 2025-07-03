'use client'

import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import LandingLayout from '@/components/landing/LandingLayout'

export default function TermsPage() {
  return (
    <LandingLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-16">
        <section className="max-w-3xl mx-auto px-4">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent text-center">Terms & Conditions</motion.h1>
          <Card className="border-2 shadow-lg">
            <CardContent className="p-8 space-y-8 text-gray-700 dark:text-gray-300">
              <section>
                <h2 className="text-2xl font-semibold mb-2">1. User Agreement</h2>
                <p>By accessing or using the KLTMINES platform, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, please do not use our services.</p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold mb-2">2. Acceptable Use</h2>
                <p>You agree not to misuse the platform, attempt unauthorized access, or engage in any activity that could harm the service or other users. All investments are subject to our compliance and verification procedures.</p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold mb-2">3. Limitation of Liability</h2>
                <p>KLTMINES is not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Investment involves risk, and past performance does not guarantee future results.</p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold mb-2">4. Changes to Terms</h2>
                <p>We reserve the right to update these Terms at any time. Continued use of the platform after changes constitutes acceptance of the new Terms.</p>
              </section>
              <section>
                <h2 className="text-2xl font-semibold mb-2">5. Contact</h2>
                <p>If you have any questions about these Terms, please contact us at <a href="mailto:support@kltmines.com" className="text-[#ff5858] underline">support@kltmines.com</a>.</p>
              </section>
            </CardContent>
          </Card>
        </section>
      </div>
    </LandingLayout>
  )
} 