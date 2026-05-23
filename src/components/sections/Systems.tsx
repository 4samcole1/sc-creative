// src/components/sections/Systems.tsx
import Link from 'next/link'

const pillars = [
  {
    num: '01',
    title: 'Blueprint',
    description: 'Clarify your message, positioning, and strategy so everything else works better.',
    bullets: ['Messaging Strategy', 'Market Research', 'Competitive Analysis', 'Growth Strategy'],
    href: '/services/brand-blueprint',
    iconBg: '#6366f1',
  },
  {
    num: '02',
    title: 'Branding',
    description: 'Complete visual identity systems that create trust, recognition, and consistency.',
    bullets: ['Logo & Identity Design', 'Color & Typography', 'Brand Guidelines', 'Marketing Assets'],
    href: '/services/visual-branding',
    iconBg: '#3b82f6',
  },
  {
    num: '03',
    title: 'Website',
    description: 'High-performance websites and platforms built for modern businesses and designed to convert.',
    bullets: ['Custom Websites', 'E-Commerce', 'Web Applications', 'Maintenance & Hosting'],
    href: '/services/website-design',
    iconBg: '#009898',
  },
  {
    num: '04',
    title: 'AI Solutions',
    description: 'Intelligent systems that automate, streamline, and modernize the way your business operates.',
    bullets: ['Custom Applications', 'Workflow Automation', 'Dashboards & Analytics', 'AI Integrations'],
    href: '/services/ai-systems',
    iconBg: '#8b5cf6',
  },
  {
    num: '05',
    title: 'Growth',
    description: 'Data-driven marketing and visibility strategies that increase exposure, attract customers, and scale.',
    bullets: ['SEO & Local SEO', 'Paid Advertising', 'Content & Backlinks', 'Analytics & Reporting'],
    href: '/services/growth',
    iconBg: '#f59e0b',
  },
]

export default function Ecosystem() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-[1500px] mx-auto px-8">
        <div className="text-center mb-16">
          <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#009898] mb-4">
            The SC Creative Ecosystem
          </div>
          <h2 className="text-[clamp(28px,3vw,48px)] font-black text-gray-900 leading-[1.15] mb-5">
            Everything your business needs to grow.
          </h2>
          <p className="text-[17px] text-gray-500 leading-[1.7] max-w-[600px] mx-auto">
            Five pillars working together to build strong foundations, streamline operations,
            and drive measurable growth.
          </p>
        </div>

        <div className="grid grid-cols-5 gap-5">
          {pillars.map((p) => (
            <div
              key={p.num}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="text-[11px] font-bold tracking-[0.15em] text-gray-300 mb-3">{p.num}</div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-white text-sm font-black"
                style={{ background: p.iconBg }}
              >
                {p.title[0]}
              </div>
              <h3 className="font-black text-gray-900 text-lg mb-2">{p.title}</h3>
              <p className="text-gray-500 text-[13px] leading-relaxed mb-4">{p.description}</p>
              <ul className="space-y-1.5 mb-5">
                {p.bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-[12px] text-gray-500">
                    <span style={{ color: p.iconBg }}>✓</span> {b}
                  </li>
                ))}
              </ul>
              <Link
                href={p.href}
                className="text-[13px] font-bold transition-colors"
                style={{ color: p.iconBg }}
              >
                Learn More →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
