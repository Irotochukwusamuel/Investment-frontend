import { Button } from '@/components/ui/button'
import {
  BuildingOfficeIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import LandingLayout from '@/components/landing/LandingLayout'

const values = [
  {
    name: 'Innovation',
    description: 'We continuously innovate to provide the best investment solutions.',
    icon: ChartBarIcon,
  },
  {
    name: 'Security',
    description: 'Your investments are protected with state-of-the-art security measures.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Community',
    description: 'We foster a supportive community of investors and partners.',
    icon: UserGroupIcon,
  },
  {
    name: 'Integrity',
    description: 'We operate with complete transparency and ethical standards.',
    icon: BuildingOfficeIcon,
  },
]

export default function AboutPage() {
  return (
    <LandingLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
          <div className="absolute inset-0 bg-gradient-to-b from-[#ff5858]/10 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                About Us
              </h1>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Incorporated in 2023, KLTMINES, a subsidiary of KLT Trading Limited, is on a mission to empower everyone to invest smarter and live better. We provide innovative, secure, and accessible investment and trading solutions to help individuals and businesses achieve financial freedom. Guided by our core values—innovation, security, transparency, and community—we leverage technology and trust to build a more inclusive and sustainable financial future.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                To empower individuals and businesses with innovative investment solutions that drive financial growth and security.
              </p>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Vision</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                To be the leading platform for secure and profitable investments, trusted by millions worldwide.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Values</h2>
              <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {values.map((value) => (
                  <div key={value.name} className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
                    <value.icon className="h-12 w-12 mx-auto text-[#ff5858]" />
                    <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">{value.name}</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Ready to Start Investing?</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Join KLTMINES today and take the first step towards financial freedom.
              </p>
              <div className="mt-8">
                <Button asChild className="bg-gradient-to-r from-[#ff5858] via-[#ff7e5f] to-[#ff9966] text-white hover:opacity-90">
                  <Link href="/auth/register">
                    Get Started
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
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