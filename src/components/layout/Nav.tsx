// src/components/layout/Nav.tsx
'use client'
import Link from 'next/link'
import { useState } from 'react'

const services = [
  { label: 'Brand Blueprint', href: '/services/brand-blueprint' },
  { label: 'Visual Branding', href: '/services/visual-branding' },
  { label: 'Website Design', href: '/services/website-design' },
  { label: 'AI Systems', href: '/services/ai-systems' },
  { label: 'Growth', href: '/services/growth' },
]

const industries = [
  { label: 'Home & Trade Services', href: '/industries/home-trade' },
  { label: 'Medical & Dental', href: '/industries/medical-dental' },
  { label: 'Legal & Professional', href: '/industries/legal-professional' },
  { label: 'Construction & Contractors', href: '/industries/construction' },
  { label: 'Financial & Accounting', href: '/industries/financial' },
  { label: 'Automotive', href: '/industries/automotive' },
  { label: 'Senior Care & Wellness', href: '/industries/senior-care' },
  { label: 'Real Estate', href: '/industries/real-estate' },
]

const serviceAreas = [
  { label: 'Walker County', href: '/service-area' },
  { label: 'Jasper', href: '/service-area/jasper' },
  { label: 'Cordova', href: '/service-area/cordova' },
  { label: 'Sumiton', href: '/service-area/sumiton' },
  { label: 'Dora', href: '/service-area/dora' },
  { label: 'Parrish', href: '/service-area/parrish' },
  { label: 'Carbon Hill', href: '/service-area/carbon-hill' },
  { label: 'Oakman', href: '/service-area/oakman' },
]

function Dropdown({ label, items }: { label: string; items: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="text-white/75 hover:text-white text-sm font-medium flex items-center gap-1 py-1">
        {label} <span className="text-xs">▾</span>
      </button>
      {open && (
        <div className="absolute top-full left-0 bg-[#0d1f35] border border-white/10 rounded-lg py-2 min-w-[220px] shadow-xl z-50">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-sm text-white/75 hover:text-white hover:bg-white/5 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Nav() {
  return (
    <nav className="bg-[#0d1f35] sticky top-0 z-50 border-b border-white/[0.06]">
      <div className="max-w-[1240px] mx-auto px-[60px] flex items-center h-[68px] gap-8">
        <Link href="/" className="font-extrabold text-white text-sm tracking-widest uppercase" aria-label="SC Creative">
          SC Creative
        </Link>
        <div className="flex items-center gap-6 flex-1">
          <Link href="/work" className="text-white/75 hover:text-white text-sm font-medium">Work</Link>
          <Dropdown label="Services" items={services} />
          <Dropdown label="Industries" items={industries} />
          <Dropdown label="Service Area" items={serviceAreas} />
          <Link href="/about" className="text-white/75 hover:text-white text-sm font-medium">About</Link>
          <Link href="/insights" className="text-white/75 hover:text-white text-sm font-medium">Insights</Link>
        </div>
        <Link
          href="/quote"
          className="ml-auto bg-[#00b5a5] text-white text-[13px] font-bold px-[22px] py-[9px] rounded-[5px] hover:opacity-90 transition-opacity"
        >
          Get My Quote →
        </Link>
      </div>
    </nav>
  )
}
