'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import LandingLayout from '@/components/landing/LandingLayout'

const testimonials = [
  {
    name: 'David Thompson',
    role: 'Tech Entrepreneur',
    image: '/testimonials/david.jpg',
    quote: "KLTMINES has transformed my investment strategy. The platform's ease of use and consistent returns have made it an essential part of my financial portfolio."
  },
  {
    name: 'Maria Rodriguez',
    role: 'Small Business Owner',
    image: '/testimonials/maria.jpg',
    quote: "As a small business owner, I needed a reliable investment platform. KLTMINES has exceeded my expectations with their transparent processes and excellent returns."
  },
  {
    name: 'James Wilson',
    role: 'Retired Professional',
    image: '/testimonials/james.jpg',
    quote: "The daily ROI and professional support from KLTMINES have made my retirement planning much more effective. I highly recommend their services."
  },
  {
    name: 'Sarah Chen',
    role: 'Financial Analyst',
    image: '/testimonials/sarah.jpg',
    quote: "From a professional perspective, I'm impressed by KLTMINES's investment strategies and risk management. Their platform is truly innovative."
  },
  {
    name: 'Robert Johnson',
    role: 'Real Estate Developer',
    image: '/testimonials/robert.jpg',
    quote: "KLTMINES has become an integral part of my investment portfolio. Their consistent returns and professional service are unmatched."
  },
  {
    name: 'Emily Parker',
    role: 'Marketing Director',
    image: '/testimonials/emily.jpg',
    quote: "The user-friendly interface and excellent customer support make investing with KLTMINES a pleasure. I've seen remarkable growth in my investments."
  }
]

export default function TestimonialsPage() {
  return (
    <LandingLayout>
      <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <section className="max-w-4xl mx-auto px-4 pt-24 pb-12 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent mb-4">What Our Investors Say</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="text-lg text-gray-600 dark:text-gray-300 mb-8">Real stories from real investors.</motion.p>
        </section>
        <section className="max-w-5xl mx-auto px-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
          {testimonials.map((testimonial, idx) => (
            <motion.div key={testimonial.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: idx * 0.1 }}>
              <Card className="h-full border-2 hover:border-[#ff5858] transition-colors shadow-lg">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden mb-4">
                    <Image 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      fill 
                      className="object-cover"
                      sizes="(max-width: 64px) 100vw, 64px"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{testimonial.name}</h3>
                  <p className="text-sm text-[#ff5858] mb-2">{testimonial.role}</p>
                  <p className="text-gray-600 dark:text-gray-400">"{testimonial.quote}"</p>
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