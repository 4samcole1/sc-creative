// src/app/(marketing)/page.tsx
import Hero from '@/components/sections/Hero'
import TrustBar from '@/components/sections/StatsBar'
import Ecosystem from '@/components/sections/Systems'
import PartnerCTA from '@/components/sections/PartnerCTA'
import Work from '@/components/sections/Work'
import Community from '@/components/sections/Community'
import Newsletter from '@/components/sections/Newsletter'

// Deferred — to be added back in next design phase
// import Problem from '@/components/sections/Problem'
// import Process from '@/components/sections/Process'
// import PackageBuilder from '@/components/sections/PackageBuilder'
// import About from '@/components/sections/About'
// import Testimonials from '@/components/sections/Testimonials'

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Ecosystem />
      <PartnerCTA />
      <Work />
      <Community />
      <Newsletter />
    </>
  )
}
