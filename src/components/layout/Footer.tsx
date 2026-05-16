// src/components/layout/Footer.tsx
import Link from 'next/link'

const serviceLinks = [
  { label: 'Brand Blueprint', href: '/services/brand-blueprint' },
  { label: 'Visual Branding', href: '/services/visual-branding' },
  { label: 'Website Design', href: '/services/website-design' },
  { label: 'AI Systems', href: '/services/ai-systems' },
  { label: 'Growth', href: '/services/growth' },
]

const companyLinks = [
  { label: 'Work', href: '/work' },
  { label: 'Our Process', href: '/process' },
  { label: 'About', href: '/about' },
  { label: 'Insights', href: '/insights' },
  { label: 'Get My Quote', href: '/quote' },
]

const cities = ['Jasper', 'Cordova', 'Sumiton', 'Dora', 'Parrish', 'Carbon Hill', 'Oakman']

export default function Footer() {
  return (
    <footer className="bg-[#0d1f35] text-white pt-16 pb-8">
      <div className="max-w-[1240px] mx-auto px-[60px]">
        <div className="grid grid-cols-4 gap-12 mb-12">
          <div>
            <div className="font-extrabold text-sm tracking-widest uppercase mb-3">SC Creative</div>
            <p className="text-white/50 text-sm leading-relaxed">
              Walker County&apos;s growth partner. Brand, website, AI, and local SEO — built as one system.
            </p>
            <div className="text-white/40 text-xs mt-4">Based in Cordova, AL</div>
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-[.1em] uppercase text-white/40 mb-3">Services</div>
            <ul className="space-y-2">
              {serviceLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/60 hover:text-white text-sm transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-[.1em] uppercase text-white/40 mb-3">Company</div>
            <ul className="space-y-2">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/60 hover:text-white text-sm transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-[11px] font-bold tracking-[.1em] uppercase text-white/40 mb-3">Service Area</div>
            <ul className="space-y-2">
              {cities.map((city) => (
                <li key={city}>
                  <Link href={`/service-area/${city.toLowerCase().replace(' ', '-')}`} className="text-white/60 hover:text-white text-sm transition-colors">{city}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex items-center justify-between text-white/30 text-xs">
          <span>© {new Date().getFullYear()} SC Creative. All rights reserved.</span>
          <span>Walker County, Alabama</span>
        </div>
      </div>
    </footer>
  )
}
