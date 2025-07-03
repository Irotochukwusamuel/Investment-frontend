'use client'
import { motion } from 'framer-motion'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import LandingLayout from '@/components/landing/LandingLayout'

const faqs = [
  { question: 'How secure is my investment?', answer: 'We use bank-level encryption, two-factor authentication, and regular security audits to ensure your funds and data are always safe.' },
  { question: 'How do I withdraw my earnings?', answer: 'Withdrawals are instant and can be made to your bank account or crypto wallet at any time from your dashboard.' },
  { question: 'What is the minimum investment amount?', answer: 'You can start investing with as little as ₦100,000 or the equivalent in supported currencies.' },
  { question: 'Can businesses or organizations invest?', answer: 'Yes! We offer custom solutions for businesses, organizations, and high-net-worth individuals.' },
]

export default function FAQPage() {
  return (
    <LandingLayout>
      <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <section className="max-w-4xl mx-auto px-4 pt-24 pb-12 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent mb-4">Frequently Asked Questions</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-lg text-gray-600 dark:text-gray-300 mb-8">Everything you need to know about KLTMINES.</motion.p>
        </section>
        <section className="max-w-2xl mx-auto px-4 mb-16">
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