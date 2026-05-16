import Hero from '@/components/sections/Hero'
import Systems from '@/components/sections/Systems'
import Process from '@/components/sections/Process'
import Problem from '@/components/sections/Problem'
import Services from '@/components/sections/Services'
import Industries from '@/components/sections/Industries'
import Work from '@/components/sections/Work'
import Testimonials from '@/components/sections/Testimonials'
import About from '@/components/sections/About'
import PackageBuilder from '@/components/sections/PackageBuilder'
import CTA from '@/components/sections/CTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Systems />
      <Process />
      <Problem />
      <Services />
      <Industries />
      <Work />
      <Testimonials />
      <About />
      <PackageBuilder />
      <CTA />
    </>
  )
}
