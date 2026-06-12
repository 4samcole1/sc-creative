// src/app/(marketing)/page.tsx
import Hero from '@/components/sections/Hero'
import TrustBar from '@/components/sections/StatsBar'
import Services from '@/components/sections/Services'
import Approach from '@/components/sections/Approach'

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Services />
      <Approach />
    </>
  )
}
