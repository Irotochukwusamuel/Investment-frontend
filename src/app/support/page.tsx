'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'
import LandingLayout from '@/components/landing/LandingLayout'

const contactMethods = [
  {
    name: 'Email Support',
    description: 'Get in touch with our support team via email',
    icon: EnvelopeIcon,
    contact: 'support@kltmines.com',
    link: 'mailto:support@kltmines.com',
  },
  {
    name: 'Telegram Support',
    description: 'Speak directly with our support team',
    icon: PhoneIcon,
    contact: 'https://t.me/kltmines',
    link: 'https://t.me/kltmines',
  }
]

const supportHours = [
  {
    name: 'Customer Support',
    hours: '0-24hrs',
    icon: ClockIcon,
  }
]

export default function SupportPage() {
  return (
    <LandingLayout>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20">
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] bg-clip-text text-transparent mb-4">
                How Can We Help You?
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Our dedicated support team is here to assist you with any questions or concerns you may have.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
              {contactMethods.map((method, index) => (
                <motion.div
                  key={method.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full border-2 hover:border-[#ff5858] transition-colors shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                          <method.icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {method.name}
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {method.description}
                      </p>
                      <a
                        href={method.link}
                        className="text-[#ff5858] hover:text-[#ff7e5f] font-medium"
                      >
                        {method.contact}
                      </a>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Card className="border-2 shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Send Us a Message
                </h2>
                <form className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Name
                      </label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="How can we help?"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your issue or question..."
                      className="w-full min-h-[150px]"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] text-white hover:opacity-90"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Support Hours */}
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Support Hours
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                We're here when you need us
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-1">
              {supportHours.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full border-2 hover:border-[#ff5858] transition-colors shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] p-2 text-white">
                          <item.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {item.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {item.hours}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Find quick answers to common questions
              </p>
            </div>
            <div className="space-y-6">
              <Card className="border-2">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    How do I reset my password?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Click on the "Forgot Password" link on the login page. We'll send you an email with instructions to reset your password.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    How long does it take to process withdrawals?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Withdrawals are typically processed within 24-48 hours. The exact time may vary depending on your payment method and verification status.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    What payment methods do you accept?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We accept various payment methods including bank transfers, credit/debit cards, and cryptocurrency payments.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </LandingLayout>
  )
} 