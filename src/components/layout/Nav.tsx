// src/components/layout/Nav.tsx
'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'Work', href: '/work' },
  { label: 'Blueprint', href: '/services/brand-blueprint' },
  { label: 'Branding', href: '/services/visual-branding' },
  { label: 'Website', href: '/services/website-design' },
  { label: 'AI Solutions', href: '/services/ai-systems' },
  { label: 'Growth', href: '/services/growth' },
  { label: 'About', href: '/about' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#071426]/95 backdrop-blur-md border-b border-white/[0.08]'
          : 'bg-white/[0.03] backdrop-blur-sm border-b border-white/[0.05]'
      }`}
      style={{ height: '88px' }}
    >
      <div className="max-w-[1500px] mx-auto px-8 flex items-center h-full">
        <Link
          href="/"
          className="font-extrabold text-white text-sm tracking-widest uppercase shrink-0 mr-10"
          aria-label="SC Creative"
        >
          SC Creative
        </Link>
        <div className="flex items-center gap-7 flex-1 justify-center">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-white/70 hover:text-white text-sm font-medium transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <Link
          href="/contact"
          className="shrink-0 bg-[#009898] text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:bg-[#0EB1AB] hover:shadow-[0_0_20px_rgba(14,177,171,0.4)] transition-all duration-200"
        >
          Get In Touch
        </Link>
      </div>
    </nav>
  )
}
