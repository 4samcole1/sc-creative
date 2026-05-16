import Hero from '@/components/sections/Hero'
import Systems from '@/components/sections/Systems'
import StatsBar from '@/components/sections/StatsBar'
import Problem from '@/components/sections/Problem'
import Services from '@/components/sections/Services'
import Process from '@/components/sections/Process'
import Work from '@/components/sections/Work'
import Testimonials from '@/components/sections/Testimonials'
import PackageBuilder from '@/components/sections/PackageBuilder'
import About from '@/components/sections/About'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Systems />
      <StatsBar />
      <Problem />
      <Services />
      <Process />
      <Work />
      <Testimonials />
      <PackageBuilder />
      <About />
    </>
  )
}
