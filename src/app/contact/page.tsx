'use client'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import LandingLayout from '@/components/landing/LandingLayout'

export default function ContactPage() {
  return (
    <LandingLayout>
      <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <section className="max-w-2xl mx-auto px-4 pt-24 pb-12 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent mb-4">Contact Us</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-lg text-gray-600 dark:text-gray-300 mb-8">We love to hear from you! Fill out the form below and our team will get back to you soon.</motion.p>
        </section>
        <section className="max-w-xl mx-auto px-4 mb-16">
          <form className="space-y-6 bg-white/80 dark:bg-gray-900/80 p-8 rounded-2xl shadow-xl">
            <Input type="text" placeholder="Your Name" required className="bg-white/90 dark:bg-gray-900/90" />
            <Input type="email" placeholder="Your Email" required className="bg-white/90 dark:bg-gray-900/90" />
            <Textarea placeholder="Your Message" rows={5} required className="bg-white/90 dark:bg-gray-900/90" />
            <Button type="submit" className="w-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] text-white hover:opacity-90">Send Message</Button>
          </form>
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