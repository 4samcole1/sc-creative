// src/components/layout/Footer.tsx
import Link from 'next/link'
import Image from 'next/image'
import Btn from '@/components/ui/Btn'

const quickLinks = [
  { label: 'Work',         href: '/work' },
  { label: 'Blueprint',    href: '/services/brand-blueprint' },
  { label: 'Branding',     href: '/services/visual-branding' },
  { label: 'Website',      href: '/services/website-design' },
  { label: 'AI Solutions', href: '/services/ai-systems' },
  { label: 'Growth',       href: '/services/growth' },
  { label: 'About',        href: '/about' },
]

const resources = [
  { label: 'Blog',         href: '/blog' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'FAQs',         href: '/faqs' },
  { label: 'Process',      href: '/process' },
  { label: 'Careers',      href: '/careers' },
]

export default function Footer({
  logoLightUrl, phone, email, address,
  facebookUrl, instagramUrl, linkedinUrl, twitterUrl, youtubeUrl,
}: {
  logoLightUrl?: string; phone?: string; email?: string; address?: string
  facebookUrl?: string; instagramUrl?: string; linkedinUrl?: string
  twitterUrl?: string; youtubeUrl?: string
}) {
  const logoSrc = logoLightUrl || '/images/logo-white.png'
  const displayPhone = phone || '(678) 997-1106'
  const displayEmail = email || 'info@samcolecreative.com'
  const displayAddress = address || 'Jasper, AL'
  const socials = [
    { id: 'fb', label: 'Facebook',  href: facebookUrl },
    { id: 'ig', label: 'Instagram', href: instagramUrl },
    { id: 'li', label: 'LinkedIn',  href: linkedinUrl },
    { id: 'tw', label: 'Twitter',   href: twitterUrl },
    { id: 'yt', label: 'YouTube',   href: youtubeUrl },
  ].filter((s): s is { id: string; label: string; href: string } => Boolean(s.href))

  return (
    <footer style={{ background: '#020617' }} className="text-white pt-20 pb-8">
      <div className="max-w-[1200px] mx-auto px-10">
        <div className="grid grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: 'inline-block', lineHeight: 0, marginBottom: '16px' }}>
              <Image
                src={logoSrc}
                alt="SC Creative"
                width={160}
                height={23}
                style={{ height: '23px', width: 'auto' }}
                unoptimized={logoSrc.startsWith('http')}
              />
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Modern growth solutions for businesses across Walker County, Alabama and surrounding areas.
            </p>
            <div className="flex gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.id}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center text-white/30 text-[10px] font-bold uppercase hover:border-[#009898]/40 hover:text-[#009898] transition-colors"
                >
                  {s.id}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/30 mb-5">Quick Links</div>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/50 hover:text-white text-sm transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/30 mb-5">Resources</div>
            <ul className="space-y-3">
              {resources.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/50 hover:text-white text-sm transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/30 mb-5">Contact</div>
            <ul className="space-y-3 mb-6">
              <li className="text-white/50 text-sm">{displayAddress}</li>
              <li>
                <a href={`mailto:${displayEmail}`} className="text-white/50 hover:text-white text-sm transition-colors">
                  {displayEmail}
                </a>
              </li>
              <li>
                <a href={`tel:${displayPhone.replace(/[^0-9+]/g, '')}`} className="text-white/50 hover:text-white text-sm transition-colors">
                  {displayPhone}
                </a>
              </li>
            </ul>
            <Btn href="/contact" variant="primary">Get In Touch →</Btn>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-6 flex items-center justify-between text-white/20 text-xs">
          <span>© {new Date().getFullYear()} SC Creative. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white/40 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/40 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
