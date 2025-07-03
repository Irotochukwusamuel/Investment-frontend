import { Suspense } from 'react'
import LandingPageContent from '@/components/landing/LandingPageContent'

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LandingPageContent />
    </Suspense>
  )
}
