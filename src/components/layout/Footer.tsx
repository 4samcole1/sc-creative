// src/components/layout/Footer.tsx
import Link from 'next/link'

const quickLinks = [
  { label: 'Work', href: '/work' },
  { label: 'Blueprint', href: '/services/brand-blueprint' },
  { label: 'Branding', href: '/services/visual-branding' },
  { label: 'Website', href: '/services/website-design' },
  { label: 'AI Solutions', href: '/services/ai-systems' },
  { label: 'Growth', href: '/services/growth' },
  { label: 'About', href: '/about' },
]

const resources = [
  { label: 'Blog', href: '/blog' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Process', href: '/process' },
  { label: 'Careers', href: '/careers' },
]

const socials = [
  { id: 'fb', label: 'Facebook', href: '#' },
  { id: 'ig', label: 'Instagram', href: '#' },
  { id: 'li', label: 'LinkedIn', href: '#' },
  { id: 'tw', label: 'Twitter', href: '#' },
  { id: 'yt', label: 'YouTube', href: '#' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#020617' }} className="text-white pt-20 pb-8">
      <div className="max-w-[1500px] mx-auto px-8">
        <div className="grid grid-cols-4 gap-12 mb-16">
          {/* Column 1 — Brand */}
          <div>
            <div className="font-extrabold text-sm tracking-widest uppercase mb-4">SC Creative</div>
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

          {/* Column 2 — Quick Links */}
          <div>
            <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/30 mb-5">
              Quick Links
            </div>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-white/50 hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Resources */}
          <div>
            <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/30 mb-5">
              Resources
            </div>
            <ul className="space-y-3">
              {resources.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-white/50 hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/30 mb-5">
              Contact
            </div>
            <ul className="space-y-3 mb-6">
              <li className="text-white/50 text-sm">Jasper, AL</li>
              <li>
                <a
                  href="mailto:info@samcolecreative.com"
                  className="text-white/50 hover:text-white text-sm transition-colors"
                >
                  info@samcolecreative.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+16789971106"
                  className="text-white/50 hover:text-white text-sm transition-colors"
                >
                  (678) 997-1106
                </a>
              </li>
            </ul>
            <Link
              href="/contact"
              className="inline-block bg-[#009898] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#0EB1AB] transition-colors text-sm"
            >
              Get In Touch →
            </Link>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-6 flex items-center justify-between text-white/20 text-xs">
          <span>© {new Date().getFullYear()} SC Creative. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white/40 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white/40 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
